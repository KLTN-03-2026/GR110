import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { env } from '~/config/environment'
import UserService from '~/services/user.service'
import {
  OkSuccessResponse
} from '~/core/success.response'
import AdminAuthService from '~/services/adminAuth.service'

class AdminAuthController {
  static login = async (req, res) => {
    const result = await AdminAuthService.login({ data: req.body })

    res.cookie('accessTokenAdmin', result.accessTokenAdmin, {
      httpOnly: true,
      secure: true,
      sampleSite: 'none',
      maxAge: ms(env.ACCESS_TOKEN_LIFE)
    })

    res.cookie('refreshTokenAdmin', result.refreshTokenAdmin, {
      httpOnly: true,
      secure: true,
      sampleSite: 'none',
      maxAge: ms(env.REFRESH_TOKEN_LIFE)
    })

    new OkSuccessResponse({
      message: 'Login successfully!',
      metadata: result
    }).send(res)
  }

  static logout = async (req, res) => {
    res.clearCookie('accessTokenAdmin')
    res.clearCookie('refreshTokenAdmin')
    res.status(StatusCodes.OK).json({ loggedOut: true })
  }

  static refreshToken = async (req, res) => {
    const result = await AdminAuthService.refreshToken({
      adminRefreshToken: req?.cookies?.refreshTokenAdmin
    })

    res.cookie('accessTokenAdmin', result.accessTokenAdmin, {
      httpOnly: true,
      secure: true,
      sampleSite: 'none',
      maxAge: ms(env.REFRESH_TOKEN_LIFE)
    })
    res.status(StatusCodes.OK).json({ result })
  }

  static update = async (req, res) => {
    new OkSuccessResponse({
      message: 'User updated successfully!',
      metadata: await AdminAuthService.update({
        _id: req.userContext._id,
        data: req.body,
        adminAvatarFile: req.file
      })
    }).send(res)
  }

}
export default AdminAuthController
