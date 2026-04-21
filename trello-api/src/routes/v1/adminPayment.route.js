import express from 'express'
import AdminPaymentController from '~/controllers/adminPayment.controller'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/')
  .get(asyncHandler(AdminPaymentController.fetchPayment))

export const adminPaymentRoute = Router
