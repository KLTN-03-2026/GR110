import axios from 'axios'
import { ObjectId } from 'mongodb'
import { env } from '~/config/environment'
import { mongoClientInstance } from '~/config/mongodb'
import {
  BadRequestErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import { emitPayment } from '~/realtime/realtimeEmitters/payment.emitter'
import PaymentRepo from '~/repo/payment.repo'
import SubscriptionRepo from '~/repo/subscription.repo'
import TransactionRepo from '~/repo/transaction.repo'

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

    const paypalAmount = await convertVndToUsd(totalAmount)

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
                  value: paypalAmount
                }
              }
            ],
            amount: {
              currency_code: 'USD',
              value: paypalAmount,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: paypalAmount
                }
              }
            }
          }
        ],
        application_context: {
          brand_name: 'Taskio',
          user_action: 'PAY_NOW',
          return_url: `${env.WEBSITE_DOMAIN_DEVELOPMENT}/h/workspaces/${subscription.workspaceId}/billing`,
          cancel_url: `${env.WEBSITE_DOMAIN_DEVELOPMENT}/h/workspaces/${subscription.workspaceId}/billing`
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
    const orderID = capture?.supplementary_data?.related_ids?.order_id
    const providerTransactionId = capture?.id
    const paidAmount = Number(capture?.amount?.value || 0)
    const paidCurrency = capture?.amount?.currency_code || 'USD'
    const paidAt = capture?.create_time
      ? new Date(capture.create_time)
      : new Date()

    if (!subscriptionId || !ObjectId.isValid(subscriptionId)) {
      throw new BadRequestErrorResponse(
        'Invalid subscription id from PayPal webhook'
      )
    }

    if (!providerTransactionId) {
      throw new BadRequestErrorResponse('Missing PayPal capture id')
    }

    const subscription = await SubscriptionRepo.findOne({
      filter: { _id: new ObjectId(subscriptionId) }
    })

    if (!subscription) {
      throw new NotFoundErrorResponse('Subscription not found')
    }

    const existingPayment = await PaymentRepo.findOne({
      filter: { providerTransactionId }
    })

    if (existingPayment) {
      return {
        status: paypalStatus,
        paymentStatus,
        providerTransactionId,
        paidCurrency
      }
    }

    const session = await mongoClientInstance.startSession()

    try {
      await session.withTransaction(async () => {
        emitPayment({
          workspaceId: subscription.workspaceId.toString(),
          subscriptionId: subscriptionId.toString(),
          status: 'checking'
        })
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
        } else if (paypalStatus === 'DENIED') {
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
        } else if (paypalStatus === 'PENDING') {
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
        }

        const transactionResult = await TransactionRepo.createOne({
          data: {
            gateway: 'paypal',
            transactionDate: capture?.create_time || new Date().toISOString(),
            accountNumber: null,
            subAccount: null,
            code: capture?.invoice_id || '',
            content: `PayPal payment for subscription ${subscriptionId}`,
            transferType: 'in',
            description: `PayPal payment for subscription ${subscriptionId}`,
            transferAmount: paidAmount,
            referenceCode:
              orderID || capture?.invoice_id || providerTransactionId,
            accumulated: 0,
            transactionId: providerTransactionId
          },
          session
        })

        const transactionId =
          transactionResult?.insertedId?.toString?.() ||
          transactionResult?._id?.toString?.()

        await PaymentRepo.createOne({
          data: {
            subscriptionId,
            gateway: 'paypal',
            status: paymentStatus,
            providerTransactionId: transactionId,
            amount: paidAmount,
            paidAt: paypalStatus === 'COMPLETED' ? paidAt : null
          },
          session
        })
      })

      emitPayment({
        workspaceId: subscription.workspaceId.toString(),
        subscriptionId: subscriptionId.toString(),
        status: 'success'
      })

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

const convertVndToUsd = async (amountVnd) => {
  const response = await axios.get(
    'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10',
    {
      responseType: 'text'
    }
  )

  const xml = response.data
  const match = xml.match(
    /<Exrate[^>]*CurrencyCode="USD"[^>]*Sell="([\d,\.]+)"/
  )

  if (!match || !match[1]) {
    throw new BadRequestErrorResponse(
      'Không lấy được tỷ giá USD từ Vietcombank'
    )
  }

  const usdSellRate = Number(match[1].replace(/,/g, ''))

  if (!usdSellRate || usdSellRate <= 0) {
    throw new BadRequestErrorResponse('Tỷ giá USD không hợp lệ')
  }

  return (Number(amountVnd) / usdSellRate).toFixed(2)
}

export default PaypalService
