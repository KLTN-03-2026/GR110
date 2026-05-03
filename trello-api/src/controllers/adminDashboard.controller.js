import { OkSuccessResponse } from '~/core/success.response'
import AdminDashboardService from '~/services/adminDashboard.service'

class AdminDashboardController {
  static fetchOverview = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminDashboardService.fetchOverview({ data: req.query })
    }).send(res)
  }
}

export default AdminDashboardController
