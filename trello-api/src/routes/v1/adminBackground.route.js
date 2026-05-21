import express from 'express'
import AdminBackgroundController from '~/controllers/adminBackground.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminBackgroundController.getAdminBackgrounds)
  )
  .post(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(multerUploadMiddleware.uploadSingleImage),
    asyncHandler(AdminBackgroundController.createAdminBackground)
  )

Router.route('/update/:_id').post(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(multerUploadMiddleware.uploadSingleImage),
  asyncHandler(AdminBackgroundController.updateAdminBackground)
)

Router.route('/delete/:_id').delete(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminBackgroundController.deleteAdminBackground)
)

Router.route('/block/:backgroundId').patch(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminBackgroundController.updateBlockBackground)
)

export const adminBackgroundRoute = Router
