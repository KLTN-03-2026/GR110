import {
  OkSuccessResponse
} from '~/core/success.response'
import AdminWorkspaceService from '~/services/adminWorkspace.service'

class AdminWorkspaceController {
  static fetchByWorkspace = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminWorkspaceService.fetchByWorkspace({ data: req.query })
    }).send(res)
  }

}
export default AdminWorkspaceController
