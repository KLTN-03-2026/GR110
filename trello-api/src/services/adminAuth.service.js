import bcryptjs from 'bcryptjs'
import { env } from '~/config/environment'
import {
  ForbiddenErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import adminAuthRepo from '~/repo/adminAuth.repo'
import { pickUser } from '~/utils/formatters'

class AdminAuthService {
  static login = async ({ data }) => {
    const existAdmin = await adminAuthRepo.findByEmail({ email: data.email })

    if (!existAdmin) throw new NotFoundErrorResponse('Account not found!')

    if (!existAdmin.isActive)
      throw new ForbiddenErrorResponse('Your account is not active!')

    if (existAdmin.isBlocked)
      throw new ForbiddenErrorResponse('Your account is blocked!')

    if (!bcryptjs.compareSync(data.password, existAdmin.password))
      throw new ForbiddenErrorResponse(
        'Your email or password is not incorrect!'
      )

    const adminInfo = { _id: existAdmin._id, email: existAdmin.email }

    const accessTokenAdmin = await JwtProvider.generateToken(
      adminInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshTokenAdmin = await JwtProvider.generateToken(
      adminInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { ...pickUser(existAdmin), accessTokenAdmin, refreshTokenAdmin }
  }

  static refreshToken = async ({ adminRefreshToken }) => {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      adminRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const adminInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessTokenAdmin = await JwtProvider.generateToken(
      adminInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessTokenAdmin }
  }

   static update = async ({ _id, data, adminAvatarFile }) => {
    const existAdmin = await adminAuthRepo.findById({ _id })

    if (!existAdmin) throw new NotFoundErrorResponse('Account not found!')

    if (!existAdmin.isActive)
      throw new ForbiddenErrorResponse('Your account is not active!')

    let updatedAdmin = {}

    if (data.currentPassword && data.newPassword) {
      if (!bcryptjs.compareSync(data.currentPassword, existAdmin.password))
        throw new ForbiddenErrorResponse(
          'Your current password is not correct!'
        )

      updatedAdmin = await adminAuthRepo.updateById({
        _id,
        data: { password: bcryptjs.hashSync(data.newPassword, 8) }
      })
    } else if (adminAvatarFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(
        adminAvatarFile.buffer,
        'users'
      )
      updatedAdmin = await adminAuthRepo.updateById({
        _id: existAdmin._id,
        data: { avatar: uploadResult.secure_url }
      })
    } else {
      updatedAdmin = await adminAuthRepo.updateById({
        _id: existAdmin._id,
        data
      })
    }
    return pickUser(updatedAdmin)
  }
}

export default AdminAuthService
