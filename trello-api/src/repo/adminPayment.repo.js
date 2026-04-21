import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { paymentModel } from '~/models/payment.model'
import { subscriptionModel } from '~/models/subscription.model'
import { workspaceModel } from '~/models/workspace.model'
import { planModel } from '~/models/plan.model'

class PaymentRepo {
  static findManyWithPagination = async ({
    filter = {},
    skip = 0,
    limit = 8
  }) => {
    const pipeline = [
      {
        $match: filter
      },
      {
        $addFields: {
          subscriptionObjectId: { $toObjectId: '$subscriptionId' }
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
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          workspaceObjectId: {
            $cond: [
              { $ifNull: ['$subscription.workspaceId', false] },
              { $toObjectId: '$subscription.workspaceId' },
              null
            ]
          },
          planObjectId: {
            $cond: [
              { $ifNull: ['$subscription.planId', false] },
              { $toObjectId: '$subscription.planId' },
              null
            ]
          }
        }
      },
      {
        $lookup: {
          from: workspaceModel.WORKSPACE_COLLECTION_NAME,
          localField: 'workspaceObjectId',
          foreignField: '_id',
          as: 'workspace'
        }
      },
      {
        $unwind: {
          path: '$workspace',
          preserveNullAndEmptyArrays: true
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
        $project: {
          _id: 1,
          workspaceTitle: '$workspace.title',
          planTitle: '$plan.title',
          gateway: 1,
          providerTransactionId: 1,
          amount: 1,
          status: 1,
          paidAt: 1,
          failedAt: 1
        }
      },
      {
        $sort: {
          paidAt: -1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]

    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .aggregate(pipeline)
      .toArray()
  }

  static countDocuments = async ({ filter = {} }) => {
    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .countDocuments(filter)
  }
}

export default PaymentRepo