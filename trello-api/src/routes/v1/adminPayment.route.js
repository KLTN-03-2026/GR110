import express from 'express'
import AdminPaymentController from '~/controllers/adminPayment.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminPaymentController.fetchPayment)
  )

Router.route('/:paymentId/transaction')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminPaymentController.fetchPaymentTransaction)
  )

export const adminPaymentRoute = Router
