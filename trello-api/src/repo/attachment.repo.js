import { GET_DB } from '~/config/mongodb'
import { attachmentModel } from '~/models/cardAttachment.model'

class AttachmentRepo {
  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(attachmentModel.CARD_ATTACHMENT_NAME)
      .find(filter, options)
      .toArray()
  }

  static findOne = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(attachmentModel.CARD_ATTACHMENT_NAME)
      .findOne(filter, options)
  }

  static createMany = async ({ data, session }) => {
    const validData = await Promise.all(
      data.map((d) => attachmentModel.validateBeforeCreate(d))
    )

    return await GET_DB()
      .collection(attachmentModel.CARD_ATTACHMENT_NAME)
      .insertMany(validData, { session })
  }

  static updateOne = async ({ filter, data, session }) => {
    return await GET_DB()
      .collection(attachmentModel.CARD_ATTACHMENT_NAME)
      .findOneAndUpdate(filter, data, { session, returnDocument: 'after' })
  }

  static deleteOne = async ({ filter, session }) => {
    return await GET_DB()
      .collection(attachmentModel.CARD_ATTACHMENT_NAME)
      .deleteOne(filter, { session })
  }

  static deleteMany = async ({ filter, session }) => {
    return await GET_DB()
      .collection(attachmentModel.CARD_ATTACHMENT_NAME)
      .deleteMany(filter, { session })
  }

  static sumFileSizeByWorkspaceId = async ({ workspaceId }) => {
    const result = await GET_DB()
      .collection(attachmentModel.CARD_ATTACHMENT_NAME)
      .aggregate([
         {
          $addFields: {
            cardObjectId: { $toObjectId: '$cardId' }
          }
        },
        {
          $lookup: {
            from: 'cards',
            localField: 'cardObjectId',
            foreignField: '_id',
            as: 'card'
          }
        },
        { $unwind: '$card' },
        {
          $addFields: {
            boardObjectId: { $toObjectId: '$card.boardId' }
          }
        },
        {
          $lookup: {
            from: 'boards',
            localField: 'boardObjectId',
            foreignField: '_id',
            as: 'board'
          }
        },
        { $unwind: '$board' },
        {
          $match: {
            'board.workspaceId': workspaceId,
            fileSize: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$fileSize' }
          }
        }
      ])
      .toArray()

    return result[0]?.total || 0
  }
}
export default AttachmentRepo
