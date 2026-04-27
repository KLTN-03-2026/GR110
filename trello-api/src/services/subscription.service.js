import { ObjectId } from 'mongodb'
import { env } from '~/config/environment'
import { ErrorResponse, NotFoundErrorResponse } from '~/core/error.response'
import SubscriptionRepo from '~/repo/subscription.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import PaymentRepo from '../repo/payment.repo'
import { mongoClientInstance } from '~/config/mongodb'
import TransactionRepo from '~/repo/transaction.repo'
import { emitPayment } from '~/realtime/realtimeEmitters/payment.emitter'

export default class SubscriptionService {
  static createSubscription = async ({ workspaceId, planId, userContext }) => {
    const [workspace, plan, existingSubscription] = await Promise.all([
      WorkspaceRepo.findOne({
        filter: { _id: new ObjectId(workspaceId) }
      }),
      WorkspaceRepo.findByPlanId({
        filter: { _id: new ObjectId(planId) }
      }),
      SubscriptionRepo.findOne({
        filter: { workspaceId, status: 'pending' }
      })
    ])

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    if (!plan) {
      throw new Error('Plan not found')
    }

    if (
      existingSubscription &&
      existingSubscription.planId === planId &&
      existingSubscription.planFeatureSnapshot
    ) {
      return {
        subscription: {
          id: existingSubscription._id.toString(),
          status: existingSubscription.status,
          startedAt: existingSubscription.startedAt,
          endedAt: existingSubscription.endedAt
        }
      }
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
        }
      })

      return {
        subscription: {
          id: existingSubscription._id.toString(),
          status: 'pending',
          startedAt,
          endedAt
        }
      }
    }

    const subscription = await SubscriptionRepo.createOne({
      data: {
        workspaceId,
        planId,
        planFeatureSnapshot: plan.feature,
        status: 'pending',
        startedAt,
        endedAt
      }
    })

    const subscriptionId =
      subscription?.insertedId?.toString?.() || subscription?._id?.toString?.()

    if (!subscriptionId) {
      throw new Error('Cannot create subscription')
    }

    return {
      subscription: {
        id: subscriptionId,
        status: 'pending',
        startedAt,
        endedAt
      }
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
    const totalAmount = currentPrice

    const qr = `https://qr.sepay.vn/img?acc=0915924378&bank=MBBank&amount=${totalAmount}&des=UPWS${subscriptionId}&template=TEMPLATE&download=DOWNLOAD`

    return {
      ...subscriptionDetail,
      payment: {
        qr,
        paymentCode: `UPWS${subscriptionId}`,
        originPrice: subscriptionDetail.originPrice,
        discountAmount,
        totalAmount,
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

    const subscription = await SubscriptionRepo.findOne({
      filter: {
        _id: new ObjectId(subscriptionId)
      }
    })

    if (!subscription) {
      throw new NotFoundErrorResponse('Subscription Not Found')
    }

    const existingTransaction = await TransactionRepo.findOne({
      filter: {
        transactionId: payment.id
      }
    })

    if (existingTransaction) {
      return {
        message: 'Transaction already processed'
      }
    }

    const session = await mongoClientInstance.startSession()

    try {
      await session.withTransaction(async () => {

        emitPayment({
          workspaceId: subscription.workspaceId.toString(),
          subscriptionId: subscription._id.toString(),
          status: 'checking'
        })

        await SubscriptionRepo.updateMany({
          filter: {
            workspaceId: subscription.workspaceId.toString(),
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

        const transactionResult = await TransactionRepo.createOne({
          data: {
            gateway: 'sepay',
            transactionDate: payment.transactionDate,
            accountNumber: payment.accountNumber,
            subAccount: payment.subAccount,
            code: payment.code,
            content: payment.content,
            transferType: payment.transferType,
            description: payment.description,
            transferAmount: payment.transferAmount,
            referenceCode: payment.referenceCode,
            accumulated: payment.accumulated,
            transactionId: payment.id
          },
          session
        })

        const transactionId =
          transactionResult?.insertedId?.toString?.() ||
          transactionResult?._id?.toString?.()

        await PaymentRepo.createOne({
          data: {
            subscriptionId,
            gateway: 'sepay',
            status: 'paid',
            providerTransactionId: transactionId,
            amount: payment.transferAmount,
            paidAt: new Date(payment.transactionDate)
          },
          session
        })
      })

      emitPayment({ workspaceId: subscription.workspaceId, subscriptionId: subscription._id.toString(), status: 'success' })

      return {
        success: true
      }
    } finally {
      await session.endSession()
    }
  }

  static selectFreePlan = async ({ workspaceId, planId, userContext }) => {
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
}
