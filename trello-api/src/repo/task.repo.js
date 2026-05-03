import { GET_DB } from '~/config/mongodb'
import { taskModel } from '~/models/task.model'

class TaskRepo {
  static getListByCardId = async ({ cardId, options = {} }) => {
    const rootSort = options.sort || { createdAt: 1 }
    const childSort = options.childSort || { createdAt: 1 }

    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .aggregate([
        { $match: { cardId, parentTaskId: null } },

        {
          $lookup: {
            from: taskModel.TASK_COLLECTION_NAME,
            let: { parentTaskIdStr: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$parentTaskId', '$$parentTaskIdStr'] },
                      { $eq: ['$cardId', cardId] }
                    ]
                  }
                }
              },
              { $sort: childSort }
            ],
            as: 'childTasks'
          }
        },

        { $sort: rootSort }
      ])
      .toArray()
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static createOne = async ({ data, session }) => {
    const validData = await taskModel.validateBeforeCreate(data)
    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .insertOne(validData, { session })
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .findOneAndUpdate(filter, data, { session, returnDocument: 'after' })
  }

  static deleteOne = async ({ filter, session }) => {
    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .deleteOne(filter, { session })
  }

  static deleteMany = async ({ filter, session }) => {
    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .deleteMany(filter, { session })
  }

  static getMaxTasksPerCard = async ({ workspaceId }) => {
    const result = await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .aggregate([
        {
          $addFields: {
            cardObjectId: { $toObjectId: '$cardId' }
          }
        },
        {
          $lookup: {
            from: 'cards',
            localField: 'cardObjectId',
            foreignField: '_id',
            as: 'card'
          }
        },
        { $unwind: '$card' },
        {
          $addFields: {
            boardObjectId: { $toObjectId: '$card.boardId' }
          }
        },
        {
          $lookup: {
            from: 'boards',
            localField: 'boardObjectId',
            foreignField: '_id',
            as: 'board'
          }
        },
        { $unwind: '$board' },
        {
          $match: {
            'board.workspaceId': workspaceId
          }
        },
        {
          $group: {
            _id: '$cardObjectId',
            total: { $sum: 1 }
          }
        },
        {
          $sort: { total: -1 }
        },
        {
          $limit: 1
        }
      ])
      .toArray()

    return result[0]?.total || 0
  }

  static count = async ({ filter = {}, options = {} }) => {
    return await GET_DB()
      .collection(taskModel.TASK_COLLECTION_NAME)
      .countDocuments(filter, options)
  }

  static aggregateTaskStats = async (boardId) => {
    const result = await GET_DB()
      .collection('tasks')
      .aggregate([
        {
          $match: { boardId }
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            done: {
              $sum: {
                $cond: [{ $eq: ['$isCompleted', true] }, 1, 0]
              }
            }
          }
        }
      ])
      .toArray()

    return {
      total: result[0]?.total || 0,
      done: result[0]?.done || 0
    }
  }
}

export default TaskRepo
