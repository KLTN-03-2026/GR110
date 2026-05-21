import express from 'express'
import AdminPlanController from '~/controllers/adminPlan.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'
import validate from '~/utils/validate'
import { adminPlanValidation } from '~/validations/adminPlan.validation'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminPlanController.fetchByPlan)
  )
  .post(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(validate(adminPlanValidation.create)),
    asyncHandler(AdminPlanController.createAdminPlan)
  )
Router.route('/status/:planId').patch(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminPlanController.updateBlockPlan)
)
Router.route('/delete/:planId').delete(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminPlanController.deleteAdminPlan)
)
Router.route('/:planId').put(
  asyncHandler(authAdminMiddleware.isAuthorized),
  asyncHandler(AdminPlanController.updateAdminPlan)
)

export const adminPlanRoute = Router
