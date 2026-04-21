import { GET_DB } from '~/config/mongodb'
import { transactionModel } from '~/models/transaction.model'

class TransactionRepo {
  static createOne = async ({ data }) => {
    return await GET_DB()
      .collection(transactionModel.TRANSACTION_COLLECTION_NAME)
      .insertOne(data)
  }

  static findOne = async ({ filter }) => {
    return await GET_DB()
      .collection(transactionModel.TRANSACTION_COLLECTION_NAME)
      .findOne(filter)
  }
}

export default TransactionRepo
