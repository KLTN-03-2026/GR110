import { GET_DB } from '~/config/mongodb'
import { boardModel } from '~/models/board.model'
import { userModel } from '~/models/user.model'
import { workspaceModel } from '~/models/workspace.model'

class BoardRepo {
  static countDocuments = async ({ filter }) => {
    const count = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .countDocuments(filter)
    return count
  }

  static findManyWithPagination = async ({
    filter = {},
    skip = 0,
    limit = 8
  }) => {
    return await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .aggregate([
        { $match: filter },

        {
          $lookup: {
            from: workspaceModel.WORKSPACE_COLLECTION_NAME,
            let: { workspaceId: '$workspaceId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $ne: ['$$workspaceId', null] },
                      { $eq: ['$_id', { $toObjectId: '$$workspaceId' }] }
                    ]
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
            as: 'workspace'
          }
        },
        {
          $unwind: {
            path: '$workspace',
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            let: { createdBy: '$createdBy' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$createdBy' }]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  username: 1,
                  displayName: 1,
                  email: 1
                }
              }
            ],
            as: 'creator'
          }
        },
        {
          $unwind: {
            path: '$creator',
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            visibility: 1,
            cover: 1,
            workspaceId: 1,
            createdBy: 1,
            type: 1,
            columnOrderIds: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            workspaceName: '$workspace.title',
            ownerName: '$creator.displayName'
          }
        },

        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray()
  }
}

export default BoardRepo
