import { activityLogModel } from '~/models/activityLog.model'
import { backgroundModel } from '~/models/background.model'
import { boardModel } from '~/models/board.model'
import { boardLabelModel } from '~/models/boardLabel.model'
import { boardMemberModel } from '~/models/boardMember.model'
import { boardPermissionModel } from '~/models/boardPermission.model'
import { boardRoleModel } from '~/models/boardRole.model'
import { attachmentModel } from '~/models/cardAttachment.model'
import { cardCommentModel } from '~/models/cardComment.model'
import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import { invitationModel } from '~/models/invitation.model'
import { paymentModel } from '~/models/payment.model'
import { planModel } from '~/models/plan.model'
import { subscriptionModel } from '~/models/subscription.model'
import { taskModel } from '~/models/task.model'
import { ticketModel } from '~/models/ticket.model'
import { transactionModel } from '~/models/transaction.model'
import { userModel } from '~/models/user.model'
import { workspaceMemberModel } from '~/models/workspaceMember.model'
import { workspaceModel } from '~/models/workspace.model'
import { workspacePermissionModel } from '~/models/workspacePermission.model'
import { workspaceRoleModel } from '~/models/workspaceRole.model'

const INDEX_DEFINITIONS = [
  {
    collection: userModel.USER_COLLECTION_NAME,
    indexes: [
      { key: { email: 1 }, name: 'email_1' },
      {
        key: { email: 1, resetPassToken: 1 },
        name: 'email_1_resetPassToken_1'
      },
      { key: { role: 1 }, name: 'role_1' }
    ]
  },
  {
    collection: workspaceModel.WORKSPACE_COLLECTION_NAME,
    indexes: [
      {
        key: { createdBy: 1, status: 1, createdAt: -1 },
        name: 'createdBy_1_status_1_createdAt_-1'
      },
      { key: { status: 1, createdAt: -1 }, name: 'status_1_createdAt_-1' }
    ]
  },
  {
    collection: workspaceRoleModel.WORKSPACE_ROLE_COLLECTION_NAME,
    indexes: [
      { key: { workspaceId: 1 }, name: 'workspaceId_1' },
      {
        key: { workspaceId: 1, isDefault: 1 },
        name: 'workspaceId_1_isDefault_1'
      },
      { key: { workspaceId: 1, key: 1 }, name: 'workspaceId_1_key_1' }
    ]
  },
  {
    collection: workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME,
    indexes: [
      {
        key: { workspaceId: 1, status: 1, createdAt: -1 },
        name: 'workspaceId_1_status_1_createdAt_-1'
      },
      { key: { workspaceId: 1, userId: 1 }, name: 'workspaceId_1_userId_1' },
      { key: { userId: 1, status: 1 }, name: 'userId_1_status_1' }
    ]
  },
  {
    collection: boardModel.BOARD_COLLECTION_NAME,
    indexes: [
      {
        key: { workspaceId: 1, status: 1, createdAt: -1 },
        name: 'workspaceId_1_status_1_createdAt_-1'
      },
      {
        key: { workspaceId: 1, createdAt: -1 },
        name: 'workspaceId_1_createdAt_-1'
      },
      { key: { status: 1, createdAt: -1 }, name: 'status_1_createdAt_-1' },
      { key: { _destroy: 1, title: 1 }, name: '_destroy_1_title_1' },
      { key: { ownerIds: 1 }, name: 'ownerIds_1' },
      { key: { memberIds: 1 }, name: 'memberIds_1' }
    ]
  },
  {
    collection: boardRoleModel.BOARD_ROLE_COLLECTION_NAME,
    indexes: [
      { key: { boardId: 1 }, name: 'boardId_1' },
      { key: { boardId: 1, isDefault: 1 }, name: 'boardId_1_isDefault_1' },
      { key: { boardId: 1, key: 1 }, name: 'boardId_1_key_1' }
    ]
  },
  {
    collection: boardMemberModel.BOARD_MEMBER_COLLECTION_NAME,
    indexes: [
      {
        key: { boardId: 1, status: 1, createdAt: -1 },
        name: 'boardId_1_status_1_createdAt_-1'
      },
      {
        key: { boardId: 1, workspaceMemberId: 1, status: 1 },
        name: 'boardId_1_workspaceMemberId_1_status_1'
      },
      {
        key: { workspaceMemberId: 1, status: 1 },
        name: 'workspaceMemberId_1_status_1'
      }
    ]
  },
  {
    collection: boardLabelModel.BOARD_LABEL_COLLECTION_NAME,
    indexes: [{ key: { boardId: 1 }, name: 'boardId_1' }]
  },
  {
    collection: columnModel.COLUMN_COLLECTION_NAME,
    indexes: [
      {
        key: { boardId: 1, status: 1, createdAt: -1 },
        name: 'boardId_1_status_1_createdAt_-1'
      },
      { key: { boardId: 1 }, name: 'boardId_1' }
    ]
  },
  {
    collection: cardModel.CARD_COLLECTION_NAME,
    indexes: [
      {
        key: { boardId: 1, status: 1, createdAt: -1 },
        name: 'boardId_1_status_1_createdAt_-1'
      },
      {
        key: { columnId: 1, status: 1, createdAt: 1 },
        name: 'columnId_1_status_1_createdAt_1'
      },
      { key: { boardId: 1, columnId: 1 }, name: 'boardId_1_columnId_1' }
    ]
  },
  {
    collection: cardCommentModel.CARD_COMMENT_COLLECTION_NAME,
    indexes: [
      { key: { cardId: 1, createdAt: -1 }, name: 'cardId_1_createdAt_-1' },
      {
        key: { boardMemberId: 1, createdAt: -1 },
        name: 'boardMemberId_1_createdAt_-1'
      }
    ]
  },
  {
    collection: taskModel.TASK_COLLECTION_NAME,
    indexes: [
      {
        key: { cardId: 1, parentTaskId: 1, createdAt: 1 },
        name: 'cardId_1_parentTaskId_1_createdAt_1'
      },
      { key: { parentTaskId: 1 }, name: 'parentTaskId_1' }
    ]
  },
  {
    collection: attachmentModel.CARD_ATTACHMENT_NAME,
    indexes: [
      { key: { cardId: 1, createdAt: -1 }, name: 'cardId_1_createdAt_-1' },
      { key: { boardId: 1 }, name: 'boardId_1' }
    ]
  },
  {
    collection: activityLogModel.ACTIVITY_LOG_COLLECTION_NAME,
    indexes: [
      {
        key: { boardId: 1, createdAt: -1 },
        name: 'boardId_1_createdAt_-1'
      },
      {
        key: { entityType: 1, entityId: 1, createdAt: -1 },
        name: 'entityType_1_entityId_1_createdAt_-1'
      }
    ]
  },
  {
    collection: invitationModel.INVITATION_COLLECTION_NAME,
    indexes: [
      {
        key: { inviteeId: 1, status: 1, createdAt: -1 },
        name: 'inviteeId_1_status_1_createdAt_-1'
      },
      {
        key: { entity: 1, entityId: 1, inviteeId: 1, status: 1 },
        name: 'entity_1_entityId_1_inviteeId_1_status_1'
      },
      {
        key: { entity: 1, entityId: 1, status: 1, createdAt: -1 },
        name: 'entity_1_entityId_1_status_1_createdAt_-1'
      }
    ]
  },
  {
    collection: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
    indexes: [
      {
        key: { workspaceId: 1, status: 1, startedAt: -1, createdAt: -1 },
        name: 'workspaceId_1_status_1_startedAt_-1_createdAt_-1'
      },
      {
        key: { workspaceId: 1, planId: 1, status: 1 },
        name: 'workspaceId_1_planId_1_status_1'
      },
      {
        key: { status: 1, createdAt: -1 },
        name: 'status_1_createdAt_-1'
      }
    ]
  },
  {
    collection: paymentModel.PAYMENT_COLLECTION_NAME,
    indexes: [
      { key: { subscriptionId: 1 }, name: 'subscriptionId_1' },
      {
        key: { providerTransactionId: 1 },
        name: 'providerTransactionId_1'
      },
      { key: { status: 1, paidAt: -1 }, name: 'status_1_paidAt_-1' }
    ]
  },
  {
    collection: ticketModel.TICKET_COLLECTION_NAME,
    indexes: [
      { key: { status: 1, createdAt: -1 }, name: 'status_1_createdAt_-1' },
      {
        key: { createdBy: 1, createdAt: -1 },
        name: 'createdBy_1_createdAt_-1'
      },
      { key: { email: 1 }, name: 'email_1' }
    ]
  },
  {
    collection: backgroundModel.BACKGROUND_COLLECTION_NAME,
    indexes: [
      {
        key: { entity: 1, type: 1, boardId: 1, status: 1, isDelete: 1 },
        name: 'entity_1_type_1_boardId_1_status_1_isDelete_1'
      }
    ]
  },
  {
    collection: planModel.PLAN_COLLECTION_NAME,
    indexes: [
      {
        key: { status: 1, isDeleted: 1, currentPrice: 1 },
        name: 'status_1_isDeleted_1_currentPrice_1'
      }
    ]
  },
  {
    collection: transactionModel.TRANSACTION_COLLECTION_NAME,
    indexes: [{ key: { transactionId: 1 }, name: 'transactionId_1' }]
  },
  {
    collection: boardPermissionModel.BOARD_PERMISSION_COLLECTION_NAME,
    indexes: [{ key: { permissionCode: 1 }, name: 'permissionCode_1' }]
  },
  {
    collection: workspacePermissionModel.WORKSPACE_PERMISSION_COLLECTION_NAME,
    indexes: [{ key: { permissionCode: 1 }, name: 'permissionCode_1' }]
  }
]

export const INIT_DB_INDEXES = async (db) => {
  for (const definition of INDEX_DEFINITIONS) {
    if (!definition?.indexes?.length) continue

    try {
      await db
        .collection(definition.collection)
        .createIndexes(definition.indexes)
    } catch (error) {
      process.stderr.write(
        `[MongoDB] Failed to ensure indexes for "${definition.collection}": ${error.message}\n`
      )
    }
  }
}
