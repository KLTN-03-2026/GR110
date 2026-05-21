import express from 'express'
import AdminPermissionController from '~/controllers/adminPermission.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminPermissionController.fetchPermission)
  )

export const adminPermission = Router
