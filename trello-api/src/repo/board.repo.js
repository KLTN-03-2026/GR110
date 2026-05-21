import { GET_DB } from '~/config/mongodb'
import { pagingSkipValue } from '~/utils/algorithms'
import { boardModel } from '~/models/board.model'
import { ObjectId } from 'mongodb'
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  visibility
} from '~/utils/constants'
import { columnModel } from '~/models/column.model'
import { cardModel } from '~/models/card.model'

class BoardRepo {
  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
    return result
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static count = async ({ filter = {} }) => {
    return await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .countDocuments(filter)
  }

  static findManyPagination = async ({ filter, options = {} }) => {
    const { sort, skip, limit, projection } = options

    let query = GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .find(filter, { projection })

    if (sort) query = query.sort(sort)
    if (skip) query = query.skip(skip)
    if (limit) query = query.limit(limit)

    return await query.toArray()
  }

  static getBoards = async ({ filters }) => {
    const q = filters?.q
    const userId = filters?.userId?.toString?.() || ''

    if (!userId) return { boards: [] }

    const escapeRegex = (value = '') => {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const searchConditions = []

    if (typeof q === 'string' && q.trim()) {
      const keywordRegex = new RegExp(escapeRegex(q.trim()), 'i')
      searchConditions.push({
        $or: [{ title: keywordRegex }, { description: keywordRegex }]
      })
    }

    if (q && typeof q === 'object' && !Array.isArray(q)) {
      Object.entries(q).forEach(([key, value]) => {
        if (!value || typeof value !== 'string' || !value.trim()) return

        const fieldRegex = new RegExp(escapeRegex(value.trim()), 'i')

        if (key === 'search' || key === 'keyword') {
          searchConditions.push({
            $or: [{ title: fieldRegex }, { description: fieldRegex }]
          })
          return
        }

        searchConditions.push({ [key]: fieldRegex })
      })
    }

    const query = await GET_DB()
      .collection('workspaceMembers')
      .aggregate(
        [
          {
            $match: {
              userId,
              status: 'active'
            }
          },
          {
            $lookup: {
              from: boardModel.BOARD_COLLECTION_NAME,
              let: {
                workspaceId: '$workspaceId'
              },
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
                ...(searchConditions.length
                  ? [
                      {
                        $match: {
                          $and: searchConditions
                        }
                      }
                    ]
                  : []),
                {
                  $project: {
                    _id: 0,
                    boardId: '$_id',
                    workspaceId: 1,
                    title: 1,
                    cover: 1,
                    visibility: 1
                  }
                }
              ],
              as: 'boards'
            }
          },
          { $unwind: '$boards' },
          { $replaceRoot: { newRoot: '$boards' } },
          { $sort: { title: 1 } },
          {
            $group: {
              _id: '$boardId',
              board: { $first: '$$ROOT' }
            }
          },
          { $replaceRoot: { newRoot: '$board' } }
        ],
        { collation: { locale: 'en' } }
      )
      .toArray()

    return {
      boards: query || []
    }
  }

  static getDetail = async ({ _id }) => {
    const db = GET_DB()

    const [board, columns, cards] = await Promise.all([
      db
        .collection(boardModel.BOARD_COLLECTION_NAME)
        .findOne(
          { _id: new ObjectId(_id), status: 'active' },
          { projection: { createdBy: 0, type: 0, createdAt: 0, updatedAt: 0 } }
        ),

      db
        .collection(columnModel.COLUMN_COLLECTION_NAME)
        .find(
          { boardId: _id, status: 'active' },
          { projection: { createdAt: 0, updatedAt: 0 } }
        )
        .toArray(),

      db
        .collection(cardModel.CARD_COLLECTION_NAME)
        .find(
          { boardId: _id, status: 'active' },
          {
            projection: {
              status: 0,
              description: 0,
              createdAt: 0,
              updatedAt: 0,
              archivedAt: 0
            }
          }
        )
        .toArray()
    ])

    return {
      ...board,
      columns,
      cards
    }
  }

  static createOne = async ({ data, session }) => {
    const validData = await boardModel.validateBeforeCreate(data)
    return GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .insertOne(validData, { session })
  }

  static updateOne = async ({ _id, data, session }) => {
    if (data.columnOrderIds)
      data.columnOrderIds = data.columnOrderIds.map((_id) => new ObjectId(_id))

    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        { returnDocument: 'after', session }
      )
    return result
  }

  static pushColumnOrderIds = async ({ column, session }) => {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        { $push: { columnOrderIds: new ObjectId(column._id) } },
        { returnDocument: 'after', session }
      )
    return result
  }

  static pullColumnOrderIds = async ({ column, session }) => {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        { $pull: { columnOrderIds: new ObjectId(column._id) } },
        { returnDocument: 'after', session }
      )
    return result
  }

  static pushMemberIds = async ({ _id, userId }) => {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $push: { memberIds: new ObjectId(userId) } },
        { returnDocument: 'after' }
      )
    return result
  }

  static updateMany = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .updateMany(filter, data, { returnDocument: 'after', session })
  }

  static updateById = async ({ _id, data, options = {} }) => {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        { returnDocument: 'after', ...options }
      )

    return result
  }

  static deleteById = async ({ _id, options = {} }) => {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(_id) }, options)

    return result
  }

  static deleteMany = async ({ filter, options = {}, session }) => {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .deleteMany(filter, { ...options, session: session || options.session })

    return result
  }

  static countDocuments = async ({ filter = {} }) => {
    return await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .countDocuments(filter)
  }
}
export default BoardRepo
