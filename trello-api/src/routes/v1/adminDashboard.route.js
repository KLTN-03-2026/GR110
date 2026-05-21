import express from 'express'
import asyncHandler from '~/helpers/asyncHandler'
import AdminDashboardController from '~/controllers/adminDashboard.controller'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'

const Router = express.Router()

Router.route('/overview')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminDashboardController.fetchOverview)
  )

export const adminDashboardRoute = Router
