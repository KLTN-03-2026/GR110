import { ObjectId } from 'mongodb'
import {
  BadRequestErrorResponse,
  ConflictErrorResponse,
  ForbiddenErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import SubscriptionRepo from '~/repo/subscription.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import WorkspaceMemberRepo from '~/repo/workspaceMember.repo'
import WorkspacePermissionRepo from '~/repo/workspacePermission.repo'
import WorkspaceRoleRepo from '~/repo/workspaceRole.repo'
import { mongoClientInstance } from '~/config/mongodb'
import BoardRepo from '~/repo/board.repo'
import BoardMemberRepo from '~/repo/boardMember.repo'
import BoardRoleRepo from '~/repo/boardRole.repo'
import ColumnRepo from '~/repo/column.repo'
import CardRepo from '~/repo/card.repo'
import LabelRepo from '~/repo/label.repo'
import CommentRepo from '~/repo/comment.repo'
import AttachmentRepo from '~/repo/attachment.repo'
import TaskRepo from '~/repo/task.repo'
import ActivityLogRepo from '~/repo/activityLog.repo'
import InvitationRepo from '~/repo/invitation.repo'
import { getActiveSubscriptionCached } from '~/helpers/subscription.cache'
import PlanRepo from '~/repo/adminPlan.repo'
import { WORKSPACE_PERMISSIONS } from '~/constant/workspacePermission.constant'
import {
  invalidateWorkspaceAccessCache,
  invalidateWorkspaceAccessCachesByWorkspace
} from '~/helpers/workspacePermission.cache'
import {
  invalidateBoardAccessCachesByBoard,
  invalidateBoardAccessCachesByUser
} from '~/helpers/boardPermission.cache'
import S3Provider from '~/providers/S3Provider'
import BackgroundRepo from '~/repo/adminBackground.repo'
import Joi from 'joi'
import { invokeOpenAIModel } from '~/providers/OpenAIProvider'

const generateWorkspaceAdminRole = ({ workspaceId }) => {
  return {
    workspaceId: workspaceId.toString(),
    name: 'Admin',
    isDefault: true,
    key: 'workspace_admin',
    permissionCodes: [
      'workspace.view',
      'workspace.update',
      'workspace.delete',
      'workspace.member.invite',
      'workspace.member.remove',
      'workspace.member.changeRole',
      'workspace.role.create',
      'workspace.role.update',
      'workspace.role.delete',
      'workspace.board.create',
      'workspace.board.delete'
    ]
  }
}

const generateWorkspaceViewerRole = ({ workspaceId }) => {
  return {
    workspaceId: workspaceId.toString(),
    name: 'Viewer',
    isDefault: true,
    key: 'workspace_viewer',
    permissionCodes: ['workspace.view']
  }
}

const buildWorkspaceSummaryPrompt = (workspaceName, boards) => `
You are a project management analyst for TaskIO, a Trello-like task management app.

Workspace: "${workspaceName}"

Boards:
${boards
  .map(
    (b, i) =>
      `${i + 1}. ${b.title} — ${b.cardCount} cards, ${b.tasksDone}/${b.tasksTotal} tasks done, ${b.overdueCards} overdue cards, ${b.overdueTasksCount} overdue tasks, ${b.undocumentedCards} undocumented`
  )
  .join('\n')}

Write a detailed workspace summary in English using exactly these sections:

## Overview
2–3 sentences. Describe what this workspace is about based on the board titles, the overall scale (number of boards and cards), and the general state of work.

## Progress
Break down task completion per board and overall. Include done/total counts and percentages. Highlight boards that are ahead or behind.

## Overdue Cards
List boards that have overdue cards with their counts. If none, write "No overdue cards."

## Key Insights
3–5 bullet points covering notable patterns, risks, or opportunities. Examples: boards with low documentation, high overdue rates, stalled progress, or boards close to completion.

## Suggestions
3 concrete, actionable recommendations based on the data to help the team improve.

Rules:
- ~300 words total
- No emojis or icons
- Do not invent data not present in the input
- Professional, concise tone suitable for a team lead
`

const WORKSPACE_SUMMARY_SCHEMA = Joi.object({
  summary: Joi.string().required(),
  insights: Joi.array().items(Joi.string()).required(),
  risks: Joi.array().items(Joi.string()).required(),
  suggestions: Joi.array().items(Joi.string()).required()
})

class WorkspaceService {
  static fetchWorkspacePermission = async () => {
    const workspacePermissions = await WorkspacePermissionRepo.findMany({
      options: { projection: { _id: 1, permissionCode: 1, description: 1 } }
    })

    return workspacePermissions
  }

  static fetchByUser = async ({ userContext }) => {
    const workspaces = await WorkspaceRepo.fetchByUser({
      userId: userContext._id
    })

    if (!workspaces || !workspaces.length) return []

    return workspaces
  }

  static fetchWorkspaceInfo = async ({ _id }) => {
    const workspace = await WorkspaceRepo.findOne({
      filter: { _id: new ObjectId(_id) }
    })

    if (!workspace) throw new NotFoundErrorResponse('Workspace not found.')

    return workspace
  }

  static fetchWorkspaceMember = async ({ _id, data }) => {
    const keyword = data?.search?.trim() || ''
    const page = Number(data?.page || 1)
    const limit = 7
    const skip = (page - 1) * limit

    const filter = {
      workspaceId: _id
    }

    const [workspaceMember, totalCount] = await Promise.all([
      WorkspaceMemberRepo.findManyWithPagination({
        filter,
        data: {
          search: keyword
        },
        options: {
          skip,
          limit,
          sort: { createdAt: -1 }
        }
      }),
      WorkspaceMemberRepo.countDocumentsWithSearch({
        filter,
        data: {
          search: keyword
        }
      })
    ])

    return {
      workspaceMember,
      totalCount,
      page,
      limit
    }
  }

  static fetchWorkspaceRole = async ({ _id }) => {
    const workspaceRoles = await WorkspaceRoleRepo.findMany({
      filter: { workspaceId: _id.toString() },
      options: {
        projection: { key: 0, createdAt: 0, updatedAt: 0, workspaceId: 0 }
      }
    })

    return workspaceRoles
  }

  static create = async ({ userContext, data, session = null }) => {
    let createdWorkspaceId = null
    const execute = async (session) => {
      const createWorkspaceData = {
        createdBy: userContext._id.toString(),
        ...data
      }

      const createdWorkspace = await WorkspaceRepo.createOne({
        data: createWorkspaceData,
        session
      })

      createdWorkspaceId = createdWorkspace.insertedId

      const createdWorkspaceAdminRole = await WorkspaceRoleRepo.createOne({
        data: generateWorkspaceAdminRole({
          workspaceId: createdWorkspace.insertedId
        }),
        session
      })

      await WorkspaceRoleRepo.createOne({
        data: generateWorkspaceViewerRole({
          workspaceId: createdWorkspace.insertedId
        }),
        session
      })

      const createMemberData = {
        workspaceId: createdWorkspace.insertedId.toString(),
        workspaceRoleId: createdWorkspaceAdminRole.insertedId.toString(),
        invitedBy: null,
        userId: userContext._id.toString(),
        joinAt: Date.now()
      }

      await WorkspaceMemberRepo.createOne({
        data: createMemberData,
        session
      })

      const plan = await PlanRepo.findOne({
        filter: {
          _id: new ObjectId('69dc9cc2454ef403fb52c8ba'),
          isDeleted: false
        },
        options: { session }
      })

      if (!plan) throw new NotFoundErrorResponse('Default Free plan not found')

      await SubscriptionRepo.createOne({
        data: {
          workspaceId: createdWorkspace.insertedId.toString(),
          planId: plan._id.toString(),
          planFeatureSnapshot: plan.feature,
          status: 'active',
          startedAt: Date.now()
        },
        session
      })
    }

    if (session) {
      await execute(session)
    } else {
      const newSession = await mongoClientInstance.startSession()
      try {
        await newSession.withTransaction(() => execute(newSession))
      } finally {
        await newSession.endSession()
      }
    }

    return await WorkspaceRepo.findOne({
      filter: { _id: new ObjectId(createdWorkspaceId) },
      options: { projection: { _id: 1, title: 1 } }
    })
  }

  static update = async ({ _id, data }) => {
    const workspaceId = new ObjectId(_id)

    const allowedFields = ['title', 'description']

    const updateData = {}

    for (const field of allowedFields) {
      if (field in data) {
        updateData[field] = data[field]
      }
    }

    if (Object.keys(updateData).length === 0)
      throw new BadRequestErrorResponse('No valid fields provided for update.')

    const updatedWorkspace = await WorkspaceRepo.updateOne({
      filter: { _id: workspaceId, status: 'active' },
      data: { $set: { ...updateData, updatedAt: Date.now() } },
      projection: { _id: 1, title: 1, description: 1 }
    })

    if (!updatedWorkspace)
      throw new NotFoundErrorResponse('Workspace not found')

    await invalidateWorkspaceAccessCachesByWorkspace({ workspaceId: _id })

    return updatedWorkspace
  }

  static delete = async ({ _id }) => {
    const session = await mongoClientInstance.startSession()
    const workspaceId = _id.toString()
    let deletedBoardIds = []
    let fileKeys = new Set()

    try {
      await session.withTransaction(async () => {
        const workspace = await WorkspaceRepo.findOne({
          filter: { _id: new ObjectId(workspaceId) },
          options: { session }
        })

        if (!workspace) throw new NotFoundErrorResponse('Workspace not found.')

        const boards = await BoardRepo.findMany({
          filter: { workspaceId },
          options: { projection: { _id: 1 }, session }
        })

        deletedBoardIds = boards.map((board) => board._id.toString())

        const backgrounds = await BackgroundRepo.findMany({
          filter: {
            entity: 'board',
            type: 'board',
            boardId: { $in: deletedBoardIds }
          },
          options: { projection: { image: 1 }, session }
        })

        backgrounds
          ?.map((item) => S3Provider.getKeyFromUrl(item.image))
          .filter(Boolean)
          .forEach((key) => fileKeys.add(key))

        if (deletedBoardIds.length > 0) {
          const cards = await CardRepo.findMany({
            filter: { boardId: { $in: deletedBoardIds } },
            options: { projection: { _id: 1 }, session }
          })

          const cardIds = cards.map((card) => card._id.toString())

          if (cardIds.length > 0) {
            const attachments = await AttachmentRepo.findMany({
              filter: { boardId: { $in: deletedBoardIds } },
              options: { projection: { fileKey: 1 }, session }
            })

            attachments
              ?.map((item) => item.fileKey)
              .filter(Boolean)
              .forEach((key) => fileKeys.add(key))

            await CommentRepo.deleteMany({
              filter: { cardId: { $in: cardIds } },
              session
            })
            await AttachmentRepo.deleteMany({
              filter: { boardId: { $in: deletedBoardIds } },
              session
            })
            await TaskRepo.deleteMany({
              filter: { cardId: { $in: cardIds } },
              session
            })
          }

          await CardRepo.deleteMany({
            filter: { boardId: { $in: deletedBoardIds } },
            session
          })
          await ColumnRepo.deleteMany({
            filter: { boardId: { $in: deletedBoardIds } },
            session
          })
          await LabelRepo.deleteMany({
            filter: { boardId: { $in: deletedBoardIds } },
            session
          })
          await ActivityLogRepo.deleteMany({
            filter: { boardId: { $in: deletedBoardIds } },
            session
          })
          await BoardMemberRepo.deleteMany({
            filter: { boardId: { $in: deletedBoardIds } },
            session
          })
          await BoardRoleRepo.deleteMany({
            filter: { boardId: { $in: deletedBoardIds } },
            session
          })
          await InvitationRepo.deleteMany({
            filter: {
              entity: 'board',
              entityId: { $in: deletedBoardIds }
            },
            session
          })
          await BoardRepo.deleteMany({
            filter: { workspaceId },
            session
          })
          await BackgroundRepo.deleteMany({
            filter: {
              entity: 'board',
              type: 'board',
              boardId: { $in: deletedBoardIds }
            },
            session
          })
        }

        await WorkspaceRoleRepo.deleteMany({
          filter: { workspaceId },
          session
        })
        await WorkspaceMemberRepo.deleteMany({
          filter: { workspaceId },
          session
        })
        await SubscriptionRepo.deleteMany({
          filter: { workspaceId },
          session
        })
        await InvitationRepo.deleteMany({
          filter: { entity: 'workspace', entityId: workspaceId },
          session
        })

        const deletedWorkspace = await WorkspaceRepo.deleteOne({
          filter: { _id: new ObjectId(workspaceId) },
          session
        })

        if (deletedWorkspace.deletedCount === 0)
          throw new NotFoundErrorResponse('Workspace not found.')
      })
    } finally {
      await session.endSession()
    }

    await Promise.all([
      invalidateWorkspaceAccessCachesByWorkspace({ workspaceId }),
      ...deletedBoardIds.map((boardId) =>
        invalidateBoardAccessCachesByBoard({ boardId })
      )
    ])

    if (fileKeys.size > 0) await S3Provider.deleteMany([...fileKeys])

    return { message: 'Workspace deleted successfully.' }
  }

  static createRole = async ({ workspaceAccess, data }) => {
    const subscription = await getActiveSubscriptionCached({
      workspaceId: workspaceAccess.workspace._id
    })

    if (!subscription)
      throw new NotFoundErrorResponse(
        'Subscription not found for this workspace.'
      )

    const features = subscription.planFeatureSnapshot

    if (!features?.capabilities?.workspace?.customRole)
      throw new ForbiddenErrorResponse(
        'Your current subscription plan does not allow creating custom roles.'
      )

    const countRoles = await WorkspaceRoleRepo.count({
      filter: {
        workspaceId: workspaceAccess.workspace._id.toString(),
        isDefault: false
      }
    })

    if (countRoles >= features?.limits?.maxWorkspaceRoles)
      throw new ForbiddenErrorResponse(
        `Your current subscription plan allows a maximum of ${features.limits.maxWorkspaceRoles} custom roles.`
      )

    let permissionCodes = data.permissionCodes || []
    if (!Array.isArray(permissionCodes)) {
      throw new BadRequestErrorResponse('Permission codes must be an array.')
    }

    if (permissionCodes.length > 0) {
      this._validatePermissionCodes(permissionCodes)
    }

    if (!permissionCodes.includes(WORKSPACE_PERMISSIONS.VIEW)) {
      permissionCodes = [WORKSPACE_PERMISSIONS.VIEW, ...permissionCodes]
    }

    const createdRole = await WorkspaceRoleRepo.createOne({
      data: {
        ...data,
        permissionCodes,
        workspaceId: workspaceAccess.workspace._id.toString(),
        isDefault: false
      }
    })

    const role = await WorkspaceRoleRepo.findOne({
      filter: { _id: new ObjectId(createdRole.insertedId) },
      options: {
        projection: { key: 0, createdAt: 0, updatedAt: 0, workspaceId: 0 }
      }
    })

    return role
  }

  static updateRole = async ({ workspaceId, data }) => {
    if (!Array.isArray(data) || data.length === 0)
      throw new BadRequestErrorResponse('Role update data is required.')

    const results = []
    const session = await mongoClientInstance.startSession()

    try {
      await session.withTransaction(async () => {
        for (const role of data) {
          const {
            _id,
            key, // eslint-disable-line no-unused-vars
            isDefault, // eslint-disable-line no-unused-vars
            workspaceId: _workspaceId, // eslint-disable-line no-unused-vars
            ...rest
          } = role

          if (!_id) throw new BadRequestErrorResponse('Role id is required.')

          if (Object.keys(rest).length === 0)
            throw new BadRequestErrorResponse(
              'At least one role field must be provided for update.'
            )

          const currentRole = await WorkspaceRoleRepo.findOne({
            filter: {
              _id: new ObjectId(_id),
              workspaceId
            },
            options: { session }
          })

          if (!currentRole) throw new NotFoundErrorResponse('Role not found.')

          if (currentRole.isDefault)
            throw new ForbiddenErrorResponse('Default roles cannot be updated.')

          if (rest.permissionCodes) {
            this._validatePermissionCodes(rest.permissionCodes)
            if (!rest.permissionCodes.includes(WORKSPACE_PERMISSIONS.VIEW)) {
              rest.permissionCodes = [
                WORKSPACE_PERMISSIONS.VIEW,
                ...rest.permissionCodes
              ]
            }
          }

          const updatedRole = await WorkspaceRoleRepo.updateOne({
            filter: {
              _id: new ObjectId(_id),
              workspaceId,
              isDefault: false
            },
            data: { $set: { ...rest, updatedAt: Date.now() } },
            session
          })

          results.push(updatedRole)
        }
      })
    } finally {
      await session.endSession()
    }

    await invalidateWorkspaceAccessCachesByWorkspace({ workspaceId })

    return results
  }

  static deleteRole = async ({ _id, workspaceId }) => {
    const roleId = new ObjectId(_id)

    const role = await WorkspaceRoleRepo.findOne({
      filter: { _id: roleId, workspaceId }
    })

    if (!role) throw new NotFoundErrorResponse('Role not found.')

    if (role.isDefault)
      throw new ForbiddenErrorResponse('Default roles cannot be deleted.')

    const memberUsingRole = await WorkspaceMemberRepo.findOne({
      filter: {
        workspaceId,
        workspaceRoleId: role._id.toString(),
        status: 'active'
      }
    })

    if (memberUsingRole)
      throw new ConflictErrorResponse(
        'Cannot delete this role because it is currently assigned to active members.'
      )

    const deletedRole = await WorkspaceRoleRepo.deleteOne({
      filter: { _id: roleId, workspaceId, isDefault: false }
    })

    if (deletedRole.deletedCount === 0)
      throw new ConflictErrorResponse(
        'Role does not exist or has already been deleted.'
      )

    return {}
  }

  static updateMemberRole = async ({ _id, workspaceId, data }) => {
    const memberId = new ObjectId(_id)
    const newRoleId = new ObjectId(data.roleId)
    const session = await mongoClientInstance.startSession()
    let updatedMember = null
    let targetUserId = null

    try {
      updatedMember = await session.withTransaction(async () => {
        const member = await WorkspaceMemberRepo.findOne({
          filter: { _id: memberId, workspaceId },
          options: { session }
        })

        if (!member) throw new NotFoundErrorResponse('Member not found.')

        if (member.status !== 'active')
          throw new ConflictErrorResponse(
            'This action can only be performed on an active member.'
          )

        targetUserId = member.userId.toString()

        if (member.workspaceRoleId.toString() === newRoleId.toString())
          throw new ConflictErrorResponse('Member already has this role.')

        const newRole = await WorkspaceRoleRepo.findOne({
          filter: { _id: newRoleId, workspaceId: member.workspaceId },
          options: { session }
        })

        const currentRole = await WorkspaceRoleRepo.findOne({
          filter: {
            _id: new ObjectId(member.workspaceRoleId),
            workspaceId: member.workspaceId
          },
          options: { session }
        })

        if (!newRole) throw new NotFoundErrorResponse('New role not found.')
        if (!currentRole)
          throw new NotFoundErrorResponse('Current role not found.')

        const isCurrentAdmin = currentRole?.key === 'workspace_admin'
        const isNewRoleAdmin = newRole?.key === 'workspace_admin'

        if (isCurrentAdmin && !isNewRoleAdmin)
          await ensureWorkspaceHasAtLeastOneAdmin({
            member,
            adminRole: currentRole,
            session
          })

        return await WorkspaceMemberRepo.updateOne({
          filter: { _id: memberId, workspaceId, status: 'active' },
          data: {
            $set: {
              workspaceRoleId: newRole._id.toString(),
              updatedAt: Date.now()
            }
          },
          session
        })
      })
    } finally {
      await session.endSession()
    }

    if (targetUserId)
      await invalidateWorkspaceAccessCache({
        workspaceId,
        userId: targetUserId
      })

    return updatedMember
  }

  static removeMember = async ({ _id, workspaceId, userContext }) => {
    return await this.updateWorkspaceMemberStatus({
      _id,
      userContext,
      workspaceId,
      action: 'removed'
    })
  }

  static leaveWorkspace = async ({ _id, userContext }) => {
    return await this.updateWorkspaceMemberStatus({
      _id,
      userContext,
      action: 'left'
    })
  }

  static updateWorkspaceMemberStatus = async ({
    _id,
    workspaceId,
    userContext,
    action
  }) => {
    const allowedActions = ['removed', 'left']

    if (!allowedActions.includes(action))
      throw new BadRequestErrorResponse('Invalid action.')

    const memberId = new ObjectId(_id)

    const memberFilter = {
      _id: memberId,
      status: 'active'
    }

    if (action === 'removed') {
      memberFilter.workspaceId = workspaceId
    }

    const session = await mongoClientInstance.startSession()
    let updatedMember = null
    let targetUserId = null
    let targetWorkspaceId = null

    try {
      updatedMember = await session.withTransaction(async () => {
        const member = await WorkspaceMemberRepo.findOne({
          filter: memberFilter,
          options: { session }
        })

        if (!member) throw new NotFoundErrorResponse('Member not found.')

        targetUserId = member.userId.toString()
        targetWorkspaceId = member.workspaceId.toString()

        if (
          action === 'removed' &&
          member.userId.toString() === userContext._id.toString()
        )
          throw new ConflictErrorResponse('Please use leave workspace instead.')

        if (
          action === 'left' &&
          member.userId.toString() !== userContext._id.toString()
        )
          throw new ForbiddenErrorResponse(
            'You cannot leave this workspace for another member.'
          )

        const currentRole = await WorkspaceRoleRepo.findOne({
          filter: {
            _id: new ObjectId(member.workspaceRoleId),
            workspaceId: member.workspaceId
          },
          options: { session }
        })

        if (!currentRole)
          throw new NotFoundErrorResponse('Current role not found.')

        if (currentRole.key === 'workspace_admin')
          await ensureWorkspaceHasAtLeastOneAdmin({
            member,
            adminRole: currentRole,
            session
          })

        await BoardMemberRepo.updateMany({
          filter: {
            workspaceMemberId: member._id.toString(),
            status: 'active'
          },
          data: {
            $set: {
              status: 'removed',
              updatedAt: Date.now()
            }
          },
          session
        })

        return await WorkspaceMemberRepo.updateOne({
          filter: {
            _id: memberId,
            workspaceId: member.workspaceId,
            status: 'active'
          },
          data: {
            $set: {
              status: action,
              updatedAt: Date.now()
            }
          },
          session
        })
      })
    } finally {
      await session.endSession()
    }

    if (targetWorkspaceId && targetUserId) {
      await invalidateWorkspaceAccessCache({
        workspaceId: targetWorkspaceId,
        userId: targetUserId
      })
      await invalidateBoardAccessCachesByUser({
        userId: targetUserId
      })
    }

    return updatedMember
  }

  static summarize = async ({ workspaceAccess, workspaceId }) => {
    const boards = await BoardRepo.findMany({ filter: { workspaceId } })

    const signals = await Promise.all(
      boards.map(async (board) => {
        const boardId = board._id.toString()

        const [columnCount, cards, taskAgg, overdueCards, overdueTasksCount] =
          await Promise.all([
            ColumnRepo.count({ filter: { boardId } }),
            CardRepo.findMany({
              filter: { boardId, status: 'active' },
              options: { limit: 50 }
            }),
            TaskRepo.aggregateTaskStats([
              { $match: { boardId } },
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  done: { $sum: { $cond: ['$isCompleted', 1, 0] } }
                }
              }
            ]),
            CardRepo.count({
              filter: { boardId, dueAt: { $lt: new Date() }, status: 'active' }
            }),
            TaskRepo.count({
              filter: {
                boardId,
                dueAt: { $lt: new Date() },
                isCompleted: false
              }
            })
          ])

        const cardCount = cards.length
        const describedCards = cards.filter((c) => c.isHasDescription).length

        return {
          title: board.title,
          columnCount,
          cardCount,
          describedCards,
          undocumentedCards: cardCount - describedCards,
          tasksDone: taskAgg[0]?.done || 0,
          tasksTotal: taskAgg[0]?.total || 0,
          overdueCards,
          overdueTasksCount,
          sampleCards: cards.slice(0, 5).map((c) => c.title)
        }
      })
    )

    const prompt = buildWorkspaceSummaryPrompt(
      workspaceAccess.workspace.title,
      signals
    )

    return invokeOpenAIModel({ prompt, json: false })
  }

  static fetchPlans = async ({ workspaceId }) => {
    const plans = await WorkspaceRepo.fetchByPlan(workspaceId)
    return plans
  }

  static buildQuota = ({
    key,
    label,
    used = 0,
    limit = 0,
    unit = '',
    mode = 'workspace'
  }) => {
    const safeUsed = Number(used || 0)
    const safeLimit = Number(limit || 0)
    const percent =
      safeLimit > 0
        ? Number(Math.min((safeUsed / safeLimit) * 100, 100).toFixed(2))
        : 0

    return {
      key,
      label,
      mode,
      used: safeUsed,
      limit: safeLimit,
      remaining: Math.max(safeLimit - safeUsed, 0),
      percent,
      unit
    }
  }

  static fetchQuota = async ({ workspaceId, userContext }) => {
    if (!workspaceId || !ObjectId.isValid(workspaceId)) {
      throw new BadRequestErrorResponse('Invalid workspace id')
    }

    const workspace = await WorkspaceRepo.findOne({
      filter: {
        _id: new ObjectId(workspaceId)
      }
    })

    if (!workspace) {
      throw new NotFoundErrorResponse('Workspace not found')
    }

    const workspaceMember = await WorkspaceMemberRepo.findOne({
      filter: {
        workspaceId: workspaceId,
        userId: userContext._id
      }
    })

    if (!workspaceMember) {
      throw new ForbiddenErrorResponse(
        'You do not have access to this workspace'
      )
    }

    let subscription = await SubscriptionRepo.findOne({
      filter: {
        workspaceId: workspaceId,
        status: 'active'
      }
    })

    let planFeatureSnapshot = subscription?.planFeatureSnapshot

    if (!subscription) {
      const freePlan = await PlanRepo.findOne({
        filter: {
          _id: new ObjectId('69dc9cc2454ef403fb52c8ba'),
          isDeleted: false,
          status: 'active'
        }
      })

      if (!freePlan)
        throw new NotFoundErrorResponse('Default Free plan not found')

      planFeatureSnapshot = freePlan.feature
      subscription = {
        _id: null,
        workspaceId,
        planId: freePlan._id.toString(),
        status: 'free',
        startedAt: null,
        endedAt: null,
        planFeatureSnapshot
      }
    }

    const limits = planFeatureSnapshot?.limits || {}

    const workspaceBoards = await BoardRepo.findMany({
      filter: { workspaceId, status: 'active' },
      options: { projection: { _id: 1, title: 1 } }
    })

    const boardIds = workspaceBoards.map((board) => board._id.toString())

    const countByField = (items, field) => {
      return items.reduce((acc, item) => {
        const value = item?.[field]?.toString()
        if (!value) return acc

        acc[value] = (acc[value] || 0) + 1
        return acc
      }, {})
    }

    const [
      membersUsed,
      workspaceRolesUsed,
      storageUsedBytes,
      boardRoles,
      columns,
      cards
    ] = await Promise.all([
      WorkspaceMemberRepo.countDocuments({
        filter: { workspaceId, status: 'active' }
      }),

      WorkspaceRoleRepo.count({
        filter: { workspaceId, isDefault: false }
      }),

      AttachmentRepo.sumFileSizeByWorkspaceId({
        workspaceId
      }),

      boardIds.length
        ? BoardRoleRepo.findMany({
            filter: { boardId: { $in: boardIds }, isDefault: false },
            options: { projection: { boardId: 1 } }
          })
        : [],

      boardIds.length
        ? ColumnRepo.findMany({
            filter: { boardId: { $in: boardIds } },
            options: { projection: { boardId: 1 } }
          })
        : [],

      boardIds.length
        ? CardRepo.findMany({
            filter: { boardId: { $in: boardIds } },
            options: {
              projection: {
                _id: 1,
                boardId: 1,
                commentCount: 1,
                taskCount: 1
              }
            }
          })
        : []
    ])

    const boardRoleCountByBoard = countByField(boardRoles, 'boardId')
    const columnCountByBoard = countByField(columns, 'boardId')
    const cardCountByBoard = countByField(cards, 'boardId')

    const boardsUsed = boardIds.length

    const boardQuota = workspaceBoards.reduce((acc, board) => {
      const boardId = board._id.toString()

      acc[board.title] = {
        boardRolesUsed: boardRoleCountByBoard[boardId] || 0,
        columnsUsed: columnCountByBoard[boardId] || 0,
        cardsUsed: cardCountByBoard[boardId] || 0
      }

      return acc
    }, {})

    const storageUsedMb = Number(
      ((storageUsedBytes || 0) / 1024 / 1024).toFixed(2)
    )

    return {
      subscription: {
        _id: subscription._id,
        workspaceId: subscription.workspaceId,
        planId: subscription.planId,
        status: subscription.status,
        startedAt: subscription.startedAt,
        endedAt: subscription.endedAt,
        planFeatureSnapshot
      },
      quota: {
        workspace: [
          this.buildQuota({
            key: 'maxMembers',
            label: 'Workspace members',
            used: membersUsed,
            limit: limits.maxMembers,
            mode: 'workspace'
          }),
          this.buildQuota({
            key: 'maxBoards',
            label: 'Boards',
            used: boardsUsed,
            limit: limits.maxBoards,
            mode: 'workspace'
          }),
          this.buildQuota({
            key: 'maxWorkspaceRoles',
            label: 'Workspace roles',
            used: workspaceRolesUsed,
            limit: limits.maxWorkspaceRoles,
            mode: 'workspace'
          }),
          this.buildQuota({
            key: 'maxStorageMb',
            label: 'Storage',
            used: storageUsedMb,
            limit: limits.maxStorageMb,
            unit: 'MB',
            mode: 'workspace'
          })
        ],
        board: boardQuota,
        rules: [
          {
            key: 'maxFileSizeMb',
            label: 'Max file size',
            limit: Number(limits.maxFileSizeMb || 0),
            unit: 'MB',
            mode: 'rule'
          },
          {
            key: 'maxFilesPerUpload',
            label: 'Files per upload',
            limit: Number(limits.maxFilesPerUpload || 0),
            mode: 'rule'
          }
        ]
      }
    }
  }

  static _validatePermissionCodes = (permissionCodes) => {
    const validPermissions = Object.values(WORKSPACE_PERMISSIONS)

    if (!Array.isArray(permissionCodes) || permissionCodes.length === 0) {
      throw new BadRequestErrorResponse(
        'Permission codes must be a non-empty array.'
      )
    }

    const invalidCodes = permissionCodes.filter(
      (code) => !validPermissions.includes(code)
    )

    if (invalidCodes.length > 0) {
      throw new BadRequestErrorResponse(
        `Invalid permission codes: ${invalidCodes.join(', ')}`
      )
    }
  }
}

const ensureWorkspaceHasAtLeastOneAdmin = async ({
  member,
  adminRole,
  session
}) => {
  const anotherAdmin = await WorkspaceMemberRepo.findOne({
    filter: {
      workspaceId: member.workspaceId,
      workspaceRoleId: adminRole._id.toString(),
      status: 'active',
      _id: { $ne: member._id }
    },
    options: { session }
  })

  if (!anotherAdmin)
    throw new ConflictErrorResponse('Workspace must have at least one admin.')
}

export default WorkspaceService
