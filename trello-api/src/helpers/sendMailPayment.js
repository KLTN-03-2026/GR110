import { ObjectId } from 'mongodb'
import { env } from '~/config/environment'
import { sendEmailService } from '~/providers/NodeMailer'
import SubscriptionRepo from '~/repo/subscription.repo'
import UserRepo from '~/repo/user.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import { WEBSITE_DOMAIN } from '~/utils/constants'

const formatDateForMail = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toISOString().replace('T', ' ').replace('Z', ' UTC')
}

export const sendUpgradePaymentSuccessMail = async ({
  subscriptionId,
  workspaceId,
  providerTransactionId,
  paidCurrency,
  amount,
  paidAt
}) => {
  try {
    const [subscriptionDetail, workspace] = await Promise.all([
      SubscriptionRepo.findDetailById({ subscriptionId }),
      WorkspaceRepo.findOne({
        filter: { _id: new ObjectId(workspaceId) }
      })
    ])

    if (!workspace?.createdBy) return

    const user = await UserRepo.findById({
      _id: new ObjectId(workspace.createdBy)
    })

    if (!user?.email) return

    await sendEmailService({
      recipientEmail: user.email,
      customSubject: 'Taskio - Upgrade Payment Successful',
      templateName: 'UpgradePaymentSuccessMail',
      data: {
        customerName: user.displayName || user.username || user.email,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        workspaceName:
          subscriptionDetail?.workspaceTitle || workspace?.title || '-',
        planName: subscriptionDetail?.planTitle || 'Premium Plan',
        amount: Number.isFinite(Number(amount))
          ? Number(amount).toFixed(2)
          : '-',
        currency: paidCurrency || 'USD',
        transactionId: providerTransactionId || '-',
        paymentMethod: 'PayPal',
        paidAt: formatDateForMail(paidAt),
        nextBillingDate: formatDateForMail(subscriptionDetail?.endedAt),
        workspaceLink: `${WEBSITE_DOMAIN}/h/workspaces/${workspaceId}/billing`,
        supportEmail: env.EMAIL_USERNAME
      }
    })
  } catch (error) {
    console.error(
      'Failed to send upgrade payment success email:',
      error?.message
    )
  }
}
