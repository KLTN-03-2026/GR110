import Joi from 'joi'
import { BACKGROUND_ENTITY, BACKGROUND_STATUS, BACKGROUND_TYPE } from '~/constant/enum/background.enum'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const BACKGROUND_COLLECTION_NAME = 'backgrounds'

const BACKGROUND_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(100).trim().strict(),

  image: Joi.string().required().trim().strict(),

  entity: Joi.string()
    .required()
    .valid(...BACKGROUND_ENTITY),

  status: Joi.string()
    .valid(...BACKGROUND_STATUS)
    .default('active'),

  type: Joi.string()
    .required()
    .valid(...BACKGROUND_TYPE),

  boardId: Joi.when('type', {
    is: 'board',
    then: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    otherwise: Joi.string()
      .allow(null, '')
      .default(null)
  }),

  isDelete: Joi.boolean().default(false),

  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null)
})

const validateBeforeCreate = async (data) => {
  return await BACKGROUND_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

export const backgroundModel = {
  BACKGROUND_COLLECTION_NAME,
  BACKGROUND_COLLECTION_SCHEMA,
  validateBeforeCreate
}