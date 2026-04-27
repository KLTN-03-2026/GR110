import Joi from 'joi'
import { idSchema } from './common.validation'

const create = Joi.object({
  boardId: idSchema,
  title: Joi.string().max(50).trim().strict().allow('').required(),
  color: Joi.string().required()
}).unknown(false)

const update = Joi.object({
  title: Joi.string().max(50).trim().strict().allow('').required(),
  color: Joi.string().required()
}).unknown(false)

const updateAndDeleteLabelParamSchema = Joi.object({
  boardId: idSchema,
  labelId: idSchema
})
export const labelValidation = { create, update, updateAndDeleteLabelParamSchema }
