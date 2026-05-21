import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { planModel } from '~/models/plan.model'

class PlanRepo {
  static createOne = async ({ data }) => {
    const validData = await planModel.validateBeforeCreate(data)
    const createdPlan = await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .insertOne(validData)
    return createdPlan
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
    return result
  }

  static findByEmail = async ({ email }) => {
    const result = await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .findOne({ email })
    return result
  }

  static updateById = async ({ _id, data }) => {
    const result = await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...data,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result
  }

  static updateOne = async ({ filter, update, options = {} }) => {
    const result = await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .findOneAndUpdate(filter, update, {
        returnDocument: 'after',
        ...options
      })

    return result
  }

  static findByEmailAndResetPassToken = async ({ email, resetPassToken }) => {
    const result = await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .findOne({ email, resetPassToken })
    return result
  }

  static countDocuments = async ({ filter }) => {
    const count = await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .countDocuments(filter)
    return count
  }

  static findManyWithPagination = async ({
    filter = {},
    skip = 0,
    limit = 8
  }) => {
    return await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
  }
}

export default PlanRepo
