import {
  OkSuccessResponse
} from '~/core/success.response'
import AdminSubscriptionService from '~/services/adminSubscription.service'

class AdminSubscriptionController {
  static fetchBySubscription = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminSubscriptionService.fetchBySubscription({ data: req.query })
    }).send(res)
  }

  static updateAdminSubscription = async (req, res) => {
    const { subscriptionId } = req.params
    const subscriptionData = req.body
    new OkSuccessResponse({
      metadata: await AdminSubscriptionService.updateAdminSubscription({ _id: subscriptionId, data: subscriptionData })
    }).send(res)
  }

  static cancelAdminSubscription = async (req, res) => {
    const { subscriptionId } = req.params
    const subscriptionData = req.body
    new OkSuccessResponse({
      metadata: await AdminSubscriptionService.cancelAdminSubscription({ _id: subscriptionId, data: subscriptionData })
    }).send(res)
  }
  
}
export default AdminSubscriptionController
