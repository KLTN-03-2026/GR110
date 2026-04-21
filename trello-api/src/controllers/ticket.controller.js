import { CreatedSuccessResponse, OkSuccessResponse } from '~/core/success.response'
import TicketService from '~/services/ticket.service'

export default class TicketController {
  static createTicket = async (req, res) => {
    await new CreatedSuccessResponse({
      metadata: await TicketService.createTicket({
        userContext: req.userContext,
        dataTicket: req.body
      })
    }).send(res)
  }

  static getTicket = async(req, res) => {
    new OkSuccessResponse({
      metadata: await TicketService.fetchByTicket({ data: req.query, userContext: req.userContext })
    }).send(res)
  }
}
