import { workspaceModel } from '~/models/workspace.model'
import { GET_DB } from '~/config/mongodb'
import { workspaceMemberModel } from '~/models/workspaceMember.model'
import { planModel } from '~/models/plan.model'

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
        }
      ])
      .toArray()
  }

  static fetchByPlan = async () => {
    try {
      const result = await GET_DB()
        .collection(planModel.PLAN_COLLECTION_NAME)
        .find({ isDeleted: false, status: 'active' })
        .toArray()

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
