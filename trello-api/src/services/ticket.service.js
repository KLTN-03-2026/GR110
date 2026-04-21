import TicketRepo from '~/repo/ticket.repo'

export default class TicketService {
  static createTicket = async ({ userContext, dataTicket }) => {
    const dataTicketed = {
      email: dataTicket.email,
      title: dataTicket.title,
      type: dataTicket.type,
      content: dataTicket.content,
      createdBy: 'user',
      status: 'pending',
      createdAt: new Date()
    }

    return await TicketRepo.createOne({ data: dataTicketed })
  }

  static fetchByTicket = async ({ data, userContext }) => {
    const keyword = data?.search?.trim() || ''
    const status = data?.status || 'all'
    const type = data?.type || 'all'
    const page = Number(data?.page || 1)
    const limit = Number(data?.limit || 3)
    const skip = (page - 1) * limit

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const filter = {
        email: userContext.email
    }

    if (keyword) {
      filter.$or = [
        { email: { $regex: escapedKeyword, $options: 'i' } },
        { title: { $regex: escapedKeyword, $options: 'i' } },
      ]
    }

    if (status !== 'all') {
      filter.status = status
    }

    if (type !== 'all') {
      filter.type = type
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
}
