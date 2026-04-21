import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { planModel } from '~/models/plan.model'
import { subscriptionModel } from '~/models/subscription.model'
import { workspaceModel } from '~/models/workspace.model'

class SubscriptionRepo {
  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static createOne = async ({ data, session }) => {
    const validData = await subscriptionModel.validateBeforeCreate(data)

    return await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .insertOne(validData, { session })
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .updateOne(filter, data, { session })
  }

  static findDetailById = async ({ subscriptionId }) => {
    const result = await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(subscriptionId)
          }
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
                  title: 1,
                  feature: 1,
                  originPrice: 1,
                  currentPrice: 1
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
            _id: 0,
            subscriptionId: { $toString: '$_id' },
            workspaceId: '$workspaceId',
            workspaceTitle: '$workspaceInfo.title',
            planId: '$planId',
            planTitle: '$planInfo.title',
            planFeature: '$planInfo.feature',
            originPrice: '$planInfo.originPrice',
            currentPrice: '$planInfo.currentPrice',
            status: 1,
            canceledAt: 1,
            startedAt: 1,
            endedAt: 1
          }
        }
      ])
      .toArray()

    return result[0] || null
  }

  static updateMany = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .updateMany(filter, data, { session })
  }
}

export default SubscriptionRepo
