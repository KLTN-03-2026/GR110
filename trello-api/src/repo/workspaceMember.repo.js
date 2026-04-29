import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/user.model'
import { workspaceMemberModel } from '~/models/workspaceMember.model'

class WorkspaceMemberRepo {
  static count = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .countDocuments(filter, options)
  }

  static createOne = async ({ data, session }) => {
    const validData = await workspaceMemberModel.validateBeforeCreate(data)

    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .insertOne(validData, { session })
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .findOneAndUpdate(filter, data, { session, returnDocument: 'after' })
  }

  static findManyWithPagination = async ({
    filter,
    data = {},
    options = {}
  }) => {
    const { sort = { createdAt: -1 }, skip = 0, limit = 7 } = options
    const { search = '' } = data

    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .aggregate([
        { $match: filter },

        {
          $addFields: {
            userObjectId: { $toObjectId: '$userId' },
            invitedByObjectId: { $toObjectId: '$invitedBy' },
            workspaceRoleObjectId: { $toObjectId: '$workspaceRoleId' }
          }
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'invitedByObjectId',
            foreignField: '_id',
            as: 'inviter'
          }
        },
        {
          $unwind: {
            path: '$inviter',
            preserveNullAndEmptyArrays: true
          }
        },

        ...(search
          ? [
              {
                $match: {
                  $or: [
                    { 'user.email': { $regex: search, $options: 'i' } },
                    { 'user.displayName': { $regex: search, $options: 'i' } },
                    {
                      'inviter.displayName': { $regex: search, $options: 'i' }
                    },
                    { 'inviter.email': { $regex: search, $options: 'i' } }
                  ]
                }
              }
            ]
          : []),

        {
          $project: {
            _id: 1,
            status: 1,
            workspaceRoleId: 1,
            userId: 1,
            joinAt: 1,
            createdAt: 1,
            user: {
              displayName: '$user.displayName',
              email: '$user.email',
              avatar: '$user.avatar'
            },
            inviter: {
              displayName: '$inviter.displayName',
              email: '$inviter.email'
            }
          }
        },

        { $sort: sort },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray()
  }

  static countDocumentsWithSearch = async ({ filter, data = {} }) => {
    const { search = '' } = data

    const result = await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .aggregate([
        { $match: filter },

        {
          $addFields: {
            userObjectId: { $toObjectId: '$userId' },
            invitedByObjectId: { $toObjectId: '$invitedBy' }
          }
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'invitedByObjectId',
            foreignField: '_id',
            as: 'inviter'
          }
        },
        {
          $unwind: {
            path: '$inviter',
            preserveNullAndEmptyArrays: true
          }
        },

        ...(search
          ? [
              {
                $match: {
                  $or: [
                    { 'user.email': { $regex: search, $options: 'i' } },
                    { 'user.displayName': { $regex: search, $options: 'i' } },
                    { 'inviter.email': { $regex: search, $options: 'i' } },
                    { 'inviter.displayName': { $regex: search, $options: 'i' } }
                  ]
                }
              }
            ]
          : []),

        {
          $count: 'totalCount'
        }
      ])
      .toArray()

    return result[0]?.totalCount || 0
  }

  static deleteOne = async ({ filter, session }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .deleteOne(filter, { session })
  }

  static deleteMany = async ({ filter, session }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .deleteMany(filter, { session })
  }

  static countDocuments = async ({ filter = {} }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .countDocuments(filter)
  }
}
export default WorkspaceMemberRepo
