import express from 'express'
import AdminWorkspaceController from '~/controllers/adminWorkspace.controller'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/')
  .get(asyncHandler(AdminWorkspaceController.fetchByWorkspace))

export const adminWorkspaceRoute = Router
