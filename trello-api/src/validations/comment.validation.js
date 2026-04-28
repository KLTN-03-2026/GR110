import Joi from 'joi'
import { idSchema } from './common.validation'

const create = Joi.object({
  boardId: idSchema,
  cardId: idSchema,
  content: Joi.string().required().min(1).max(5000).trim().strict().messages({
    'any.required': 'Comment content is required.',
    'string.empty': 'Comment content is not allowed to be empty.',
    'string.min': 'Comment content must be at least 1 character long.',
    'string.max':
      'Comment content must be less than or equal to 5000 characters long.'
  })
})

const deleteCommentParamSchema = Joi.object({
  boardId: idSchema,
  commentId: idSchema
})

export const commentValidation = { create, deleteCommentParamSchema }
