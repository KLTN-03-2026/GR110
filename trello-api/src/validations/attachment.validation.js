import Joi from 'joi'
import { idSchema } from './common.validation'
const updateAndDeleteAttachmentParamSchema = Joi.object({
  boardId: idSchema,
  attachmentId: idSchema
})

const update = Joi.object({
  fileName: Joi.string().required().trim().strict()
}).unknown(false)

export const attachmentValidation = { update, updateAndDeleteAttachmentParamSchema }
