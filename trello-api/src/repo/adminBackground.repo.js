import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { backgroundModel } from '~/models/background.model'

class BackgroundRepo {
  static findById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
    return result
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static findByEmail = async ({ email }) => {
    const result = await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .findOne({ email })
    return result
  }

  static updateById = async ({ _id, data }) => {
    const result = await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        { returnDocument: 'after' }
      )

    return result
  }

  static updateOne = async ({ filter, update, options = {} }) => {
    const result = await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .findOneAndUpdate(filter, update, {
        returnDocument: 'after',
        ...options
      })

    return result
  }

  static createOne = async ({ data, session }) => {
    const result = await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .insertOne(data, { session })
    return result
  }

  static countDocuments = async ({ filter }) => {
    const count = await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .countDocuments(filter)
    return count
  }

  static findManyWithPagination = async ({
    filter = {},
    skip = 0,
    limit = 8
  }) => {
    return await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray()
  }

  static deleteById = async ({ _id, session }) => {
    const result = await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(_id) }, { session })

    return result
  }

  static deleteMany = async ({ filter, session }) => {
    return await GET_DB()
      .collection(backgroundModel.BACKGROUND_COLLECTION_NAME)
      .deleteMany(filter, { session })
  }
}

export default BackgroundRepo
