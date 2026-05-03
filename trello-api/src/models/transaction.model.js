import Joi from 'joi'

const TRANSACTION_COLLECTION_NAME = 'transactions'

const TRANSACTION_COLLECTION_SCHEMA = Joi.object({
  gateway: Joi.string().valid('sepay', 'paypal').required().trim().strict(),

  transactionDate: Joi.string().required().trim().strict(),

  accountNumber: Joi.when('gateway', {
    is: 'sepay',
    then: Joi.string().trim().strict(),
    otherwise: Joi.string().allow(null, '').default(null)
  }),

  subAccount: Joi.string().allow(null, '').default(null),

  code: Joi.string().allow(null, '').default(''),

  content: Joi.string().allow(null, '').default(''),

  transferType: Joi.string().valid('in', 'out').required(),

  description: Joi.string().allow(null, '').default(null),

  transferAmount: Joi.number().required().min(0),

  referenceCode: Joi.string().required().trim().strict(),

  accumulated: Joi.number().allow(null).default(null),

  transactionId: Joi.string().required().trim().strict(),

  status: Joi.string().required(),

  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null)
})

const validateBeforeCreate = async (data) => {
  const customData = {
    ...data,
    transactionId: data.id
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