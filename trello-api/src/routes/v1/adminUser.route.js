import express from 'express'
import AdminUserController from '~/controllers/adminUser.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'
import validate from '~/utils/validate'
import { adminAccountValidation } from '~/validations/adminAccount.validation'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminUserController.fetchByUser)
  )
  .post(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(validate(adminAccountValidation.create)),
    asyncHandler(AdminUserController.createAdminAccount)
  )
Router.route('/block/:userId').patch(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminUserController.updateBlockUser)
)
Router.route('/:userId')
  .put(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(validate(adminAccountValidation.update)),
    asyncHandler(AdminUserController.updateAdminUser)
  )
  .delete(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminUserController.deleteAdminAccount)
  )

export const adminUserRoute = Router
