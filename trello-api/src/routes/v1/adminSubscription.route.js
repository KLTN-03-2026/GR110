import express from 'express'
import AdminSubscriptionController from '~/controllers/adminSubscription.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminSubscriptionController.fetchBySubscription)
  )

Router.route('/:subscriptionId')
  .put(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminSubscriptionController.updateAdminSubscription)
  )
  .patch(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminSubscriptionController.cancelAdminSubscription)
  )


export const adminSubscriptionRoute = Router
