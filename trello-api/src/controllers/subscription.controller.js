import { OkSuccessResponse } from '~/core/success.response'
import PaypalService from '~/services/paypal.service'
import SubscriptionService from '~/services/subscription.service'

export default class SubscriptionController {
  static createSubscription = async (req, res) => {
    new OkSuccessResponse({
      metadata: await SubscriptionService.createSubscription({
        workspaceId: req.params.workspaceId,
        planId: req.params.planId,
        userContext: req.userContext
      })
    }).send(res)
  }

  static fetchPayment = async (req, res) => {
    new OkSuccessResponse({
      metadata: await SubscriptionService.fetchPayment({
        subscriptionId: req.params.subscriptionId,
        userContext: req.userContext
      })
    }).send(res)
  }

  static confirmPayMent = async (req, res) => {
    const dataPayment = req.body
    const authorization = req.headers.authorization || ''

    const token = authorization.startsWith('Apikey ')
      ? authorization.slice(7)
      : null

    await SubscriptionService.confirmPayment({
      payment: dataPayment,
      key: token
    })

    return res.status(200).json({ success: true })
  }

  static createOrderPaypal = async (req, res) => {
    const { subscriptionId } = req.params
    const { payment } = req.body

    const result = await PaypalService.createOrderPaypal({
      subscriptionId,
      payment
    })

    return res.status(200).json({
      metadata: result
    })
  }

  static captureOrderPaypal = async (req, res) => {
    const result = await PaypalService.captureOrderPaypal(req.body)

    return res.status(200).json({
      metadata: result
    })
  }
}
