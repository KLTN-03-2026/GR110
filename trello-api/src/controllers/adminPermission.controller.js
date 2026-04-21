import {
  OkSuccessResponse
} from '~/core/success.response'
import AdminPermissionService from '~/services/adminPermission.service'

class AdminPermissionController {
  static fetchPermission = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminPermissionService.fetchPermission({ data: req.query })
    }).send(res)
  }

}
export default AdminPermissionController