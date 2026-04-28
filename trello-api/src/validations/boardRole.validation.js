import Joi from 'joi'
import { idSchema } from './common.validation'
import { BOARD_PERMISSIONS } from '~/constant/boardPermission.constant'

const permissionCodeSchema = Joi.string()
  .valid(...Object.values(BOARD_PERMISSIONS))
  .messages({
    'any.only': 'Invalid board permission code.'
  })

const createBoardRoleSchema = Joi.object({
  boardId: idSchema.required().messages({
    'any.required': 'Board ID is required.'
  }),

  name: Joi.string().required().min(3).max(100).trim().strict().messages({
    'any.required': 'Role name is required.',
    'string.empty': 'Role name cannot be empty.',
    'string.min': 'Role name must be at least 3 characters long.',
    'string.max':
      'Role name must be less than or equal to 100 characters long.',
    'string.trim': 'Role name must not have leading or trailing whitespace.'
  }),

  permissionCodes: Joi.array()
    .items(permissionCodeSchema)
    .default([])
    .messages({
      'array.base': 'Permission codes must be an array.'
    })
}).unknown(false)

const updateBoardRoleSchema = Joi.object({
  _id: idSchema.required().messages({
    'any.required': 'Role ID is required.'
  }),

  name: Joi.string().min(3).max(100).trim().strict().messages({
    'string.empty': 'Role name cannot be empty.',
    'string.min': 'Role name must be at least 3 characters long.',
    'string.max':
      'Role name must be less than or equal to 100 characters long.',
    'string.trim': 'Role name must not have leading or trailing whitespace.'
  }),

  permissionCodes: Joi.array().items(permissionCodeSchema).messages({
    'array.base': 'Permission codes must be an array.'
  })
})

const updateBoardRolesSchema = Joi.array()
  .items(updateBoardRoleSchema.required())
  .min(1)
  .required()
  .messages({
    'array.min': 'At least one role must be provided for update.',
    'array.base': 'Roles must be an array.'
  })

const deleteBoardRoleParamSchema = Joi.object({
  boardId: idSchema,
  roleId: idSchema
})
export {
  createBoardRoleSchema,
  updateBoardRolesSchema,
  deleteBoardRoleParamSchema
}
