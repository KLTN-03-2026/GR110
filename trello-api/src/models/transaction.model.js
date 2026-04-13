import Joi from 'joi'

const TRANSACTION_COLLECTION_NAME = 'transactions'

const TRANSACTION_COLLECTION_SCHEMA = Joi.object({
  gateway: Joi.string().required().trim().strict(),

  transactionDate: Joi.string().required().trim().strict(),

  accountNumber: Joi.string().required().trim().strict(),

  subAccount: Joi.string().allow(null, '').default(null),

  code: Joi.string().allow(null, '').default(''),

  content: Joi.string().allow(null, '').default(''),

  transferType: Joi.string().valid('in', 'out').required(),

  description: Joi.string().allow(null, '').default(null),

  transferAmount: Joi.number().required().min(0),

  referenceCode: Joi.string().required().trim().strict(),

  accumulated: Joi.number().required(),

  sepayId: Joi.number().required(),

  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null)
})

const validateBeforeCreate = async (data) => {
  const customData = {
    ...data,
    sepayId: data.id
  }

  delete customData.id

  return await TRANSACTION_COLLECTION_SCHEMA.validateAsync(customData, {
    abortEarly: false
  })
}

export const transactionModel = {
  TRANSACTION_COLLECTION_NAME,
  TRANSACTION_COLLECTION_SCHEMA,
  validateBeforeCreate
}