import express from 'express'
import AdminSubscriptionController from '~/controllers/adminSubscription.controller'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/')
  .get(asyncHandler(AdminSubscriptionController.fetchBySubscription))

Router.route('/:subscriptionId')
  .put(asyncHandler(AdminSubscriptionController.updateAdminSubscription))
  .patch(asyncHandler(AdminSubscriptionController.cancelAdminSubscription))


export const adminSubscriptionRoute = Router
