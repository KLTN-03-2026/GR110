import Joi from 'joi'
import { idSchema } from './common.validation'

const updateAndDeleteBoardMemberParamSchema = Joi.object({
  boardId: idSchema,
  memberId: idSchema
})

const updateBoardMemberRoleSchema = Joi.object({
  roleId: idSchema
}).unknown(false)

export const boardMemberValidation = {
  updateAndDeleteBoardMemberParamSchema,
  updateBoardMemberRoleSchema
}
