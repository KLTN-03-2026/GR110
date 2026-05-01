import { GET_DB } from '~/config/mongodb'
import { boardMemberModel } from '~/models/boardMember.model'
import { userModel } from '~/models/user.model'
import { workspaceMemberModel } from '~/models/workspaceMember.model'
import WorkspaceMemberRepo from './workspaceMember.repo'

class BoardMemberRepo {
  static createOne = async ({ data, session }) => {
    const validData = await boardMemberModel.validateBeforeCreate(data)
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .insertOne(validData, { session })
  }

  static getMembersByBoardId = async ({ boardId, data = {}, options = {} }) => {
    const db = GET_DB()
    const { sort = { createdAt: -1 }, skip = 0, limit = 50 } = options
    const keyword = data.search?.trim() || ''

    const boardMemberCol = db.collection(
      boardMemberModel.BOARD_MEMBER_COLLECTION_NAME
    )

    const joinStages = [
      {
        $addFields: {
          workspaceMemberObjectId: { $toObjectId: '$workspaceMemberId' }
        }
      },
      {
        $lookup: {
          from: workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME,
          localField: 'workspaceMemberObjectId',
          foreignField: '_id',
          as: 'workspaceMember'
        }
      },
      { $unwind: '$workspaceMember' },
      {
        $addFields: {
          userObjectId: { $toObjectId: '$workspaceMember.userId' }
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
      }
    ]

    const projectStage = {
      $project: {
        _id: 1,
        status: 1,
        joinAt: 1,
        boardRoleId: 1,
        userId: '$user._id',
        user: {
          displayName: '$user.displayName',
          email: '$user.email',
          avatar: '$user.avatar'
        }
      }
    }

    let pipeline

    if (keyword) {
      pipeline = [
        { $match: { boardId } },
        ...joinStages,
        {
          $match: {
            $or: [
              { 'user.email': { $regex: keyword, $options: 'i' } },
              { 'user.displayName': { $regex: keyword, $options: 'i' } }
            ]
          }
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        projectStage
      ]
    } else {
      pipeline = [
        { $match: { boardId } },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        ...joinStages,
        projectStage
      ]
    }

    return await boardMemberCol.aggregate(pipeline).toArray()
  }

  static countMembersByBoardId = async ({
    boardId,
    data = {},
    options = {}
  }) => {
    const db = GET_DB()
    const { session } = options
    const keyword = data.search?.trim() || ''

    const boardMemberCol = db.collection(
      boardMemberModel.BOARD_MEMBER_COLLECTION_NAME
    )
    const workspaceMemberCol = db.collection(
      workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME
    )
    const userCol = db.collection(userModel.USER_COLLECTION_NAME)
    const sess = { session }

    if (!keyword) return await boardMemberCol.countDocuments({ boardId }, sess)

    const userIds = await userCol
      .find(
        {
          $or: [
            { email: { $regex: keyword, $options: 'i' } },
            { displayName: { $regex: keyword, $options: 'i' } }
          ]
        },
        { projection: { _id: 1 }, ...sess }
      )
      .toArray()
      .then((rows) => rows.map((u) => u._id.toString()))

    if (!userIds.length) return 0

    const wsmIds = await workspaceMemberCol
      .find({ userId: { $in: userIds } }, { projection: { _id: 1 }, ...sess })
      .toArray()
      .then((rows) => rows.map((r) => r._id.toString()))

    if (!wsmIds.length) return 0

    return await boardMemberCol.countDocuments(
      { boardId, workspaceMemberId: { $in: wsmIds } },
      sess
    )
  }

  static findMemberInBoard = async ({ userId, boardId, session }) => {
    const db = GET_DB()

    const workspaceMember = await WorkspaceMemberRepo.findMany({
      filter: { userId, status: 'active' },
      options: { projection: { _id: 1 }, session }
    })

    if (!workspaceMember || workspaceMember.length == 0) return null

    const workspaceMemberIds = workspaceMember.map((mem) => mem._id.toString())

    const member = await db
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .findOne(
        {
          workspaceMemberId: { $in: workspaceMemberIds },
          boardId,
          status: 'active'
        },
        { session }
      )

    return member || null
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .findOneAndUpdate(filter, data, { session, returnDocument: 'after' })
  }

  static updateMany = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .updateMany(filter, data, { session })
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .findOne(filter, options)
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static countDocuments = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .countDocuments(filter, options)
  }

  static deleteManyByBoardId = async ({ boardId, session }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .deleteMany({ boardId }, { session })
  }

  static deleteMany = async ({ filter, session }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .deleteMany(filter, { session })
  }
}

export default BoardMemberRepo
