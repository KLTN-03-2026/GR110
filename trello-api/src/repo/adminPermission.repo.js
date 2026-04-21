import { GET_DB } from '~/config/mongodb'
import { boardPermissionModel } from '~/models/boardPermission.model'
import { workspacePermissionModel } from '~/models/workspacePermission.model'

class PermissionRepo {
  static countDocuments = async ({ filter = {} }) => {
    const [boardCount, workspaceCount] = await Promise.all([
      GET_DB()
        .collection(boardPermissionModel.BOARD_PERMISSION_COLLECTION_NAME)
        .countDocuments(filter),
      GET_DB()
        .collection(
          workspacePermissionModel.WORKSPACE_PERMISSION_COLLECTION_NAME
        )
        .countDocuments(filter)
    ])

    return boardCount + workspaceCount
  }

  static findManyWithPagination = async ({
    filter = {},
    skip = 0,
    limit = 8
  }) => {
    return await GET_DB()
      .collection(boardPermissionModel.BOARD_PERMISSION_COLLECTION_NAME)
      .aggregate([
        { $match: filter },
        {
          $project: {
            _id: 1,
            permissionCode: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            type: { $literal: 'board' }
          }
        },
        {
          $unionWith: {
            coll: workspacePermissionModel.WORKSPACE_PERMISSION_COLLECTION_NAME,
            pipeline: [
              { $match: filter },
              {
                $project: {
                  _id: 1,
                  permissionCode: 1,
                  description: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  type: { $literal: 'workspace' }
                }
              }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray()
  }
}

export default PermissionRepo
