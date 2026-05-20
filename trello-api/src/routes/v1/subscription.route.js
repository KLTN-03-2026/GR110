import express from 'express'
import { authMiddleware } from '~/middlewares/auth.middleware'
import asyncHandler from '~/helpers/asyncHandler'
import SubscriptionController from '~/controllers/subscription.controller'
import { workspaceMiddleware } from '~/middlewares/workspacePermission.middleware'
import { WORKSPACE_PERMISSIONS } from '~/constant/workspacePermission.constant'

const Router = express.Router()

Router.route('/confirm-payment').post(
  asyncHandler(SubscriptionController.confirmPayMent)
)

Router.route('/:subscriptionId').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(SubscriptionController.fetchPayment)
)

Router.route('/createOrder/paypal/:subscriptionId').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(SubscriptionController.createOrderPaypal)
)

Router.route('/captureOrderPal/paypal').post(
  asyncHandler(SubscriptionController.captureOrderPaypal)
)

Router.route('/:workspaceId/payment/:planId').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(
    workspaceMiddleware.checkPermission(WORKSPACE_PERMISSIONS.WORKSPACE_UPGRADE)
  ),
  asyncHandler(SubscriptionController.createSubscription)
)

Router.route('/:workspaceId/free/:planId').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(
    workspaceMiddleware.checkPermission(
      WORKSPACE_PERMISSIONS.WORKSPACE_DOWNGRADE
    )
  ),
  asyncHandler(SubscriptionController.selectFreePlan)
)

export const subscriptionsRouter = Router
