import BoardRepo from '~/repo/adminBoard.repo'

class AdminBoardService {
  static fetchByBoard = async ({ data }) => {
    const keyword = data?.search?.trim() || ''
    const page = Number(data?.page || 1)
    const limit = Number(data?.limit || 8)
    const skip = (page - 1) * limit

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const filter = keyword
      ? {
          $or: [
            { title: { $regex: escapedKeyword, $options: 'i' } },
            { ownerName: { $regex: escapedKeyword, $options: 'i' } },
            { workspaceName: { $regex: escapedKeyword, $options: 'i' } }
          ]
        }
      : {}

    const [boards, totalCount] = await Promise.all([
      BoardRepo.findManyWithPagination({
        filter,
        skip,
        limit
      }),
      BoardRepo.countDocuments({ filter })
    ])

    return {
      boards,
      totalCount,
      page,
      limit
    }
  }
}
export default AdminBoardService
