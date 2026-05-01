import { OkSuccessResponse } from '~/core/success.response'
import LandingService from '~/services/landing.service'

export default class LandingController {
  static getPlan = async (req, res) => {
    new OkSuccessResponse({
      metadata: await LandingService.fetchPlan()
    }).send(res)
  }
}
