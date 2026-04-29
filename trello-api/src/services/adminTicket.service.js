import { NotFoundErrorResponse } from '~/core/error.response'
import { sendEmailService } from '~/providers/NodeMailer'
import TicketRepo from '~/repo/adminTicket.repo'

export default class AdminTicketService {
  static fetchTickets = async ({ data }) => {
    const keyword = data?.search?.trim() || ''
    const page = Number(data?.page || 1)
    const limit = Number(data?.limit || 8)
    const skip = (page - 1) * limit
    const type = data?.type || 'all'

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const filter = {
      ...(keyword
        ? {
            $or: [
              { email: { $regex: escapedKeyword, $options: 'i' } },
              { title: { $regex: escapedKeyword, $options: 'i' } }
            ]
          }
        : {}),
      ...(type !== 'all' ? { type } : {})
    }

    const [tickets, totalCount] = await Promise.all([
      TicketRepo.findManyWithPagination({
        filter,
        skip,
        limit,
        sort: { createdAt: -1 }
      }),
      TicketRepo.countDocuments({ filter })
    ])

    return {
      tickets,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  }

  static rejectTicket = async ({ ticketId }) => {
    const ticket = await TicketRepo.findById({ _id: ticketId })
    if (!ticket) throw new NotFoundErrorResponse('Ticket not found')

    const updatedTicket = await TicketRepo.updateById({
      _id: ticketId,
      data: {
        status: 'rejected',
        updatedAt: new Date()
      }
    })

    return updatedTicket
  }

  static replyTicket = async ({ ticketId, replyContent, adminId }) => {
    const ticket = await TicketRepo.findById({ _id: ticketId })
    if (!ticket) throw new NotFoundErrorResponse('Ticket not found')

    const updatedTicket = await TicketRepo.updateById({
      _id: ticketId,
      data: {
        status: 'resolved',
        replyContent,
        repliedAt: new Date(),
        repliedBy: adminId || '',
        updatedAt: new Date()
      }
    })

    await sendEmailService({
      recipientEmail: ticket.email,
      customSubject: 'Taskio - Reply to your ticket',
      templateName: 'ReplyTicketMail',
      data: {
        customerName: ticket.email,
        ticketTitle: ticket.title,
        ticketContent: ticket.content,
        replyContent,
        staffName: 'Taskio Support Team'
      }
    })

    return updatedTicket
  }
}
