import { OkSuccessResponse } from '~/core/success.response'
import AdminTicketService from '~/services/adminTicket.service'

export default class AdminTicketController {
  static fetchTickets = async (req, res) => {
    new OkSuccessResponse({
      metadata: await AdminTicketService.fetchTickets({ data: req.query })
    }).send(res)
  }

  static rejectTicket = async (req, res) => {
    const ticketId = req.params.ticketId

    new OkSuccessResponse({
      metadata: await AdminTicketService.rejectTicket({ ticketId })
    }).send(res)
  }

  static replyTicket = async (req, res) => {
    const ticketId = req.params.ticketId

    new OkSuccessResponse({
      metadata: await AdminTicketService.replyTicket({
        ticketId,
        replyContent: req.body.replyContent,
        adminId: req.user?._id?.toString?.() || ''
      })
    }).send(res)
  }
}
