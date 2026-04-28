import Joi from 'joi'
import { idSchema } from './common.validation'

const createNewBoardInvitation = Joi.object({
  inviteeEmail: Joi.string().required(),
  boardId: Joi.string().required()
})

const createBoardInvitation = Joi.object({
  boardId: idSchema.required().messages({
    'any.required': 'Board ID is required.'
  }),

  userIds: Joi.array().items(idSchema).min(1).required().messages({
    'array.min': 'At least one user must be selected.',
    'any.required': 'Invitee list is required.'
  }),

  emails: Joi.array().items(Joi.string().email()).optional(),
  message: Joi.string().allow('').max(1000).optional()
}).unknown(false)

const updateInvitationParam = Joi.object({
  _id: idSchema
})

const updateInvitationStatus = Joi.object({
  status: Joi.string().valid('accepted', 'rejected').required()
}).unknown(false)

export const invitationValidation = {
  createNewBoardInvitation,
  createBoardInvitation,
  updateInvitationParam,
  updateInvitationStatus
}
