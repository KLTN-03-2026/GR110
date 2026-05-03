import express from 'express'
import asyncHandler from '~/helpers/asyncHandler'
import AdminDashboardController from '~/controllers/adminDashboard.controller'

const Router = express.Router()

Router.route('/overview')
  .get(asyncHandler(AdminDashboardController.fetchOverview))

export const adminDashboardRoute = Router
