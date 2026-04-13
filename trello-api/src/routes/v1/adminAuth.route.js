
import express from 'express'
import AdminAuthController from '~/controllers/adminAuth.controller';
import asyncHandler from '~/helpers/asyncHandler';
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware';
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware';
import validate from '~/utils/validate';
import { adminAuthValidation } from '~/validations/adminAuth.validation';

const Router = express.Router()

Router.route('/login').post(
  asyncHandler(validate(adminAuthValidation.login)),
  asyncHandler(AdminAuthController.login)
)

Router.route('/logout').delete(asyncHandler(AdminAuthController.logout))

Router.route('/refresh_token').put(asyncHandler(AdminAuthController.refreshToken))
Router.route('/update').put(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(multerUploadMiddleware.uploadSingleImage),
  asyncHandler(validate(adminAuthValidation.update)),
  asyncHandler(AdminAuthController.update)
)


export const adminAuthRouter = Router