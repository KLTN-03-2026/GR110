import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { planModel } from '~/models/plan.model'
import { subscriptionModel } from '~/models/subscription.model'
import { workspaceModel } from '~/models/workspace.model'

class AdminSubscriptionRepo {
  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static findById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
    return result
  }


  static updateById = async ({ _id, data }) => {
    const result = await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
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


  static countDocuments = async ({ filter }) => {
    const count = await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .countDocuments(filter)
    return count
  }

  static findManyWithPagination = async ({
    filter = {},
    skip = 0,
    limit = 8
  }) => {
    return await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .aggregate([
        {
          $match: filter
        },
        {
          $lookup: {
            from: workspaceModel.WORKSPACE_COLLECTION_NAME,
            let: { workspaceObjectId: { $toObjectId: '$workspaceId' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$workspaceObjectId']
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  title: 1
                }
              }
            ],
            as: 'workspaceInfo'
          }
        },
        {
          $lookup: {
            from: planModel.PLAN_COLLECTION_NAME,
            let: { planObjectId: { $toObjectId: '$planId' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$planObjectId']
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  title: 1
                }
              }
            ],
            as: 'planInfo'
          }
        },
        {
          $unwind: {
            path: '$workspaceInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: '$planInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            workspaceId: 1,
            planId: 1,
            status: 1,
            planFeatureSnapshot: 1,
            startedAt: 1,
            endedAt: 1,
            createdAt: 1,
            updatedAt: 1,
            canceledAt: 1,
            workspaceTitle: '$workspaceInfo.title',
            planTitle: '$planInfo.title'
          }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ])
      .toArray()
  }
}

export default AdminSubscriptionRepo
