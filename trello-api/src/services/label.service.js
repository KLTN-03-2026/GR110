import { ObjectId } from 'mongodb'
import { mongoClientInstance } from '~/config/mongodb'
import { NotFoundErrorResponse } from '~/core/error.response'
import CardRepo from '~/repo/card.repo'
import LabelRepo from '~/repo/label.repo'

class LabelService {
  static create = async ({ boardAccess, data }) => {
    const boardId = boardAccess.board._id.toString()
    const createLabelData = {
      boardId,
      title: data.title,
      color: data.color,
      createdBy: boardAccess.boardMember._id.toString()
    }

    const createdLabel = await LabelRepo.createOne({ data: createLabelData })

    return await LabelRepo.findOne({
      filter: { _id: new ObjectId(createdLabel.insertedId) }
    })
  }

  static update = async ({ _id, boardAccess, data }) => {
    const boardId = boardAccess.board._id.toString()
    const label = await LabelRepo.findOne({
      filter: { _id: new ObjectId(_id), boardId }
    })

    if (!label) throw new NotFoundErrorResponse('Label not found.')

    const updatedLabel = await LabelRepo.updateOne({
      filter: { _id: new ObjectId(_id), boardId },
      data: { $set: { title: data.title, color: data.color } }
    })

    return updatedLabel
  }

  static delete = async ({ _id, boardAccess }) => {
    const boardId = boardAccess.board._id.toString()
    const label = await LabelRepo.findOne({
      filter: { _id: new ObjectId(_id), boardId }
    })

    if (!label) throw new NotFoundErrorResponse('Label not found.')

    const session = await mongoClientInstance.startSession()

    try {
      await session.withTransaction(async () => {
        await LabelRepo.deleteOne({
          filter: { _id: new ObjectId(_id), boardId },
          session
        })
        await CardRepo.updateMany({
          filter: { boardId },
          data: { $pull: { labelIds: label._id.toString() } },
          session
        })
      })
    } finally {
      await session.endSession()
    }

    return { _id }
  }
}

export default LabelService
