import Joi from 'joi'
import { idSchema } from './common.validation'

const create = Joi.object({
  boardId: idSchema,
  columnId: idSchema,
  title: Joi.string().required().min(1).max(500).trim().strict().messages({
    'any.required': 'Title is required.',
    'string.empty': 'Title is not allowed to be empty.',
    'string.min': 'Title length must be at least 1 character long.',
    'string.max':
      'Title length must be less than or equal to 500 characters long.',
    'string.trim': 'Title must not have leading or trailing whitespace.'
  })
})

const update = Joi.object({
  title: Joi.string().min(1).max(500).trim().strict(),
  description: Joi.string().max(2000).trim().strict().allow(''),
  startedAt: Joi.date().allow(null),
  dueAt: Joi.date().allow(null),
  isCompleted: Joi.boolean(),
  cover: Joi.object({
    type: Joi.string().valid('color', 'attachment').required(),
    value: Joi.string().required().trim().strict(),
    display: Joi.string().valid('default', 'full').optional()
  }).allow(null)
}).unknown(false)

const updateAndDeleteCardParamSchema = Joi.object({
  boardId: idSchema,
  cardId: idSchema
})

const updateLabel = Joi.object({
  labelId: idSchema
}).unknown(false)

export const cardValidation = {
  create,
  update,
  updateLabel,
  updateAndDeleteCardParamSchema
}
