import {
  OkSuccessResponse
} from '~/core/success.response'
import AdminBoardService from '~/services/adminBoard.service'

class AdminBoardController {
  static fetchByBoard = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminBoardService.fetchByBoard({ data: req.query })
    }).send(res)
  }

}
export default AdminBoardController
