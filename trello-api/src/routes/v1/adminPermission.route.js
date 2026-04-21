import express from 'express'
import AdminPermissionController from '~/controllers/adminPermission.controller'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/')
  .get(asyncHandler(AdminPermissionController.fetchPermission))

export const adminPermission = Router
