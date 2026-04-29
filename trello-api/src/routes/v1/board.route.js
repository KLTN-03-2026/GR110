import express from 'express'
import { boardValidation } from '~/validations/board.validation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import BoardController from '~/controllers/board.controller'
import asyncHandler from '~/helpers/asyncHandler'
import validate from '~/utils/validate'
import { createIdParamSchema } from '~/validations/common.validation'
import { workspaceMiddleware } from '~/middlewares/workspacePermission.middleware'
import { WORKSPACE_PERMISSIONS } from '~/constant/workspacePermission.constant'
import { boardMiddleware } from '~/middlewares/boardPermission.middleware'
import { BOARD_PERMISSIONS } from '~/constant/boardPermission.constant'
import {
  createBoardRoleSchema,
  deleteBoardRoleParamSchema,
  updateBoardRolesSchema
} from '~/validations/boardRole.validation'
import { boardMemberValidation } from '~/validations/boardMember.validation'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'

const Router = express.Router()

Router.route('/workspace/:workspaceId').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createIdParamSchema('workspaceId'), 'params')),
  asyncHandler(workspaceMiddleware.checkPermission(WORKSPACE_PERMISSIONS.VIEW)),
  asyncHandler(BoardController.fetchBoardByWorkspaceId)
)

Router.route('/').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.getBoards)
)

Router.route('/backgrounds').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.getBackground)
)

Router.route('/').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(boardValidation.create)),
  asyncHandler(
    workspaceMiddleware.checkPermission(WORKSPACE_PERMISSIONS.BOARD_CREATE)
  ),
  asyncHandler(BoardController.create)
)

Router.route('/permissions').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.fetchBoardPermission)
)

Router.route('/roles/:boardId').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.VIEW)),
  asyncHandler(BoardController.fetchBoardRole)
)

Router.route('/:boardId')
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
    asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.VIEW)),
    asyncHandler(BoardController.getDetails)
  )
  .put(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
    asyncHandler(validate(boardValidation.update)),
    asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.UPDATE)),
    asyncHandler(BoardController.update)
  )
  .delete(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
    asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.DELETE)),
    asyncHandler(BoardController.delete)
  )

Router.route('/supports/moving_card/:boardId').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
  asyncHandler(validate(boardValidation.moveCardToDifferentColumn)),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.CARD_MOVE)),
  asyncHandler(BoardController.moveCardToDifferentColumn)
)

Router.route('/members/:boardId').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.VIEW)),
  asyncHandler(BoardController.fetchBoardMember)
)

Router.route('/activity/:boardId').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.VIEW)),
  asyncHandler(BoardController.fetchBoardActivity)
)

Router.route('/members/leave/:boardId/:memberId').delete(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(
    validate(
      boardMemberValidation.updateAndDeleteBoardMemberParamSchema,
      'params'
    )
  ),
  asyncHandler(boardMiddleware.checkPermission(null)),
  asyncHandler(BoardController.leaveBoard)
)

Router.route('/members/:boardId/:memberId')
  .put(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(
      validate(
        boardMemberValidation.updateAndDeleteBoardMemberParamSchema,
        'params'
      )
    ),
    asyncHandler(
      validate(boardMemberValidation.updateBoardMemberRoleSchema, 'body')
    ),
    asyncHandler(
      boardMiddleware.checkPermission(BOARD_PERMISSIONS.MEMBER_CHANGE_ROLE)
    ),
    asyncHandler(BoardController.updateMemberRole)
  )
  .delete(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(
      validate(
        boardMemberValidation.updateAndDeleteBoardMemberParamSchema,
        'params'
      )
    ),
    asyncHandler(
      boardMiddleware.checkPermission(BOARD_PERMISSIONS.MEMBER_REMOVE)
    ),
    asyncHandler(BoardController.removeMember)
  )

Router.route('/roles').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createBoardRoleSchema, 'body')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.ROLE_CREATE)),
  asyncHandler(BoardController.createRole)
)

Router.route('/roles/:boardId').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
  asyncHandler(validate(updateBoardRolesSchema, 'body')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.ROLE_UPDATE)),
  asyncHandler(BoardController.updateRole)
)

Router.route('/roles/:boardId/:roleId').delete(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(deleteBoardRoleParamSchema, 'params')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.ROLE_DELETE)),
  asyncHandler(BoardController.deleteRole)
)

Router.route('/custom-background/:boardId').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(createIdParamSchema('boardId'), 'params')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.UPDATE)),
  asyncHandler(multerUploadMiddleware.uploadSingleImage),
  asyncHandler(BoardController.createBackground)
)

Router.route('/custom-background/:boardId/:backgroundId').delete(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(boardValidation.customBackgroundParams, 'params')),
  asyncHandler(boardMiddleware.checkPermission(BOARD_PERMISSIONS.UPDATE)),
  asyncHandler(BoardController.deleteBackground)
)

export const boardRoute = Router
