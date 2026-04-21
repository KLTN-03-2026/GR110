import { GET_DB } from '~/config/mongodb'
import { ticketModel } from '~/models/ticket.model'

export default class TicketRepo {
  static createOne = async ({ data, session }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .insertOne(data, { session })
  }
  static countDocuments = async ({ filter = {} }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .countDocuments(filter)
  }

  static findManyWithPagination = async ({
    filter = {},
    sort = { createdAt: -1 },
    skip = 0,
    limit = 3
  }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
  }
}
