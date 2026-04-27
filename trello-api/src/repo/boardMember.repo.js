import { GET_DB } from '~/config/mongodb'
import { boardMemberModel } from '~/models/boardMember.model'
import { userModel } from '~/models/user.model'
import { workspaceMemberModel } from '~/models/workspaceMember.model'
import { ObjectId } from 'mongodb'
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
    const { sort = { createdAt: -1 }, skip = 0, limit = 50, session } = options
    const keyword = data.search?.trim() || ''

    const boardMemberCol = db.collection(
      boardMemberModel.BOARD_MEMBER_COLLECTION_NAME
    )
    const workspaceMemberCol = db.collection(
      workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME
    )
    const userCol = db.collection(userModel.USER_COLLECTION_NAME)

    const toOid = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null)
    const toOidList = (arr) =>
      [...new Set(arr.filter(Boolean))].map(toOid).filter(Boolean)
    const sess = { session }

    // ── 1. boardMembers ───────────────────────────────────────────────────────
    let boardMembers = []

    if (keyword) {
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

      if (!userIds.length) return []

      const wsmIds = await workspaceMemberCol
        .find({ userId: { $in: userIds } }, { projection: { _id: 1 }, ...sess })
        .toArray()
        .then((rows) => rows.map((r) => r._id.toString()))

      if (!wsmIds.length) return []

      boardMembers = await boardMemberCol
        .find({ boardId, workspaceMemberId: { $in: wsmIds } }, sess)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray()
    } else {
      boardMembers = await boardMemberCol
        .find({ boardId }, sess)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray()
    }

    if (!boardMembers.length) return []

    // ── 2. Fetch workspaceMembers ─────────────────────────────────────────────
    const workspaceMembers = await workspaceMemberCol
      .find(
        {
          _id: { $in: toOidList(boardMembers.map((m) => m.workspaceMemberId)) }
        },
        { projection: { _id: 1, userId: 1 }, ...sess }
      )
      .toArray()

    if (!workspaceMembers.length) return []

    // ── 3. Fetch users ────────────────────────────────────────────────────────
    const users = await userCol
      .find(
        { _id: { $in: toOidList(workspaceMembers.map((m) => m.userId)) } },
        { projection: { displayName: 1, email: 1, avatar: 1 }, ...sess }
      )
      .toArray()

    // ── 4. Build maps + assemble ──────────────────────────────────────────────
    const wsmMap = new Map(workspaceMembers.map((m) => [String(m._id), m]))
    const userMap = new Map(users.map((u) => [String(u._id), u]))

    return boardMembers.map((bm) => {
      const wsm = wsmMap.get(bm.workspaceMemberId)
      const user = wsm ? userMap.get(String(wsm.userId)) : null

      return {
        _id: bm._id,
        status: bm.status,
        joinAt: bm.joinAt,
        boardRoleId: bm.boardRoleId,
        userId: user?._id || null,
        user: user
          ? {
              displayName: user.displayName,
              email: user.email,
              avatar: user.avatar
            }
          : null
      }
    })
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

  static countDocuments = async ({ filter }) => {
    return await GET_DB()
      .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
      .countDocuments(filter)
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
