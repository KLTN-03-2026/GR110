import { cloneDeep } from 'lodash'
import {
  BadRequestErrorResponse,
  ConflictErrorResponse,
  ForbiddenErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import BoardRepo from '~/repo/board.repo'
import CardRepo from '~/repo/card.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import { ObjectId } from 'mongodb'
import BoardRoleRepo from '~/repo/boardRole.repo'
import BoardMemberRepo from '~/repo/boardMember.repo'
import WorkspaceMemberRepo from '~/repo/workspaceMember.repo'
import { BOARD_MEMBER_STATUS } from '~/constant/enum/boardMember.enum'
import BoardPermissionRepo from '~/repo/boardPermission.repo'
import { mongoClientInstance } from '~/config/mongodb'
import ColumnRepo from '~/repo/column.repo'
import LabelRepo from '~/repo/label.repo'
import ActivityLogRepo from '~/repo/activityLog.repo'
import AttachmentRepo from '~/repo/attachment.repo'
import CommentRepo from '~/repo/comment.repo'
import TaskRepo from '~/repo/task.repo'
import InvitationRepo from '~/repo/invitation.repo'
import {
  invalidateBoardAccessCache,
  invalidateBoardAccessCachesByBoard
} from '~/helpers/boardPermission.cache'
import { getActiveSubscriptionCached } from '~/helpers/subscription.cache'
import BackgroundRepo from '~/repo/adminBackground.repo'
import S3Provider from '~/providers/S3Provider'
import { emitBoardUpdated } from '~/realtime/realtimeEmitters/boardRealtime.emitter'
import { emitCardMoved } from '~/realtime/realtimeEmitters/cardRealtime.emitter'
import { BOARD_PERMISSIONS } from '~/constant/boardPermission.constant'

const DEFAULT_BOARD_LABELS = [
  { title: '', color: 'green' },
  { title: '', color: 'yellow' },
  { title: '', color: 'orange' },
  { title: '', color: 'red' },
  { title: '', color: 'purple' },
  { title: '', color: 'blue' }
]

const generateBoardAdminRole = ({ boardId }) => {
  return {
    boardId: boardId.toString(),
    name: 'Admin',
    isDefault: true,
    key: 'board_admin',
    permissionCodes: [
      'board.view',
      'board.update',
      'board.delete',

      'board.member.invite',
      'board.member.remove',
      'board.member.changeRole',

      'board.role.create',
      'board.role.update',
      'board.role.delete',

      'board.label.create',
      'board.label.update',
      'board.label.delete',

      'board.column.create',
      'board.column.update',
      'board.column.archive',
      'board.column.restore',
      'board.column.delete',

      'board.card.create',
      'board.card.update',
      'board.card.delete',
      'board.card.move',
      'board.card.archive',
      'board.card.restore',
      'board.card.member.assign',
      'board.card.member.remove',

      'board.card.comment.create',
      'board.card.comment.delete',

      'board.card.attachment.create',
      'board.card.attachment.delete',
      'board.card.attachment.rename',
      'board.card.attachment.download',

      'board.card.task.create',
      'board.card.task.update',
      'board.card.task.delete'
    ]
  }
}

const generateBoardViewerRole = ({ boardId }) => {
  return {
    boardId: boardId.toString(),
    name: 'Viewer',
    isDefault: true,
    key: 'board_viewer',
    permissionCodes: ['board.view']
  }
}

const generateBoardLabel = ({ boardId, createdBy }) => {
  return DEFAULT_BOARD_LABELS.map((l) => ({ ...l, boardId, createdBy }))
}

class BoardService {
  static getBoardOverview = async ({ userContext, data }) => {
    const workspaces = await WorkspaceRepo.findMany({
      filter: { ownerId: userContext._id.toString() }
    })

    if (!workspaces || !workspaces.length) return []

    const workspaceIds = workspaces.map((w) => w._id.toString())

    const boards = await BoardRepo.findMany({
      filter: { workspaceId: { $in: workspaceIds } }
    })

    const result = workspaces.map((workspace) => {
      const workspaceId = workspace._id.toString()

      return {
        ...workspace,
        boards:
          boards?.filter((board) => board.workspaceId === workspaceId) || []
      }
    })

    return result
  }

  static fetchBoardByWorkspaceId = async ({
    workspaceId,
    page = 1,
    itemsPerPage = 10
  }) => {
    const currentPage = Math.max(Number(page) || 1, 1)
    const limit = Math.max(Number(itemsPerPage) || 10, 1)
    const skip = (currentPage - 1) * limit

    const filter = {
      workspaceId,
      status: { $ne: 'archived' }
    }

    const [boards, count] = await Promise.all([
      BoardRepo.findManyPagination({
        filter,
        options: {
          sort: { createdAt: -1 },
          skip,
          limit
        }
      }),

      BoardRepo.count({ filter: { workspaceId } })
    ])

    return { boards, count }
  }

  static getBoards = async ({ userContext, data }) => {
    const filters = {
      ...data,
      userId: userContext._id
    }

    const boards = await BoardRepo.getBoards({ filters })

    return boards
  }

  static getBackground = async () => {
    return await BackgroundRepo.findMany({
      filter: {
        isDelete: false,
        status: 'active',
        entity: 'board',
        type: { $in: ['system', 'board'] }
      },
      options: {}
    })
  }

  static getDetails = async ({ _id }) => {
    const [board, members, labels] = await Promise.all([
      BoardRepo.getDetail({ _id }),
      BoardMemberRepo.getMembersByBoardId({
        boardId: _id,
        data: { search: '' }
      }),
      LabelRepo.findMany({
        filter: { boardId: _id },
        options: { projection: { _id: 1, title: 1, color: 1 } }
      })
    ])

    if (!board) throw new NotFoundErrorResponse('Board not found.')

    const resBoard = cloneDeep(board)

    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => String(card.columnId) === String(column._id)
      )
    })

    delete resBoard.cards

    return { board: resBoard, members, labels }
  }

  static create = async ({ workspaceAccess, userContext, data }) => {
    const createBoardData = { ...data, createdBy: userContext._id }

    let createdBoard = null

    const subscription = await getActiveSubscriptionCached({
      workspaceId: workspaceAccess.workspace._id
    })

    if (!subscription)
      throw new NotFoundErrorResponse(
        'Subscription not found for this workspace.'
      )

    const features = subscription.planFeatureSnapshot

    const countBoards = await BoardRepo.count({
      filter: { workspaceId: workspaceAccess.workspace._id.toString() }
    })

    if (countBoards >= features?.limits?.maxBoards)
      throw new ForbiddenErrorResponse(
        'Your current subscription plan does not allow creating more boards.'
      )

    const session = await mongoClientInstance.startSession()

    try {
      await session.withTransaction(async () => {
        createdBoard = await BoardRepo.createOne({
          data: createBoardData,
          session
        })

        const createdBoardRole = await BoardRoleRepo.createOne({
          data: generateBoardAdminRole({ boardId: createdBoard.insertedId }),
          session
        })

        await BoardRoleRepo.createOne({
          data: generateBoardViewerRole({ boardId: createdBoard.insertedId }),
          session
        })

        const workspaceMember = workspaceAccess?.workspaceMember

        const createdBoardMemberData = {
          boardId: createdBoard.insertedId.toString(),
          workspaceMemberId: workspaceMember._id.toString(),
          boardRoleId: createdBoardRole.insertedId.toString(),
          invitedBy: userContext._id.toString(),
          status: BOARD_MEMBER_STATUS[0],
          joinAt: new Date()
        }

        const createdMember = await BoardMemberRepo.createOne({
          data: createdBoardMemberData,
          session
        })

        const createLabelData = generateBoardLabel({
          boardId: createdBoard.insertedId.toString(),
          createdBy: createdMember.insertedId.toString()
        })

        await ActivityLogRepo.createOne({
          data: {
            boardId: createdBoard.insertedId.toString(),
            authorId: createdMember.insertedId.toString(),
            authorType: 'boardMember',
            entityType: 'board',
            entityId: createdBoard.insertedId.toString(),
            action: 'board.create',
            content: 'created this board'
          },
          session
        })

        await LabelRepo.createMany({ data: createLabelData, session })
      })

      const newBoard = await BoardRepo.findById({
        _id: createdBoard.insertedId
      })

      return newBoard
    } finally {
      await session.endSession()
    }
  }

  static update = async ({ _id, boardAccess, data }) => {
    const session = await mongoClientInstance.startSession()

    try {
      const updatedBoard = await session.withTransaction(async () => {
        const board = await BoardRepo.findOne({
          filter: { _id: new ObjectId(_id) },
          options: { session }
        })

        if (!board) throw new NotFoundErrorResponse('Board not found.')

        const updateData = { ...data, updatedAt: new Date() }

        const updatedBoard = await BoardRepo.updateOne({
          _id,
          data: updateData,
          session
        })

        const oldTitle = board.title || ''
        const newTitle = updatedBoard.title || ''

        const oldDescription = board.description || ''
        const newDescription = updatedBoard.description || ''

        const oldVisibility = board.visibility || ''
        const newVisibility = updatedBoard.visibility || ''

        const oldCover = board.cover?.value || ''
        const newCover = updatedBoard.cover?.value || ''

        if (oldTitle !== newTitle) {
          await ActivityLogRepo.createOne({
            data: {
              boardId: boardAccess.board._id.toString(),
              authorId: boardAccess.boardMember._id.toString(),
              authorType: 'boardMember',
              entityType: 'board',
              entityId: _id.toString(),
              action: 'board.update.title',
              content: `renamed this board (from ${oldTitle})`
            },
            session
          })
        }

        if (oldDescription !== newDescription) {
          await ActivityLogRepo.createOne({
            data: {
              boardId: boardAccess.board._id.toString(),
              authorId: boardAccess.boardMember._id.toString(),
              authorType: 'boardMember',
              entityType: 'board',
              entityId: _id.toString(),
              action: 'board.update.description',
              content: 'changed description of this board'
            },
            session
          })
        }

        if (oldCover !== newCover) {
          await ActivityLogRepo.createOne({
            data: {
              boardId: boardAccess.board._id.toString(),
              authorId: boardAccess.boardMember._id.toString(),
              authorType: 'boardMember',
              entityType: 'board',
              entityId: _id.toString(),
              action: 'board.update.cover',
              content: 'changed cover of this board'
            },
            session
          })
        }

        if (oldVisibility !== newVisibility) {
          await ActivityLogRepo.createOne({
            data: {
              boardId: boardAccess.board._id.toString(),
              authorId: boardAccess.boardMember._id.toString(),
              authorType: 'boardMember',
              entityType: 'board',
              entityId: _id.toString(),
              action: 'board.update.visibility',
              content: `changed visibility of this board (from ${oldVisibility})`
            },
            session
          })
        }

        emitBoardUpdated({ boardId: _id.toString(), board: updatedBoard })

        return updatedBoard
      })

      return updatedBoard
    } finally {
      await session.endSession()
    }
  }

  static moveCardToDifferentColumn = async ({ boardAccess, data }) => {
    const session = await mongoClientInstance.startSession()
    const boardId = boardAccess.board._id.toString()

    try {
      const result = await session.withTransaction(async () => {
        const prevColumnId = data.prevColumnId.toString()
        const nextColumnId = data.nextColumnId.toString()
        const currentCardId = data.currentCardId.toString()

        if (prevColumnId === nextColumnId)
          throw new BadRequestErrorResponse(
            'Previous and next columns must be different.'
          )

        const prevColumn = await ColumnRepo.findOne({
          filter: {
            _id: new ObjectId(prevColumnId),
            boardId,
            status: 'active'
          },
          options: { session }
        })

        const nextColumn = await ColumnRepo.findOne({
          filter: {
            _id: new ObjectId(nextColumnId),
            boardId,
            status: 'active'
          },
          options: { session }
        })

        const currentCard = await CardRepo.findOne({
          filter: {
            _id: new ObjectId(currentCardId),
            boardId,
            status: 'active'
          },
          options: { session }
        })

        if (!prevColumn)
          throw new NotFoundErrorResponse('Previous column not found.')
        if (!nextColumn)
          throw new NotFoundErrorResponse('Next column not found.')
        if (!currentCard) throw new NotFoundErrorResponse('Card not found.')

        if (currentCard.columnId.toString() !== prevColumnId)
          throw new ConflictErrorResponse(
            'The card does not belong to the previous column.'
          )

        const prevCardOrderIds = data.prevCardOrderIds.map((id) =>
          id.toString()
        )
        const nextCardOrderIds = data.nextCardOrderIds.map((id) =>
          id.toString()
        )

        if (prevCardOrderIds.includes(currentCardId))
          throw new BadRequestErrorResponse(
            'Previous column order must not contain the moved card.'
          )

        if (!nextCardOrderIds.includes(currentCardId))
          throw new BadRequestErrorResponse(
            'Next column order must contain the moved card.'
          )

        const orderedCardIds = [
          ...new Set([...prevCardOrderIds, ...nextCardOrderIds])
        ]

        if (
          orderedCardIds.length !==
          prevCardOrderIds.length + nextCardOrderIds.length
        )
          throw new BadRequestErrorResponse(
            'Card order contains duplicate cards.'
          )

        if (orderedCardIds.length) {
          const cardsInBoard = await CardRepo.findMany({
            filter: {
              _id: { $in: orderedCardIds.map((id) => new ObjectId(id)) },
              boardId,
              status: 'active'
            },
            options: { session }
          })

          if (cardsInBoard.length !== orderedCardIds.length)
            throw new BadRequestErrorResponse(
              'Card order contains cards outside this board.'
            )

          const prevCardOrderSet = new Set(prevCardOrderIds)
          const nextCardOrderSet = new Set(nextCardOrderIds)

          const hasCardInWrongColumn = cardsInBoard.some((card) => {
            const cardId = card._id.toString()
            const columnId = card.columnId.toString()

            if (cardId === currentCardId) return false

            return (
              (prevCardOrderSet.has(cardId) && columnId !== prevColumnId) ||
              (nextCardOrderSet.has(cardId) && columnId !== nextColumnId)
            )
          })

          if (hasCardInWrongColumn)
            throw new BadRequestErrorResponse(
              'Card order contains cards from another column.'
            )
        }

        const updatePrevColumn = await ColumnRepo.updateById({
          _id: prevColumnId,
          data: { cardOrderIds: prevCardOrderIds, updatedAt: new Date() },
          session
        })

        const updateNextColumn = await ColumnRepo.updateById({
          _id: nextColumnId,
          data: { cardOrderIds: nextCardOrderIds, updatedAt: new Date() },
          session
        })

        const updatedCard = await CardRepo.updateOne({
          filter: { _id: new ObjectId(currentCardId), boardId },
          data: { $set: { columnId: nextColumnId } },
          session
        })

        if (!updatedCard) throw new NotFoundErrorResponse('Card not found.')

        return { updatedCard, updatePrevColumn, updateNextColumn }
      })

      emitCardMoved({
        boardId,
        card: result.updatedCard,
        prevColumn: result.updatePrevColumn,
        nextColumn: result.updateNextColumn
      })
    } finally {
      await session.endSession()
    }
    return {}
  }

  static fetchBoardActivity = async ({ _id }) => {
    const boardActivity = await ActivityLogRepo.findMany({
      filter: { boardId: _id },
      options: { sort: { createdAt: -1 } }
    })

    return boardActivity
  }

  // ============================== ROLE & PERMISSION ==============================
  static fetchBoardPermission = async () => {
    const boardPermissions = await BoardPermissionRepo.findMany({
      options: { projection: { _id: 1, permissionCode: 1, description: 1 } }
    })

    return boardPermissions
  }

  static fetchBoardRole = async ({ _id }) => {
    const boardRoles = await BoardRoleRepo.findMany({
      filter: { boardId: _id.toString() },
      options: {
        projection: { key: 0, createdAt: 0, updatedAt: 0, workspaceId: 0 }
      }
    })

    return boardRoles
  }

  static createRole = async ({ boardAccess, data }) => {
    const subscription = await getActiveSubscriptionCached({
      workspaceId: boardAccess.board.workspaceId
    })

    if (!subscription)
      throw new NotFoundErrorResponse(
        'Subscription not found for this workspace.'
      )

    const features = subscription.planFeatureSnapshot

    if (!features?.capabilities?.board?.customRole)
      throw new ForbiddenErrorResponse(
        'Your current subscription plan does not allow creating custom roles for boards.'
      )

    const session = await mongoClientInstance.startSession()

    try {
      return await session.withTransaction(async () => {
        const countRoles = await BoardRoleRepo.count({
          filter: {
            boardId: boardAccess.board._id.toString(),
            isDefault: false
          },
          options: { session }
        })

        if (countRoles >= features?.limits?.maxBoardRoles)
          throw new ForbiddenErrorResponse(
            `Your current subscription plan allows a maximum of ${features.limits.maxBoardRoles} custom roles.`
          )

        const permissionCodes = this._normalizeBoardPermissionCodes(
          data.permissionCodes || []
        )

        const createdRole = await BoardRoleRepo.createOne({
          data: {
            name: data.name,
            permissionCodes,
            boardId: boardAccess.board._id.toString(),
            isDefault: false
          },
          session
        })

        const role = await BoardRoleRepo.findOne({
          filter: { _id: new ObjectId(createdRole.insertedId) },
          options: { session }
        })

        if (!role) throw new NotFoundErrorResponse('Created role not found.')

        await ActivityLogRepo.createOne({
          data: {
            boardId: boardAccess.board._id.toString(),
            authorId: boardAccess.boardMember._id.toString(),
            authorType: 'boardMember',
            entityType: 'boardRole',
            entityId: role._id.toString(),
            action: 'board.role.create',
            content: `created role "${role.name}" in this board"`
          },
          session
        })

        return role
      })
    } finally {
      await session.endSession()
    }
  }

  static updateRole = async ({ boardAccess, data }) => {
    const session = await mongoClientInstance.startSession()
    let updatedRoles = null
    console.log('data::::', data)
    try {
      updatedRoles = await session.withTransaction(async () => {
        if (!Array.isArray(data) || !data.length) {
          throw new BadRequestErrorResponse('Role update data is required.')
        }

        const roleIds = data.map((item) => item._id.toString())

        if (new Set(roleIds).size !== roleIds.length)
          throw new BadRequestErrorResponse(
            'Duplicate role ids are not allowed.'
          )

        const existedRoles = await BoardRoleRepo.findMany({
          filter: {
            _id: { $in: roleIds.map((id) => new ObjectId(id)) },
            boardId: boardAccess.board._id.toString()
          },
          options: { session }
        })

        if (existedRoles.length !== roleIds.length) {
          throw new NotFoundErrorResponse(
            'Some roles were not found in this board.'
          )
        }

        const oldRoleMap = new Map(
          existedRoles.map((role) => [role._id.toString(), role])
        )

        const updateResults = []

        for (const item of data) {
          const { _id } = item
          const oldRole = oldRoleMap.get(_id.toString())

          if (!oldRole) continue

          const updateData = {}

          if (item.name !== undefined) updateData.name = item.name
          if (item.permissionCodes !== undefined) {
            updateData.permissionCodes = this._normalizeBoardPermissionCodes(
              item.permissionCodes
            )
          }

          const hasChanged =
            (updateData.name !== undefined &&
              updateData.name !== (oldRole.name || '')) ||
            (updateData.permissionCodes !== undefined &&
              !sameStringSet(
                updateData.permissionCodes,
                oldRole.permissionCodes || []
              ))

          if (!hasChanged) continue

          if (oldRole.isDefault)
            throw new ForbiddenErrorResponse('Default roles cannot be updated.')

          updateData.updatedAt = new Date()

          const updatedRole = await BoardRoleRepo.updateOne({
            filter: {
              _id: new ObjectId(_id),
              boardId: boardAccess.board._id.toString(),
              isDefault: false
            },
            data: { $set: updateData },
            session
          })

          updateResults.push(updatedRole)

          const oldName = oldRole?.name || ''
          const newName = updateData.name || oldName

          await ActivityLogRepo.createOne({
            data: {
              boardId: boardAccess.board._id.toString(),
              authorId: boardAccess.boardMember._id.toString(),
              authorType: 'boardMember',
              entityType: 'boardRole',
              entityId: _id.toString(),
              action: 'board.role.update',
              content:
                oldName !== newName
                  ? `updated role "${oldName}" to "${newName}"`
                  : `updated role "${oldName || newName}"`
            },
            session
          })
        }

        return updateResults
      })
    } finally {
      await session.endSession()
    }

    if (updatedRoles?.length)
      await invalidateBoardAccessCachesByBoard({
        boardId: boardAccess.board._id.toString()
      })

    return updatedRoles
  }

  static deleteRole = async ({ _id, boardAccess }) => {
    const session = await mongoClientInstance.startSession()

    try {
      await session.withTransaction(async () => {
        const role = await BoardRoleRepo.findOne({
          filter: {
            _id: new ObjectId(_id),
            boardId: boardAccess.board._id.toString()
          },
          options: { session }
        })

        if (!role) throw new NotFoundErrorResponse('Role not found.')

        if (role.isDefault)
          throw new ForbiddenErrorResponse('Default roles cannot be deleted.')

        const existedMembers = await BoardMemberRepo.findMany({
          filter: {
            boardId: boardAccess.board._id.toString(),
            boardRoleId: role._id.toString(),
            status: 'active'
          },
          options: { session }
        })

        if (existedMembers.length > 0)
          throw new ConflictErrorResponse(
            'This role is being used by active members.'
          )

        const deletedRole = await BoardRoleRepo.deleteOne({
          filter: {
            _id: new ObjectId(_id),
            boardId: boardAccess.board._id.toString()
          },
          session
        })

        if (deletedRole.deletedCount === 0)
          throw new ConflictErrorResponse(
            'Role does not exist or has already been deleted.'
          )

        await ActivityLogRepo.createOne({
          data: {
            boardId: boardAccess.board._id.toString(),
            authorId: boardAccess.boardMember._id.toString(),
            authorType: 'boardMember',
            entityType: 'boardRole',
            entityId: role._id.toString(),
            action: 'board.role.delete',
            content: `deleted role "${role.name}"`
          },
          session
        })
      })
    } finally {
      await session.endSession()
    }

    await invalidateBoardAccessCachesByBoard({
      boardId: boardAccess.board._id.toString()
    })

    return {}
  }

  // ============================== MEMBER ==============================
  static fetchBoardMember = async ({ _id, data }) => {
    const boardMember = await BoardMemberRepo.getMembersByBoardId({
      boardId: _id,
      data
    })

    return boardMember
  }

  static updateMemberRole = async ({ _id, boardAccess, data }) => {
    const session = await mongoClientInstance.startSession()
    let targetWorkspaceMemberId = null

    try {
      const updatedMember = await session.withTransaction(async () => {
        const memberId = new ObjectId(_id)
        const newRoleId = new ObjectId(data.roleId)

        const member = await BoardMemberRepo.findOne({
          filter: {
            _id: memberId,
            boardId: boardAccess.board._id.toString()
          },
          options: { session }
        })

        if (!member) throw new NotFoundErrorResponse('Member not found.')

        if (member.status !== 'active')
          throw new ConflictErrorResponse(
            'This action can only be performed on an active member.'
          )

        targetWorkspaceMemberId = member.workspaceMemberId.toString()

        const [newRole, currentRole] = await Promise.all([
          BoardRoleRepo.findOne({
            filter: {
              _id: newRoleId,
              boardId: boardAccess.board._id.toString()
            },
            options: { session }
          }),
          BoardRoleRepo.findOne({
            filter: {
              _id: new ObjectId(member.boardRoleId),
              boardId: boardAccess.board._id.toString()
            },
            options: { session }
          })
        ])

        if (!newRole) throw new NotFoundErrorResponse('New role not found.')

        if (member.boardRoleId.toString() === newRole._id.toString())
          throw new ConflictErrorResponse('Member already has this role.')

        const isCurrentAdmin = currentRole?.key === 'board_admin'
        const isNewRoleAdmin = newRole.key === 'board_admin'

        if (currentRole && isCurrentAdmin && !isNewRoleAdmin) {
          await ensureBoardHasAtLeastOneAdmin({
            member,
            adminRole: currentRole,
            session
          })
        }

        const updatedMember = await BoardMemberRepo.updateOne({
          filter: {
            _id: memberId,
            boardId: boardAccess.board._id.toString()
          },
          data: {
            $set: {
              boardRoleId: newRole._id.toString(),
              updatedAt: new Date()
            }
          },
          session
        })

        await ActivityLogRepo.createOne({
          data: {
            boardId: boardAccess.board._id.toString(),
            authorId: boardAccess.boardMember._id.toString(),
            authorType: 'boardMember',
            entityType: 'board',
            entityId: boardAccess.board._id.toString(),
            action: 'board.member.changeRole',
            content: currentRole
              ? `changed a member's role from "${currentRole.name}" to "${newRole.name}"`
              : `changed a member's role to "${newRole.name}"`
          },
          session
        })

        return updatedMember
      })

      if (targetWorkspaceMemberId) {
        const workspaceMember = await WorkspaceMemberRepo.findOne({
          filter: { _id: new ObjectId(targetWorkspaceMemberId) }
        })

        if (workspaceMember?.userId)
          await invalidateBoardAccessCache({
            boardId: boardAccess.board._id.toString(),
            userId: workspaceMember.userId.toString()
          })
      }

      return updatedMember
    } finally {
      await session.endSession()
    }
  }

  static removeMember = async ({ _id, boardAccess }) => {
    return await this.updateBoardMemberStatus({
      _id,
      boardAccess,
      action: 'removed'
    })
  }

  static leaveBoard = async ({ _id, boardAccess }) => {
    return await this.updateBoardMemberStatus({
      _id,
      boardAccess,
      action: 'left'
    })
  }

  static updateBoardMemberStatus = async ({ _id, boardAccess, action }) => {
    const allowedActions = ['removed', 'left']

    if (!allowedActions.includes(action)) {
      throw new BadRequestErrorResponse('Invalid action.')
    }

    const session = await mongoClientInstance.startSession()
    let targetWorkspaceMemberId = null
    let targetBoardId = null

    try {
      const updatedMember = await session.withTransaction(async () => {
        const member = await BoardMemberRepo.findOne({
          filter: {
            _id: new ObjectId(_id),
            boardId: boardAccess.board._id.toString()
          },
          options: { session }
        })

        if (!member) {
          throw new NotFoundErrorResponse('Member not found.')
        }

        const actorBoardMember = boardAccess.boardMember
        const isSelfAction =
          member._id.toString() === actorBoardMember._id.toString()

        if (member.status !== 'active') {
          throw new ConflictErrorResponse(
            'This action can only be performed on an active member.'
          )
        }

        if (action === 'left' && !isSelfAction) {
          throw new ForbiddenErrorResponse(
            'You cannot leave this board for another member.'
          )
        }

        if (action === 'removed' && isSelfAction) {
          throw new ForbiddenErrorResponse(
            'You cannot remove yourself from this board.'
          )
        }

        const workspaceMember = await WorkspaceMemberRepo.findOne({
          filter: { _id: new ObjectId(member.workspaceMemberId) },
          options: { session }
        })

        if (!workspaceMember) {
          throw new NotFoundErrorResponse('Workspace member not found.')
        }

        const currentRole = await BoardRoleRepo.findOne({
          filter: {
            _id: new ObjectId(member.boardRoleId),
            boardId: boardAccess.board._id.toString()
          },
          options: { session }
        })

        if (!currentRole) {
          throw new NotFoundErrorResponse('Current role not found.')
        }

        if (currentRole.key === 'board_admin') {
          await ensureBoardHasAtLeastOneAdmin({
            member,
            adminRole: currentRole,
            session
          })
        }

        const updatedMember = await BoardMemberRepo.updateOne({
          filter: {
            _id: new ObjectId(_id),
            boardId: boardAccess.board._id.toString()
          },
          data: {
            $set: {
              status: action,
              updatedAt: new Date()
            }
          },
          session
        })

        await ActivityLogRepo.createOne({
          data: {
            boardId: boardAccess.board._id.toString(),
            authorId: actorBoardMember._id.toString(),
            authorType: 'boardMember',
            entityType: 'board',
            entityId: boardAccess.board._id.toString(),
            action:
              action === 'left' ? 'board.member.leave' : 'board.member.remove',
            content:
              action === 'left'
                ? `left board "${boardAccess.board.title}"`
                : `removed a member from board "${boardAccess.board.title}"`
          },
          session
        })

        targetWorkspaceMemberId = member.workspaceMemberId.toString()
        targetBoardId = member.boardId.toString()

        return updatedMember
      })

      if (targetWorkspaceMemberId && targetBoardId) {
        const workspaceMember = await WorkspaceMemberRepo.findOne({
          filter: { _id: new ObjectId(targetWorkspaceMemberId) }
        })

        if (workspaceMember?.userId) {
          await invalidateBoardAccessCache({
            boardId: targetBoardId,
            userId: workspaceMember.userId.toString()
          })
        }
      }

      return updatedMember
    } finally {
      await session.endSession()
    }
  }

  static delete = async ({ _id, boardAccess }) => {
    const boardId = boardAccess.board._id.toString()
    const fileKeys = new Set()

    if (_id.toString() !== boardId)
      throw new BadRequestErrorResponse(
        'Board id does not match access context.'
      )

    const session = await mongoClientInstance.startSession()

    try {
      const deletedBoard = await session.withTransaction(async () => {
        const board = await BoardRepo.findOne({
          filter: { _id: new ObjectId(boardId), status: 'active' },
          options: { session }
        })

        if (!board) throw new NotFoundErrorResponse('Board not found.')

        const cards = await CardRepo.findMany({
          filter: { boardId },
          options: { projection: { _id: 1 }, session }
        })

        const attachments = await AttachmentRepo.findMany({
          filter: { boardId },
          options: { projection: { fileKey: 1, fileSize: 1 }, session }
        })

        const backgrounds = await BackgroundRepo.findMany({
          filter: { entity: 'board', type: 'board', boardId },
          options: { projection: { image: 1 }, session }
        })

        const cardIds = cards.map((card) => card._id.toString())
        const attachmentSize = attachments.reduce(
          (sum, item) => sum + (item.fileSize || 0),
          0
        )

        attachments
          .map((item) => item.fileKey)
          .filter(Boolean)
          .forEach((key) => fileKeys.add(key))

        backgrounds
          .map((item) => S3Provider.getKeyFromUrl(item.image))
          .filter(Boolean)
          .forEach((key) => fileKeys.add(key))

        if (cardIds.length) {
          await CommentRepo.deleteMany({
            filter: { cardId: { $in: cardIds } },
            session
          })
          await TaskRepo.deleteMany({
            filter: { cardId: { $in: cardIds } },
            session
          })
        }

        await AttachmentRepo.deleteMany({ filter: { boardId }, session })
        await CardRepo.deleteMany({ filter: { boardId }, session })
        await ColumnRepo.deleteMany({ filter: { boardId }, session })
        await LabelRepo.deleteMany({ filter: { boardId }, session })
        await BoardMemberRepo.deleteManyByBoardId({ boardId, session })
        await BoardRoleRepo.deleteManyByBoardId({ boardId, session })
        await InvitationRepo.deleteMany({
          filter: { entity: 'board', entityId: boardId },
          session
        })
        await BackgroundRepo.deleteMany({
          filter: { entity: 'board', type: 'board', boardId },
          session
        })
        await ActivityLogRepo.deleteMany({ filter: { boardId }, session })

        if (attachmentSize > 0) {
          await WorkspaceRepo.updateOne({
            filter: { _id: new ObjectId(board.workspaceId) },
            data: {
              $inc: { storageUsed: -attachmentSize },
              $set: { updatedAt: new Date() }
            },
            session
          })
        }

        return await BoardRepo.deleteById({
          _id: boardId,
          options: { session }
        })
      })

      await invalidateBoardAccessCachesByBoard({ boardId })

      if (fileKeys.size) await S3Provider.deleteMany([...fileKeys])

      return deletedBoard
    } finally {
      await session.endSession()
    }
  }

  static createBackground = async ({ boardAccess, file }) => {
    if (!file)
      throw new BadRequestErrorResponse('Background image is required.')

    const session = await mongoClientInstance.startSession()
    let upload = null

    try {
      upload = await S3Provider.upload(file)

      const background = await session.withTransaction(async () => {
        const boardId = boardAccess.board._id.toString()
        const board = await BoardRepo.findOne({
          filter: { _id: new ObjectId(boardId), status: 'active' },
          options: { session }
        })

        if (!board) throw new NotFoundErrorResponse('Board Not Found')

        const newBackground = {
          entity: 'board',
          title: board.title,
          image: S3Provider.getUrl(upload.fileKey),
          status: 'active',
          type: 'board',
          boardId,
          isDelete: false
        }

        const createdBackground = await BackgroundRepo.createOne({
          data: newBackground,
          session
        })

        return await BackgroundRepo.findOne({
          filter: { _id: createdBackground.insertedId },
          options: { session }
        })
      })

      return background
    } catch (error) {
      if (upload?.fileKey) await S3Provider.delete(upload.fileKey)
      throw error
    } finally {
      await session.endSession()
    }
  }

  static deleteBackground = async ({ boardAccess, backgroundId }) => {
    const session = await mongoClientInstance.startSession()
    let fileKey = null

    try {
      const boardUpdated = await session.withTransaction(async () => {
        const boardId = boardAccess.board._id.toString()
        const board = await BoardRepo.findOne({
          filter: { _id: new ObjectId(boardId), status: 'active' },
          options: { session }
        })

        if (!board) throw new NotFoundErrorResponse('Board Not Found')

        const background = await BackgroundRepo.findOne({
          filter: {
            _id: new ObjectId(backgroundId),
            entity: 'board',
            type: 'board',
            boardId
          },
          options: { session }
        })

        if (!background) throw new NotFoundErrorResponse('Background Not Found')

        fileKey = S3Provider.getKeyFromUrl(background.image)

        await BackgroundRepo.deleteById({
          _id: backgroundId,
          session
        })

        return await BoardRepo.updateById({
          _id: boardId,
          data: {
            cover: {
              type: 'color',
              value: 'blue'
            },
            updatedAt: new Date()
          },
          options: { session }
        })
      })

      if (fileKey) await S3Provider.delete(fileKey)

      return boardUpdated
    } finally {
      await session.endSession()
    }
  }

  static _normalizeBoardPermissionCodes = (permissionCodes = []) => {
    if (!Array.isArray(permissionCodes))
      throw new BadRequestErrorResponse('Permission codes must be an array.')

    const uniqueCodes = [...new Set(permissionCodes)]
    const validCodes = Object.values(BOARD_PERMISSIONS)
    const invalidCodes = uniqueCodes.filter(
      (code) => !validCodes.includes(code)
    )

    if (invalidCodes.length > 0)
      throw new BadRequestErrorResponse(
        `Invalid board permission codes: ${invalidCodes.join(', ')}`
      )

    if (!uniqueCodes.includes(BOARD_PERMISSIONS.VIEW))
      return [BOARD_PERMISSIONS.VIEW, ...uniqueCodes]

    return uniqueCodes
  }
}

const sameStringSet = (left = [], right = []) => {
  if (left.length !== right.length) return false

  const rightSet = new Set(right)
  return left.every((item) => rightSet.has(item))
}

const ensureBoardHasAtLeastOneAdmin = async ({
  member,
  adminRole,
  session
}) => {
  const totalAdmins = await BoardMemberRepo.countDocuments({
    filter: {
      boardId: member.boardId,
      boardRoleId: adminRole._id.toString(),
      status: 'active'
    },
    options: { session }
  })

  if (totalAdmins <= 1)
    throw new ConflictErrorResponse('Board must have at least one admin.')
}

export default BoardService
