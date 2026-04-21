import { ObjectId } from 'mongodb'
import { NotFoundErrorResponse } from '~/core/error.response'
import AdminSubscriptionRepo from '~/repo/adminSubscription.repo'

class AdminSubscriptionService {
  static fetchBySubscription = async ({ data }) => {
    const keyword = data?.search?.trim() || ''
    const page = Number(data?.page || 1)
    const limit = Number(data?.limit || 8)
    const skip = (page - 1) * limit

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const filter = {
      ...(keyword && {
        $or: [
          { workspaceTitle: { $regex: escapedKeyword, $options: 'i' } },
          { planTitle: { $regex: escapedKeyword, $options: 'i' } }
        ]
      })
    }

    const [subscriptions, totalCount] = await Promise.all([
      AdminSubscriptionRepo.findManyWithPagination({
        filter,
        skip,
        limit
      }),
      AdminSubscriptionRepo.countDocuments({ filter })
    ])

    return {
      subscriptions,
      totalCount,
      page,
      limit
    }
  }

  static updateAdminSubscription = async ({ _id, data }) => {
    const subscription = await AdminSubscriptionRepo.findById({ _id })
    if (!subscription)
      throw new NotFoundErrorResponse('Subscription not found!')

    const updatedSubscription = await AdminSubscriptionRepo.updateById({
      _id: new ObjectId(_id),
      data: data
    })
    return updatedSubscription
  }

  static cancelAdminSubscription = async ({ _id, data }) => {
    const subscription = await AdminSubscriptionRepo.findById({ _id })
    if (!subscription)
      throw new NotFoundErrorResponse('Subscription not found!')

    const cancelledSubscription = await AdminSubscriptionRepo.updateById({
      _id: new ObjectId(_id),
      data: {
        status: 'canceled',
        canceledAt: new Date()
      }
    })
    return cancelledSubscription
  }
}
export default AdminSubscriptionService
