import Joi from 'joi'
import { PLAN_BILLING_CYCLE, PLAN_STATUS } from '~/constant/enum/plan.enum'

const create = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),

  feature: Joi.object({
    capabilities: Joi.object({
      workspace: Joi.object({
        customRole: Joi.boolean().default(false)
      }).required(),

      board: Joi.object({
        customRole: Joi.boolean().default(false)
      }).required(),

      column: Joi.object({
        customColor: Joi.boolean().default(false)
      }).required(),

      task: Joi.object({
        setDue: Joi.boolean().default(false),
        assignMembers: Joi.boolean().default(false)
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
      maxFileSizeMb: Joi.number().integer().min(0).required()
    }).required()
  }).required(),

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
    .default('active')
}).custom((value, helpers) => {
  if (value.currentPrice > value.originPrice) {
    return helpers.message('Current price must be less than or equal to original price')
  }
  return value
})

export const adminPlanValidation = {
  create
}