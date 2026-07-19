import axios from 'axios'
import { ObjectId } from 'mongodb'
import { env } from '~/config/environment'
import { mongoClientInstance } from '~/config/mongodb'
import {
  BadRequestErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import { sendUpgradePaymentSuccessMail } from '~/helpers/sendMailPayment'
import { deleteActiveSubscriptionCache } from '~/helpers/subscription.cache'
import { emitPayment } from '~/realtime/realtimeEmitters/payment.emitter'
import PaymentRepo from '~/repo/payment.repo'
import SubscriptionRepo from '~/repo/subscription.repo'
import TransactionRepo from '~/repo/transaction.repo'
import { WEBSITE_DOMAIN } from '~/utils/constants'

class PaypalService {
  static createOrderPaypal = async ({ subscriptionId, payment }) => {
    if (!ObjectId.isValid(subscriptionId)) {
      throw new BadRequestErrorResponse('Invalid subscription id')
    }

    const subscription = await SubscriptionRepo.findOne({
      filter: { _id: new ObjectId(subscriptionId) }
    })

    if (!subscription) {
      throw new NotFoundErrorResponse('Subscription not found')
    }

    const subscriptionDetail = await SubscriptionRepo.findDetailById({
      subscriptionId
    })

    if (!subscriptionDetail) {
      throw new NotFoundErrorResponse('Subscription detail not found')
    }

    const totalAmount = Number(payment?.totalAmount || 0)

    if (!totalAmount || totalAmount <= 0) {
      throw new BadRequestErrorResponse('Invalid payment amount')
    }

    const accessToken = await generateAccessToken()

    try {
      const orderPayload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: subscriptionId,
            custom_id: subscriptionId,
            description: `UPWS${subscriptionId}`.slice(0, 127),
            items: [
              {
                name: String(
                  subscriptionDetail.planTitle || 'Workspace plan'
                ).slice(0, 127),
                description:
                  `${subscriptionDetail.workspaceTitle || 'Workspace'} - ${subscriptionDetail.planTitle || 'Plan'}`.slice(
                    0,
                    127
                  ),
                quantity: '1',
                unit_amount: {
                  currency_code: 'USD',
                  value: totalAmount
                }
              }
            ],
            amount: {
              currency_code: 'USD',
              value: totalAmount,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: totalAmount
                }
              }
            }
          }
        ],
        application_context: {
          brand_name: 'Taskio',
          user_action: 'PAY_NOW',
          return_url: `${WEBSITE_DOMAIN}/h/workspaces/${subscription.workspaceId}/billing`,
          cancel_url: `${WEBSITE_DOMAIN}/h/workspaces/${subscription.workspaceId}/billing`
        }
      }

      const response = await axios.post(
        `${env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        orderPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      return {
        orderId: response.data.id
      }
    } catch (error) {
      throw new BadRequestErrorResponse(
        error?.response?.data?.details?.[0]?.description ||
          error?.response?.data?.details?.[0]?.issue ||
          error?.response?.data?.message ||
          error?.response?.data?.error_description ||
          'Failed to create PayPal order'
      )
    }
  }

  static captureOrderPaypal = async (event) => {
    const capture = event?.resource

    if (!capture) {
      throw new BadRequestErrorResponse('PayPal webhook resource not found')
    }

    let paypalStatus = null
    let paymentStatus = null

    if (event?.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      paypalStatus = 'COMPLETED'
      paymentStatus = 'paid'
    } else if (event?.event_type === 'PAYMENT.CAPTURE.DENIED') {
      paypalStatus = 'DENIED'
      paymentStatus = 'failed'
    } else if (event?.event_type === 'PAYMENT.CAPTURE.PENDING') {
      paypalStatus = 'PENDING'
      paymentStatus = 'pending'
    } else {
      return {
        message: 'Unsupported PayPal webhook event',
        eventType: event?.event_type || null
      }
    }

    const subscriptionId = capture?.custom_id
    const providerTransactionId = capture?.id
    const paidCurrency = capture?.amount?.currency_code || 'USD'
    const amount = Number(capture?.amount?.value)
    const paidAt = capture?.create_time
      ? new Date(capture.create_time)
      : new Date()

    const session = await mongoClientInstance.startSession()

    let subscription = null
    let transaction = null
    let payment = null
    let shouldEmitSuccess = false
    let successMailPayload = null

    try {
      await session.withTransaction(async () => {
        if (!subscriptionId || !ObjectId.isValid(subscriptionId)) {
          throw new BadRequestErrorResponse(
            'Invalid subscription id from PayPal webhook'
          )
        }

        if (!providerTransactionId) {
          throw new BadRequestErrorResponse('Missing PayPal capture id')
        }

        subscription = await SubscriptionRepo.findOne({
          filter: { _id: new ObjectId(subscriptionId) },
          options: { session }
        })

        if (!subscription) {
          throw new NotFoundErrorResponse('Subscription not found')
        }

        emitPayment({
          workspaceId: subscription.workspaceId.toString(),
          subscriptionId: subscriptionId.toString(),
          status: 'checking'
        })

        if (subscription.status === 'active') {
          throw new BadRequestErrorResponse('Subscription already paid.')
        }

        transaction = await TransactionRepo.findOne({
          filter: {
            code: `UPWS${subscriptionId}`,
            status: 'pending'
          },
          options: { session }
        })

        if (!transaction) {
          throw new NotFoundErrorResponse('Transaction not found')
        }

        if (amount < Number(transaction.transferAmount)) {
          await payFail({
            subscriptionId,
            transactionId: transaction._id,
            providerTransactionId,
            paidAt,
            description: 'Not enough money',
            workspaceId: subscription.workspaceId.toString(),
            session
          })
          return
        }

        payment = await PaymentRepo.findOne({
          filter: {
            transactionId: transaction._id.toString(),
            status: 'pending'
          },
          options: { session }
        })

        if (!payment) {
          throw new NotFoundErrorResponse('Payment not found')
        }

        if (paypalStatus === 'COMPLETED') {
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
            filter: { _id: new ObjectId(subscriptionId) },
            data: {
              $set: {
                status: 'active',
                startedAt: subscription.startedAt || new Date(),
                updatedAt: new Date()
              }
            },
            session
          })

          const transactionResult = await TransactionRepo.updateOne({
            filter: {
              _id: new ObjectId(transaction._id)
            },
            data: {
              $set: {
                gateway: 'paypal',
                transactionId: providerTransactionId,
                status: 'paid'
              }
            },
            session
          })

          await PaymentRepo.updateOne({
            filter: {
              transactionId: transactionResult._id.toString()
            },
            data: {
              $set: {
                gateway: 'paypal',
                status: 'paid',
                paidAt
              }
            },
            session
          })

          shouldEmitSuccess = true
          successMailPayload = {
            subscriptionId: subscriptionId.toString(),
            providerTransactionId,
            paidCurrency,
            amount,
            paidAt
          }
        } else {
          await payFail({
            subscriptionId,
            transactionId: transaction._id,
            providerTransactionId,
            paidAt,
            description: '',
            workspaceId: subscription.workspaceId.toString(),
            session
          })
          return
        }
      })

      if (shouldEmitSuccess) {
        emitPayment({
          workspaceId: subscription.workspaceId.toString(),
          subscriptionId: subscriptionId.toString(),
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
        status: paypalStatus,
        paymentStatus,
        providerTransactionId,
        paidCurrency
      }
    } finally {
      await session.endSession()
    }
  }
}

const payFail = async ({
  subscriptionId,
  transactionId,
  providerTransactionId,
  paidAt,
  description,
  workspaceId,
  session
}) => {
  await SubscriptionRepo.updateOne({
    filter: { _id: new ObjectId(subscriptionId) },
    data: {
      $set: {
        status: 'pending',
        updatedAt: new Date()
      }
    },
    session
  })

  const transactionResult = await TransactionRepo.updateOne({
    filter: {
      _id: new ObjectId(transactionId)
    },
    data: {
      $set: {
        gateway: 'paypal',
        transactionId: providerTransactionId,
        status: 'failed',
        description
      }
    },
    session
  })

  await PaymentRepo.updateOne({
    filter: {
      transactionId: transactionResult._id.toString()
    },
    data: {
      $set: {
        gateway: 'paypal',
        status: 'failed',
        failedAt: paidAt
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
        status: 'failed'
      }
    },
    session
  })

  emitPayment({
    workspaceId,
    subscriptionId: subscriptionId.toString(),
    status: 'failed'
  })
}

const generateAccessToken = async () => {
  try {
    const res = await axios({
      url: `${env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      method: 'post',
      data: 'grant_type=client_credentials',
      auth: {
        username: env.PAYPAL_CLIENT_ID,
        password: env.PAYPAL_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return res.data.access_token
  } catch (error) {
    throw new BadRequestErrorResponse(
      error?.response?.data?.error_description ||
        error?.response?.data?.error ||
        'Failed to generate PayPal access token'
    )
  }
}

export default PaypalService
