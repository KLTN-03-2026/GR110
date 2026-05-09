import Joi from 'joi'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'

const login = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  password: Joi.string()
    .required()
    .pattern(PASSWORD_RULE)
    .message(PASSWORD_RULE_MESSAGE)
})

const update = Joi.object({
  displayName: Joi.string().required().trim().strict(),
  username: Joi.string().required().trim().strict(),
  currentPassword: Joi.string().allow('').optional(),
  newPassword: Joi.string().allow('').optional(),
  confirmPassword: Joi.string().allow('').optional()
}).custom((data, helpers) => {
  const hasCurrent = !!data.currentPassword
  const hasNew = !!data.newPassword
  const hasConfirm = !!data.confirmPassword

  if (!hasCurrent && !hasNew && !hasConfirm) return data

  if (!hasCurrent) return helpers.message('Current password is required')
  if (!hasNew) return helpers.message('New password is required')
  if (!hasConfirm) return helpers.message('Confirm password is required')

  if (!PASSWORD_RULE.test(data.newPassword)) {
    return helpers.message(PASSWORD_RULE_MESSAGE)
  }

  if (data.newPassword !== data.confirmPassword) {
    return helpers.message('Confirm password does not match')
  }

  return data
})

export const adminAuthValidation = {
  login,
  update
}