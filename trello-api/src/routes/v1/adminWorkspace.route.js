import express from 'express'
import AdminWorkspaceController from '~/controllers/adminWorkspace.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'

const Router = express.Router()

Router.route('/').get(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminWorkspaceController.fetchByWorkspace)
)

export const adminWorkspaceRoute = Router
