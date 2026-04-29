import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { ticketModel } from '~/models/ticket.model'

export default class TicketRepo {
  static createOne = async ({ data, session }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .insertOne(data, { session })
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findById = async ({ _id }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
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
    limit = 8,
  }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
  }

  static updateById = async ({ _id, data, options = {} }) => {
    return await GET_DB()
      .collection(ticketModel.TICKET_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        {
          returnDocument: 'after',
          ...options
        }
      )
  }
}
