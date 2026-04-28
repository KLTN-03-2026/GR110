import { workspaceModel } from '~/models/workspace.model'
import { GET_DB } from '~/config/mongodb'
import { workspaceMemberModel } from '~/models/workspaceMember.model'
import { planModel } from '~/models/plan.model'
import { subscriptionModel } from '~/models/subscription.model'

class WorkspaceRepo {
  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static createOne = async ({ data, session }) => {
    const validData = await workspaceModel.validateBeforeCreate(data)
    return await GET_DB()
      .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
      .insertOne(validData, { session })
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
      .updateOne(filter, data, { session })
  }

  static deleteOne = async ({ filter, session }) => {
    return await GET_DB()
      .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
      .deleteOne(filter, { session })
  }

  static fetchByUser = async ({ userId }) => {
    return await GET_DB()
      .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME,
            let: { workspaceId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$workspaceId', '$$workspaceId'] },
                      { $eq: ['$userId', userId] },
                      { $eq: ['$status', 'active'] }
                    ]
                  }
                }
              }
            ],
            as: 'members'
          }
        },
        {
          $match: {
            members: { $ne: [] }
          }
        },
        {
          $lookup: {
            from: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
            let: { workspaceId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$workspaceId', '$$workspaceId'] },
                      { $eq: ['$status', 'active'] }
                    ]
                  }
                }
              },
              { $sort: { startedAt: -1, createdAt: -1 } },
              { $limit: 1 }
            ],
            as: 'subscription'
          }
        },
        {
          $unwind: {
            path: '$subscription',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: planModel.PLAN_COLLECTION_NAME,
            let: { planId: '$subscription.planId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, '$$planId']
                  }
                }
              },
              {
                $project: {
                  title: 1
                }
              }
            ],
            as: 'plan'
          }
        },
        {
          $unwind: {
            path: '$plan',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            subID: '$subscription._id',
            planName: '$plan.title'
          }
        },
        {
          $project: {
            subscription: 0,
            plan: 0
          }
        }
      ])
      .toArray()
  }

  static fetchByPlan = async (workspaceId) => {
    try {
      const result = await GET_DB()
        .collection(planModel.PLAN_COLLECTION_NAME)
        .aggregate([
          {
            $match: {
              isDeleted: false,
              status: 'active'
            }
          },
          {
            $lookup: {
              from: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
              let: { planIdStr: { $toString: '$_id' } },
              pipeline: [
                {
                  $match: {
                    workspaceId,
                    status: 'active'
                  }
                },
                {
                  $match: {
                    $expr: {
                      $eq: ['$planId', '$$planIdStr']
                    }
                  }
                }
              ],
              as: 'currentSubscription'
            }
          },
          {
            $addFields: {
              isCurrentPlan: {
                $gt: [{ $size: '$currentSubscription' }, 0]
              }
            }
          },
          {
            $project: {
              currentSubscription: 0
            }
          },
          {
            $sort: {
              currentPrice: 1
            }
          }
        ])
        .toArray()

      const hasActiveSubscription = result.some((plan) => plan.isCurrentPlan)

      if (!hasActiveSubscription) {
        return result.map((plan) => ({
          ...plan,
          isCurrentPlan: plan._id?.toString() === '69dc9cc2454ef403fb52c8ba'
        }))
      }

      return result
    } catch (error) {
      throw error
    }
  }

  static findByPlanId = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(planModel.PLAN_COLLECTION_NAME)
      .findOne(filter, options)
  }
}

export default WorkspaceRepo
