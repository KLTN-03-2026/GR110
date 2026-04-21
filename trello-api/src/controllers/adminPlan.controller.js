import {
  OkSuccessResponse
} from '~/core/success.response'
import AdminPlanService from '~/services/adminPlan.service'

class AdminPlanController {
  static fetchByPlan = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminPlanService.fetchByPlan({ data: req.query })
    }).send(res)
  }

  static updateBlockPlan = async (req, res) => {
    const { planId } = req.params
    new OkSuccessResponse({
      metadata: await AdminPlanService.updateBlockPlan({ planId })
    }).send(res)
  }

  static deleteAdminPlan = async (req, res) => {
    const { planId } = req.params
    new OkSuccessResponse({
      metadata: await AdminPlanService.deleteAdminPlan({ planId })
    }).send(res)
  }

  static updateAdminPlan = async (req, res) => {
    const { planId } = req.params
    const planData = req.body
    new OkSuccessResponse({
      metadata: await AdminPlanService.updateAdminPlan({ _id: planId, data: planData })
    }).send(res)
  }

  static createAdminPlan = async (req, res) => {
    const planData = req.body
    new OkSuccessResponse({
      metadata: await AdminPlanService.createAdminPlan({ planData })
    }).send(res)
  }
}
export default AdminPlanController
