import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/board.route'
import { columnRoute } from '~/routes/v1/column.route'
import { cardRoute } from '~/routes/v1/card.route'
import { userRoute } from '~/routes/v1/user.route'
import { invitationRoute } from './invitation.route'
import { workspaceRoute } from './workspace.route'
import { commentRoute } from './comment.route'
import { taskRouter } from './task.route'
import { attachmentRouter } from './attachment.route'
import { labelRouter } from './label.route'
import { adminUserRoute } from './adminUser.route'
import { adminBackgroundRoute } from './adminBackground.route'
import { adminBoardRoute } from './adminBoard.route'
import { adminWorkspaceRoute } from './adminWorkspace.route'
import { adminPlanRoute } from './adminPlan.route'
import { adminAuthRouter } from './adminAuth.route'
import { subscriptionsRouter } from './subscription.route'
import { adminSubscriptionRoute } from './adminSubscription.route'
import { adminPermission } from './adminPermission.route'
import { adminPaymentRoute } from './adminPayment.route'
const Router = express.Router()

/** Check APIs v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/** Board APIs */
Router.use('/boards', boardRoute)

/** Column APIs */
Router.use('/columns', columnRoute)

/** Cards APIs */
Router.use('/cards', cardRoute)

/** User APIs */
Router.use('/users', userRoute)

/** Invitation APIs */
Router.use('/invitations', invitationRoute)

/** Workspace APIs */
Router.use('/workspaces', workspaceRoute)

/** Comment APIs */
Router.use('/comments', commentRoute)

/** Task APIs */
Router.use('/tasks', taskRouter)

/** Attachment APIs */
Router.use('/attachments', attachmentRouter)

/** Label APIs */
Router.use('/labels', labelRouter)

// Admin User APIs
Router.use('/admin/users', adminUserRoute)

// Admin Background APIs
Router.use('/admin/backgrounds', adminBackgroundRoute)

//Admin Board APIs
Router.use('/admin/boards', adminBoardRoute)

//Admin Workspace APIs
Router.use('/admin/workspaces', adminWorkspaceRoute)

//Admin Plan APIs
Router.use('/admin/plans', adminPlanRoute)

//Admin APIs
Router.use('/admin', adminAuthRouter)

//Admin Subscription
Router.use('/admin/subscriptions', adminSubscriptionRoute)

//Admin Permission
Router.use('/admin/permissions', adminPermission)

//Admin Payment
Router.use('/admin/payments', adminPaymentRoute)

//Subscription
Router.use('/subscriptions', subscriptionsRouter)

export const APIs_V1 = Router
