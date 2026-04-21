import { GET_DB } from '~/config/mongodb'
import { paymentModel } from '~/models/payment.model'

class PaymentRepo {
  static createOne = async ({ data }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .insertOne(data)
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .findOne(filter, options)
  }
}

export default PaymentRepo
