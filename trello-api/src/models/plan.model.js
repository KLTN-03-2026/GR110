import Joi from 'joi'
import { PLAN_BILLING_CYCLE, PLAN_STATUS } from '~/constant/enum/plan.enum'

const PLAN_COLLECTION_NAME = 'plans'

const featureSchema = Joi.object({
  capabilities: Joi.object({
    workspace: Joi.object({
      customRole: Joi.boolean().required()
    }).required(),

    board: Joi.object({
      customRole: Joi.boolean().required()
    }).required(),

    column: Joi.object({
      customColor: Joi.boolean().required()
    }).required(),

    task: Joi.object({
      setDue: Joi.boolean().required(),
      assignMembers: Joi.boolean().required()
    }).required()
  }).required(),

  limits: Joi.object({
    maxMembers: Joi.number().integer().min(0).required(),
    maxBoards: Joi.number().integer().min(0).required(),
    maxWorkspaceRoles: Joi.number().integer().min(0).required(),
    maxBoardRoles: Joi.number().integer().min(0).required(),
    maxColumnsPerBoard: Joi.number().integer().min(0).required(),
    maxCardsPerBoard: Joi.number().integer().min(0).required(),
    maxCommentsPerCard: Joi.number().integer().min(0).required(),
    maxChecklistItemsPerCard: Joi.number().integer().min(0).required(),
    maxStorageMb: Joi.number().integer().min(0).required(),
    maxFileSizeMb: Joi.number().integer().min(0).required(),
    maxFilesPerUpload: Joi.number().integer().min(0).required()
  }).required()
}).required()

const PLAN_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),

  feature: featureSchema,

  billingCycle: Joi.string()
    .valid(...PLAN_BILLING_CYCLE)
    .default('monthly'),

  description: Joi.string()
    .min(20)
    .trim()
    .strict()
    .allow('')
    .default(''),

  originPrice: Joi.number().min(0).required(),

  currentPrice: Joi.number().min(0).required(),

  status: Joi.string()
    .valid(...PLAN_STATUS)
    .default('active'),

  isDeleted: Joi.boolean().default(false),

  isDefault: Joi.boolean().default(false),

  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null)
}).custom((value, helpers) => {
  if (value.currentPrice > value.originPrice) {
    return helpers.error('any.invalid')
  }
  return value
}, 'price validation')

const validateBeforeCreate = async (data) => {
  return await PLAN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

export const planModel = {
  PLAN_COLLECTION_NAME,
  PLAN_COLLECTION_SCHEMA,
  validateBeforeCreate
}
