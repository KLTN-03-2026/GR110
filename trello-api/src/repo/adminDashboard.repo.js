import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/user.model'
import { workspaceModel } from '~/models/workspace.model'
import { paymentModel } from '~/models/payment.model'
import { subscriptionModel } from '~/models/subscription.model'

class AdminDashboardRepo {
  static getUserRegistrationsByDay = async ({ startDate, endDate }) => {
    return await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lt: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
                timezone: 'UTC'
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            count: 1
          }
        },
        { $sort: { date: 1 } }
      ])
      .toArray()
  }

  static getWorkspaceUpgradesByDay = async ({ startDate, endDate }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            status: 'paid',
            paidAt: { $gte: startDate, $lt: endDate }
          }
        },
        {
          $lookup: {
            from: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
            let: { subscriptionId: '$subscriptionId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, '$$subscriptionId']
                  }
                }
              }
            ],
            as: 'subscription'
          }
        },
        {
          $unwind: {
            path: '$subscription',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$paidAt',
                  timezone: 'UTC'
                }
              },
              workspaceId: '$subscription.workspaceId'
            }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            count: 1
          }
        },
        { $sort: { date: 1 } }
      ])
      .toArray()
  }

  static getUserCountByDateRange = async ({ startDate, endDate }) => {
    return await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .countDocuments({
        createdAt: { $gte: startDate, $lt: endDate }
      })
  }

  static getWorkspaceUpgradeCountByDateRange = async ({ startDate, endDate }) => {
    const result = await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            status: 'paid',
            paidAt: { $gte: startDate, $lt: endDate }
          }
        },
        {
          $lookup: {
            from: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
            let: { subscriptionId: '$subscriptionId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, '$$subscriptionId']
                  }
                }
              }
            ],
            as: 'subscription'
          }
        },
        {
          $unwind: {
            path: '$subscription',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: '$subscription.workspaceId'
          }
        },
        {
          $count: 'total'
        }
      ])
      .toArray()

    return result?.[0]?.total || 0
  }

  static getTotalUsers = async () => {
    return await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .countDocuments({})
  }

  static getTotalWorkspaces = async () => {
    return await GET_DB()
      .collection(workspaceModel.WORKSPACE_COLLECTION_NAME)
      .countDocuments({})
  }

  static getTotalPaidUpgrades = async () => {
    const result = await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            status: 'paid'
          }
        },
        {
          $lookup: {
            from: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
            let: { subscriptionId: '$subscriptionId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, '$$subscriptionId']
                  }
                }
              }
            ],
            as: 'subscription'
          }
        },
        {
          $unwind: {
            path: '$subscription',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: '$subscription.workspaceId'
          }
        },
        {
          $count: 'total'
        }
      ])
      .toArray()

    return result?.[0]?.total || 0
  }

  static getPaidPaymentCountByDateRange = async ({ startDate, endDate }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .countDocuments({
        status: 'paid',
        paidAt: { $gte: startDate, $lt: endDate }
      })
  }

  static getFailedPaymentCountByDateRange = async ({ startDate, endDate }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .countDocuments({
        status: 'failed',
        failedAt: { $gte: startDate, $lt: endDate }
      })
  }
}

export default AdminDashboardRepo
