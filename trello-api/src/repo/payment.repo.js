import { GET_DB } from '~/config/mongodb'
import { paymentModel } from '~/models/payment.model'

class PaymentRepo {
  static createOne = async ({ data, session = null }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .insertOne(data, {session})
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .updateOne(filter, data, { session })
  }
}

export default PaymentRepo
