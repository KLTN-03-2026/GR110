import { ObjectId } from 'mongodb'
import { env } from '~/config/environment'
import {
  BadRequestErrorResponse,
  ErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import SubscriptionRepo from '~/repo/subscription.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import PaymentRepo from '../repo/payment.repo'
import { mongoClientInstance } from '~/config/mongodb'
import TransactionRepo from '~/repo/transaction.repo'
import { emitPayment } from '~/realtime/realtimeEmitters/payment.emitter'
import PlanRepo from '~/repo/adminPlan.repo'
import { deleteActiveSubscriptionCache } from '~/helpers/subscription.cache'
import axios from 'axios'
import { sendUpgradePaymentSuccessMail } from '~/helpers/sendMailPayment'
export default class SubscriptionService {
  static createSubscription = async ({ workspaceId, planId }) => {
    if (!workspaceId || !ObjectId.isValid(workspaceId)) {
      throw new BadRequestErrorResponse('Invalid workspace id')
    }

    if (!planId || !ObjectId.isValid(planId)) {
      throw new BadRequestErrorResponse('Invalid plan id')
    }

    const workspaceObjectId = new ObjectId(workspaceId)
    const planObjectId = new ObjectId(planId)
    const normalizedPlanId = planObjectId.toString()

    const session = await mongoClientInstance.startSession()
    let result = null

    try {
      await session.withTransaction(async () => {
        const syncPendingPaymentAndTransaction = async ({ subscriptionId }) => {
          const pendingTransaction = await TransactionRepo.findOne({
            filter: {
              code: `UPWS${subscriptionId}`,
              status: 'pending'
            },
            options: { session }
          })

          if (!pendingTransaction) {
            await this.createInitialPaymentAndTransaction({
              subscriptionId,
              plan,
              session
            })
            return
          }

          await TransactionRepo.updateOne({
            filter: { _id: pendingTransaction._id, status: 'pending' },
            data: {
              $set: {
                transferAmount: Number(plan.currentPrice || 0),
                updatedAt: new Date()
              }
            },
            session
          })
        }

        const [workspace, plan, existingSubscription] = await Promise.all([
          WorkspaceRepo.findOne({
            filter: { _id: workspaceObjectId, status: 'active' },
            options: { session }
          }),
          PlanRepo.findOne({
            filter: { _id: planObjectId, status: 'active' },
            options: { session }
          }),
          SubscriptionRepo.findOne({
            filter: { workspaceId, status: 'pending' },
            options: { session }
          })
        ])

        if (!workspace) {
          throw new NotFoundErrorResponse('Workspace not found')
        }

        if (!plan) {
          throw new NotFoundErrorResponse('Plan not found')
        }

        const existingPlanId = existingSubscription?.planId?.toString?.()

        if (existingSubscription && existingPlanId === normalizedPlanId) {
          result = {
            subscription: {
              id: existingSubscription._id.toString(),
              status: existingSubscription.status,
              startedAt: existingSubscription.startedAt,
              endedAt: existingSubscription.endedAt
            }
          }

          await syncPendingPaymentAndTransaction({
            subscriptionId: existingSubscription._id.toString()
          })

          return
        }

        const startedAt = new Date()
        const endedAt = new Date(startedAt.getTime() + 30 * 24 * 60 * 60 * 1000)

        if (existingSubscription) {
          await SubscriptionRepo.updateOne({
            filter: { _id: existingSubscription._id },
            data: {
              $set: {
                planId,
                startedAt,
                endedAt,
                planFeatureSnapshot: plan.feature,
                updatedAt: new Date()
              }
            },
            session
          })

          await syncPendingPaymentAndTransaction({
            subscriptionId: existingSubscription._id.toString()
          })

          result = {
            subscription: {
              id: existingSubscription._id.toString(),
              status: 'pending',
              startedAt,
              endedAt
            }
          }
          return
        }

        const subscription = await SubscriptionRepo.createOne({
          data: {
            workspaceId,
            planId,
            planFeatureSnapshot: plan.feature,
            status: 'pending',
            startedAt,
            endedAt
          },
          session
        })

        const subscriptionId =
          subscription?.insertedId?.toString?.() ||
          subscription?._id?.toString?.()

        if (!subscriptionId) {
          throw new NotFoundErrorResponse('Cannot create subscription')
        }

        await this.createInitialPaymentAndTransaction({
          subscriptionId,
          plan,
          session
        })

        result = {
          subscription: {
            id: subscriptionId,
            status: 'pending',
            startedAt,
            endedAt
          }
        }
      })

      return result
    } finally {
      await session.endSession()
    }
  }

  static fetchPayment = async ({ subscriptionId }) => {
    const subscriptionDetail = await SubscriptionRepo.findDetailById({
      subscriptionId
    })

    if (!subscriptionDetail) {
      throw new NotFoundErrorResponse('Subscription Not Found')
    }

    const originPrice = Number(
      subscriptionDetail.originPrice || subscriptionDetail.currentPrice || 0
    )
    const currentPrice = Number(subscriptionDetail.currentPrice || 0)
    const discountAmount = Math.max(originPrice - currentPrice, 0)
    const totalAmount = await convertUsdToVnd(currentPrice)

    const qr = `https://qr.sepay.vn/img?acc=0915924378&bank=MBBank&amount=${totalAmount}&des=UPWS${subscriptionId}&template=TEMPLATE&download=DOWNLOAD`

    return {
      ...subscriptionDetail,
      payment: {
        qr,
        paymentCode: `UPWS${subscriptionId}`,
        originPrice: subscriptionDetail.originPrice,
        discountAmount,
        totalAmount: currentPrice,
        currency: 'VND'
      }
    }
  }

  static confirmPayment = async ({ payment, key }) => {
    if (!key || env.SEPAY_TOKEN !== key) {
      throw new ErrorResponse('Invalid Token')
    }

    if (!payment.code.startsWith('UPWS')) {
      throw new ErrorResponse('Invalid payment code')
    }

    const subscriptionId = payment.code.slice(4)
    const providerTransactionId = payment.id
    const paidAt = payment.transactionDate
      ? new Date(payment.transactionDate)
      : new Date()
    const paidAmount = await convertVndToUsd(Number(payment.transferAmount || 0))

    if (!subscriptionId || !ObjectId.isValid(subscriptionId)) {
      throw new BadRequestErrorResponse('Invalid subscription id')
    }

    if (!providerTransactionId) {
      throw new BadRequestErrorResponse('Missing transaction id')
    }

    let subscription = null
    let shouldEmitSuccess = false
    let successMailPayload = null

    const session = await mongoClientInstance.startSession()

    try {
      await session.withTransaction(async () => {
        subscription = await SubscriptionRepo.findOne({
          filter: {
            _id: new ObjectId(subscriptionId)
          },
          options: { session }
        })

        if (!subscription) {
          throw new NotFoundErrorResponse('Subscription Not Found')
        }

        if (subscription.status === 'active') {
          throw new BadRequestErrorResponse('Subscription already paid.')
        }

        emitPayment({
          workspaceId: subscription.workspaceId.toString(),
          subscriptionId: subscription._id.toString(),
          status: 'checking'
        })

        const transaction = await TransactionRepo.findOne({
          filter: {
            code: `UPWS${subscriptionId}`,
            status: 'pending'
          },
          options: { session }
        })

        if (!transaction) {
          throw new NotFoundErrorResponse('Transaction not found')
        }

        if (paidAmount < Number(transaction.transferAmount)) {
          await SubscriptionRepo.updateOne({
            filter: { _id: new ObjectId(subscriptionId) },
            data: {
              $set: {
                status: 'failed',
                updatedAt: new Date()
              }
            },
            session
          })

          await TransactionRepo.updateOne({
            filter: { _id: new ObjectId(transaction._id), status: 'pending' },
            data: {
              $set: {
                gateway: 'sepay',
                transactionId: providerTransactionId,
                status: 'failed',
                accountNumber: payment.accountNumber,
                subAccount: payment.subAccount
              }
            },
            session
          })

          await PaymentRepo.updateOne({
            filter: {
              transactionId: transaction._id.toString(),
              status: 'pending'
            },
            data: {
              $set: {
                gateway: 'sepay',
                status: 'failed',
                failedAt: paidAt,
                updatedAt: new Date()
              }
            },
            session
          })

          emitPayment({
            workspaceId: subscription.workspaceId.toString(),
            subscriptionId: subscription._id.toString(),
            status: 'failed'
          })
          return
        }

        const pendingPayment = await PaymentRepo.findOne({
          filter: {
            transactionId: transaction._id.toString(),
            status: 'pending'
          },
          options: { session }
        })

        if (!pendingPayment) {
          throw new NotFoundErrorResponse('Payment not found')
        }

        await SubscriptionRepo.updateMany({
          filter: {
            workspaceId: subscription.workspaceId,
            _id: { $ne: new ObjectId(subscriptionId) },
            status: { $in: ['pending', 'trialing', 'active', 'past_due'] }
          },
          data: {
            $set: {
              status: 'canceled',
              canceledAt: new Date(),
              updatedAt: new Date()
            }
          },
          session
        })

        await SubscriptionRepo.updateOne({
          filter: {
            _id: new ObjectId(subscriptionId)
          },
          data: {
            $set: {
              status: 'active',
              startedAt: subscription.startedAt || new Date(),
              updatedAt: new Date()
            }
          },
          session
        })

        await TransactionRepo.updateOne({
          filter: { _id: new ObjectId(transaction._id), status: 'pending' },
          data: {
            $set: {
              gateway: 'sepay',
              transactionId: providerTransactionId,
              status: 'paid'
            }
          },
          session
        })

        await PaymentRepo.updateOne({
          filter: {
            transactionId: transaction._id.toString(),
            status: 'pending'
          },
          data: {
            $set: {
              gateway: 'sepay',
              status: 'paid',
              paidAt,
              updatedAt: new Date()
            }
          },
          session
        })

        shouldEmitSuccess = true
        successMailPayload = {
          subscriptionId: subscriptionId.toString(),
          providerTransactionId,
          paidCurrency: 'VND',
          amount: Number(payment.transferAmount || 0),
          paidAt
        }
      })

      if (shouldEmitSuccess) {
        emitPayment({
          workspaceId: subscription.workspaceId.toString(),
          subscriptionId: subscription._id.toString(),
          status: 'success'
        })

        await deleteActiveSubscriptionCache({
          workspaceId: subscription.workspaceId.toString()
        })

        if (successMailPayload) {
          await sendUpgradePaymentSuccessMail({
            ...successMailPayload,
            workspaceId: subscription.workspaceId.toString()
          })
        }
      }

      return {
        success: true
      }
    } finally {
      await session.endSession()
    }
  }

  static selectFreePlan = async ({ workspaceId, planId }) => {
    const freePlanId = planId || '69dc9cc2454ef403fb52c8ba'

    const [workspace, plan] = await Promise.all([
      WorkspaceRepo.findOne({
        filter: { _id: new ObjectId(workspaceId) }
      }),
      WorkspaceRepo.findByPlanId({
        filter: { _id: new ObjectId(freePlanId) }
      })
    ])

    if (!workspace) {
      throw new NotFoundErrorResponse('Workspace not found')
    }

    if (!plan) {
      throw new NotFoundErrorResponse('Plan not found')
    }

    const startedAt = new Date()
    const endedAt = new Date(startedAt.getTime() + 30 * 24 * 60 * 60 * 1000)

    await SubscriptionRepo.updateMany({
      filter: {
        workspaceId,
        status: { $in: ['pending', 'trialing', 'active', 'past_due'] }
      },
      data: {
        $set: {
          status: 'canceled',
          canceledAt: new Date(),
          updatedAt: new Date()
        }
      }
    })

    const subscription = await SubscriptionRepo.createOne({
      data: {
        workspaceId,
        planId: freePlanId,
        planFeatureSnapshot: plan.feature,
        status: 'active',
        startedAt,
        endedAt,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await deleteActiveSubscriptionCache({ workspaceId })

    return {
      subscription: {
        id:
          subscription.insertedId?.toString?.() ||
          subscription._id?.toString?.(),
        status: 'active',
        startedAt,
        endedAt
      }
    }
  }

  static createInitialPaymentAndTransaction = async ({
    subscriptionId,
    plan,
    session
  }) => {
    const existingPendingPayment = await PaymentRepo.findOne({
      filter: { subscriptionId, status: 'pending' },
      options: { session }
    })
    if (existingPendingPayment) return

    const amount = Number(plan?.currentPrice || 0)
    const now = new Date()
    const paymentCode = `UPWS${subscriptionId}`

    const transactionResult = await TransactionRepo.createOne({
      data: {
        gateway: 'sepay',
        transactionDate: now.toISOString(),
        accountNumber: null,
        subAccount: null,
        code: paymentCode,
        content: `Init pending payment for subscription ${subscriptionId}`,
        transferType: 'in',
        description: `Init pending payment for subscription ${subscriptionId}`,
        transferAmount: amount,
        referenceCode: paymentCode,
        accumulated: 0,
        transactionId: `INIT-${subscriptionId}-${now.getTime()}`,
        status: 'pending'
      },
      session
    })

    const transactionObjectId =
      transactionResult?.insertedId?.toString?.() ||
      transactionResult?._id?.toString?.()

    await PaymentRepo.createOne({
      data: {
        subscriptionId,
        gateway: 'sepay',
        status: 'pending',
        transactionId: transactionObjectId,
        paidAt: null,
        failedAt: null,
        createdAt: now,
        updatedAt: null
      },
      session
    })
  }
}

const getVietcombankUsdSellRate = async () => {
  const response = await axios.get(
    'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10',
    {
      responseType: 'text',
      timeout: 10000
    }
  )

  const xml = response.data

  const match = xml.match(
    /<Exrate[^>]*CurrencyCode="USD"[^>]*Sell="([\d,\.]+)"/
  )

  if (!match || !match[1]) {
    throw new BadRequestErrorResponse(
      'Unable to obtain USD exchange rates from Vietcombank.'
    )
  }

  const usdSellRate = Number(match[1].replace(/,/g, ''))

  if (!usdSellRate || usdSellRate <= 0) {
    throw new BadRequestErrorResponse('Tỷ giá USD không hợp lệ')
  }

  return usdSellRate
}

const convertUsdToVnd = async (value) => {
  const amountUsd = Number(value || 0)

  if (Number.isNaN(amountUsd) || amountUsd <= 0) return 0

  const usdSellRate = await getVietcombankUsdSellRate()

  return Math.round(amountUsd * usdSellRate)
}

const convertVndToUsd = async (amountVnd) => {
  const amount = Number(amountVnd || 0)

  if (Number.isNaN(amount) || amount <= 0) return '0.00'

  const usdSellRate = await getVietcombankUsdSellRate()

  return (amount / usdSellRate).toFixed(2)
}
