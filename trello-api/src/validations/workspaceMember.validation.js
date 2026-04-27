import Joi from 'joi'
import { idSchema } from './common.validation'

const updateAndDeleteWorkspaceMemberParamSchema = Joi.object({
  workspaceId: idSchema,
  memberId: idSchema
})

const updateAndDeleteWorkspaceRoleParamSchema = Joi.object({
  workspaceId: idSchema,
  roleId: idSchema
})

const updateWorkspaceMemberRoleSchema = Joi.object({
  roleId: idSchema
}).unknown(false)

export const workspaceMemberValidation = {
  updateAndDeleteWorkspaceMemberParamSchema,
  updateAndDeleteWorkspaceRoleParamSchema,
  updateWorkspaceMemberRoleSchema
}
