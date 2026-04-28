import Joi from 'joi'
import { WORKSPACE_PERMISSIONS } from '~/constant/workspacePermission.constant'
import { WORKSPACE_STATUS } from '~/constant/enum/workspace.enum'
import { idSchema } from './common.validation'

const createWorkspaceSchema = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict().messages({
    'any.required': 'Workspace title is required.',
    'string.empty': 'Workspace title cannot be empty.',
    'string.min': 'Workspace title must be at least 3 characters long.',
    'string.max':
      'Workspace title must be less than or equal to 50 characters long.',
    'string.trim':
      'Workspace title must not have leading or trailing whitespace.'
  }),

  description: Joi.string()
    .max(255)
    .trim()
    .strict()
    .allow('')
    .messages({
      'string.max':
        'Workspace description must be less than or equal to 255 characters long.',
      'string.trim':
        'Workspace description must not have leading or trailing whitespace.'
    })
    .default('')
}).unknown(false)

const updateWorkspaceSchema = Joi.object({
  title: Joi.string().min(3).max(50).trim().strict().messages({
    'string.empty': 'Workspace title cannot be empty.',
    'string.min': 'Workspace title must be at least 3 characters long.',
    'string.max':
      'Workspace title must be less than or equal to 50 characters long.',
    'string.trim':
      'Workspace title must not have leading or trailing whitespace.'
  }),

  description: Joi.string().max(255).trim().strict().allow('').messages({
    'string.max':
      'Workspace description must be less than or equal to 255 characters long.',
    'string.trim':
      'Workspace description must not have leading or trailing whitespace.'
  }),

  status: Joi.string()
    .valid(...WORKSPACE_STATUS)
    .messages({
      'any.only': `Workspace status must be one of: ${WORKSPACE_STATUS.join(', ')}`
    })
}).unknown(false)

const createRoleSchema = Joi.object({
  workspaceId: idSchema.required().messages({
    'any.required': 'Workspace ID is required.'
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
    .items(
      Joi.string()
        .valid(...Object.values(WORKSPACE_PERMISSIONS))
        .messages({
          'any.only': 'Invalid permission code: {#label}'
        })
    )
    .messages({
      'array.base': 'Permission codes must be an array.',
      'array.includesRequiredUnknowns': 'Invalid permission code found.'
    })
}).unknown(false)

const updateRoleSchema = Joi.object({
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

  permissionCodes: Joi.array()
    .items(
      Joi.string()
        .valid(...Object.values(WORKSPACE_PERMISSIONS))
        .messages({
          'any.only': 'Invalid permission code: {#label}'
        })
    )
    .messages({
      'array.base': 'Permission codes must be an array.',
      'array.includesRequiredUnknowns': 'Invalid permission code found.'
    })
})

const updateRolesSchema = Joi.array()
  .items(updateRoleSchema.required())
  .min(1)
  .required()
  .messages({
    'array.min': 'At least one role must be provided for update.',
    'array.base': 'Roles must be an array.'
  })

export const workspaceValidation = {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  createRoleSchema,
  updateRoleSchema,
  updateRolesSchema
}
