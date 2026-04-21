import express from 'express'
import TicketController from '~/controllers/ticket.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.route('/')
  .post(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(TicketController.createTicket)
  )
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(TicketController.getTicket)
  )

export const ticketRouter = Router
