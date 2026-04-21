import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { USER_ROLES } from '~/constant/enum/user.enum'
import { userModel } from '~/models/user.model'

class adminAuthRepo {
  static findById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
    return result
  }

  static findByEmail = async ({ email }) => {
    const result = await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .findOne({
        email,
        role: USER_ROLES.ADMIN
      })
    return result
  }

  static updateById = async ({ _id, data }) => {
    const result = await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        { returnDocument: 'after' }
      )

    return result
  }

  static updateOne = async ({ filter, update, options = {} }) => {
    const result = await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .findOneAndUpdate(filter, update, {
        returnDocument: 'after',
        ...options
      })

    return result
  }
}

export default adminAuthRepo
