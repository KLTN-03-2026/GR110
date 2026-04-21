import express from 'express'
import AdminTicketController from '~/controllers/adminTicket.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'

const Router = express.Router()

Router.route('/').get(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminTicketController.fetchTickets)
)

Router.route('/:ticketId/reject').patch(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminTicketController.rejectTicket)
)
Router.route('/:ticketId/reply').patch(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminTicketController.replyTicket)
)

export const adminTicketRoute = Router
