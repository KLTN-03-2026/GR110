import express from 'express'
import AdminBoardController from '~/controllers/adminBoard.controller'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/')
  .get(asyncHandler(AdminBoardController.fetchByBoard))

export const adminBoardRoute = Router
