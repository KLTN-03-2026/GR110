import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/user.model'
import { workspaceModel } from '~/models/workspace.model'
import { paymentModel } from '~/models/payment.model'
import { subscriptionModel } from '~/models/subscription.model'
import { transactionModel } from '~/models/transaction.model'
import { planModel } from '~/models/plan.model'

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

  static getRevenueByDay = async ({ startDate, endDate }) => {
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
          $addFields: {
            transactionObjectId: {
              $convert: {
                input: '$transactionId',
                to: 'objectId',
                onError: null,
                onNull: null
              }
            }
          }
        },
        {
          $lookup: {
            from: transactionModel.TRANSACTION_COLLECTION_NAME,
            localField: 'transactionObjectId',
            foreignField: '_id',
            as: 'transaction'
          }
        },
        {
          $unwind: {
            path: '$transaction',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$paidAt',
                timezone: 'UTC'
              }
            },
            amount: { $sum: { $ifNull: ['$transaction.transferAmount', 0] } }
          }
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            amount: { $round: ['$amount', 2] }
          }
        },
        { $sort: { date: 1 } }
      ])
      .toArray()
  }

  static getRevenueAmountByDateRange = async ({ startDate, endDate }) => {
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
          $addFields: {
            transactionObjectId: {
              $convert: {
                input: '$transactionId',
                to: 'objectId',
                onError: null,
                onNull: null
              }
            }
          }
        },
        {
          $lookup: {
            from: transactionModel.TRANSACTION_COLLECTION_NAME,
            localField: 'transactionObjectId',
            foreignField: '_id',
            as: 'transaction'
          }
        },
        {
          $unwind: {
            path: '$transaction',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ['$transaction.transferAmount', 0] } }
          }
        }
      ])
      .toArray()

    return Number((result?.[0]?.total || 0).toFixed(2))
  }

  static getSuccessfulUpgradeByPlan = async ({ startDate, endDate }) => {
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
          $addFields: {
            subscriptionObjectId: {
              $convert: {
                input: '$subscriptionId',
                to: 'objectId',
                onError: null,
                onNull: null
              }
            }
          }
        },
        {
          $lookup: {
            from: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
            localField: 'subscriptionObjectId',
            foreignField: '_id',
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
          $addFields: {
            planObjectId: {
              $convert: {
                input: '$subscription.planId',
                to: 'objectId',
                onError: null,
                onNull: null
              }
            }
          }
        },
        {
          $lookup: {
            from: planModel.PLAN_COLLECTION_NAME,
            localField: 'planObjectId',
            foreignField: '_id',
            as: 'plan'
          }
        },
        {
          $unwind: {
            path: '$plan',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$subscription.planId',
            planTitle: { $first: { $ifNull: ['$plan.title', 'Unknown Plan'] } },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            planId: '$_id',
            planTitle: 1,
            count: 1
          }
        },
        { $sort: { count: -1, planTitle: 1 } }
      ])
      .toArray()
  }
}

export default AdminDashboardRepo
