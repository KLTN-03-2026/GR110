import { GET_DB } from '~/config/mongodb'
import { transactionModel } from '~/models/transaction.model'

class TransactionRepo {
  static createOne = async ({ data, session = null }) => {
    return await GET_DB()
      .collection(transactionModel.TRANSACTION_COLLECTION_NAME)
      .insertOne(data, { session })
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(transactionModel.TRANSACTION_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(transactionModel.TRANSACTION_COLLECTION_NAME)
      .findOneAndUpdate(filter, data, { session, returnDocument: 'after' })
  }
}

export default TransactionRepo
