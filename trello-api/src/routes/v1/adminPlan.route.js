import express from 'express'
import AdminPlanController from '~/controllers/adminPlan.controller'
import asyncHandler from '~/helpers/asyncHandler'
import validate from '~/utils/validate'
import { adminPlanValidation } from '~/validations/adminPlan.validation'

const Router = express.Router()

Router.route('/')
  .get(asyncHandler(AdminPlanController.fetchByPlan))
  .post(
    asyncHandler(validate(adminPlanValidation.create)),
    asyncHandler(AdminPlanController.createAdminPlan)
  )
Router.route('/status/:planId').patch(
  asyncHandler(AdminPlanController.updateBlockPlan)
)
Router.route('/delete/:planId').delete(
  asyncHandler(AdminPlanController.deleteAdminPlan)
)
Router.route('/:planId').put(asyncHandler(AdminPlanController.updateAdminPlan))

export const adminPlanRoute = Router
