import express from 'express'
import LandingController from '~/controllers/landing.controller'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/plan')
  .get(
    asyncHandler(LandingController.getPlan)
  )

export const ladingRouter = Router
