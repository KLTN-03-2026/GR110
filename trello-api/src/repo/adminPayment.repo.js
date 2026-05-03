import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { paymentModel } from '~/models/payment.model'
import { subscriptionModel } from '~/models/subscription.model'
import { workspaceModel } from '~/models/workspace.model'
import { planModel } from '~/models/plan.model'
import { transactionModel } from '~/models/transaction.model'

class PaymentRepo {
  static buildPipeline = ({ filter = {} }) => {
    return [
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
          },
          transactionObjectId: {
            $cond: [
              { $ifNull: ['$transactionId', false] },
              { $toObjectId: '$transactionId' },
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
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          workspaceTitle: '$workspace.title',
          planTitle: '$plan.title',
          gateway: 1,
          status: 1,
          paidAt: 1,
          failedAt: 1,
          createdAt: 1,
          transactionId: '$transactionId',
          providerTransactionId: '$transaction.transactionId',
          amount: {
            $ifNull: ['$transaction.transferAmount', 0]
          }
        }
      },
      {
        $match: filter
      }
    ]
  }

  static findManyWithPagination = async ({
    filter = {},
    skip = 0,
    limit = 8
  }) => {
    const pipeline = [
      ...this.buildPipeline({ filter }),
      {
        $sort: {
          paidAt: -1,
          createdAt: -1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          createdAt: 0
        }
      }
    ]

    return await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .aggregate(pipeline)
      .toArray()
  }

  static countDocuments = async ({ filter = {} }) => {
    const result = await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .aggregate([
        ...this.buildPipeline({ filter }),
        {
          $count: 'total'
        }
      ])
      .toArray()

    return result?.[0]?.total || 0
  }

  static findTransactionByPaymentId = async ({ paymentId }) => {
    const result = await GET_DB()
      .collection(paymentModel.PAYMENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(paymentId)
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
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: { $toString: '$_id' },
            subscriptionId: 1,
            gateway: '$transaction.gateway',
            transactionDate: '$transaction.transactionDate',
            accountNumber: '$transaction.accountNumber',
            subAccount: '$transaction.subAccount',
            code: '$transaction.code',
            content: '$transaction.content',
            transferType: '$transaction.transferType',
            description: '$transaction.description',
            transferAmount: '$transaction.transferAmount',
            referenceCode: '$transaction.referenceCode',
            accumulated: '$transaction.accumulated',
            transactionId: '$transactionId',
            providerTransactionId: '$transaction.transactionId',
            status: '$transaction.status',
            paidAt: 1,
            failedAt: 1
          }
        }
      ])
      .toArray()

    return result[0] || null
  }
}

export default PaymentRepo
