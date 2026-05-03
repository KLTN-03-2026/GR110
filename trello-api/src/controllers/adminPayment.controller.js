import {
  OkSuccessResponse
} from '~/core/success.response'
import AdminPaymentService from '~/services/adminPayment.service'

class AdminPaymentController {
  static fetchPayment = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminPaymentService.fetchByPayment({ data: req.query })
    }).send(res)
  }

  static fetchPaymentTransaction = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminPaymentService.fetchPaymentTransaction({
        paymentId: req.params.paymentId
      })
    }).send(res)
  }
}
export default AdminPaymentController
