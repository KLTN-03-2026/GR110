import express from 'express'
import AdminBoardController from '~/controllers/adminBoard.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authAdminMiddleware } from '~/middlewares/authAdmin.middleware'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authAdminMiddleware.isAuthorized),
    asyncHandler(AdminBoardController.fetchByBoard)
  )

export const adminBoardRoute = Router
