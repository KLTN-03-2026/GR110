import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/user.model'
import { workspaceModel } from '~/models/workspace.model'

class WorkspaceRepo {
    static countDocuments = async ({ filter }) => {
        const count = await GET_DB()
            .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
            .countDocuments(filter)
        return count
    }

  static findManyWithPagination = async ({
  filter = {},
  skip = 0,
  limit = 8
}) => {
  return await GET_DB()
    .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
    .aggregate([
      { $match: filter },

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

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdBy: 1,
          status: 1,
          storageUsed: 1,
          createdAt: 1,
          updatedAt: 1,
          ownerName: '$creator.displayName'
        }
      }
    ])
    .toArray()
}
}

export default WorkspaceRepo
