import express from 'express'
import { authMiddleware } from '~/middlewares/auth.middleware'
import asyncHandler from '~/helpers/asyncHandler'
import SubscriptionController from '~/controllers/subscription.controller'

const Router = express.Router()

Router.route('/confirm-payment')
  .post(
    asyncHandler(SubscriptionController.confirmPayMent)
  )

Router.route('/:subscriptionId')
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(SubscriptionController.fetchPayment)
  )

Router.route('/createOrder/paypal/:subscriptionId')
  .post(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(SubscriptionController.createOrderPaypal)
  )

Router.route('/captureOrderPal/paypal')
  .post(
    asyncHandler(SubscriptionController.captureOrderPaypal)
  )


Router.route('/:workspaceId/payment/:planId')
  .post(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(SubscriptionController.createSubscription)
  )

Router.route('/:workspaceId/free/:planId')
  .post(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(SubscriptionController.selectFreePlan)
  )


export const subscriptionsRouter = Router
