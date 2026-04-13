import WorkspaceRepo from '~/repo/adminWorkspace.repo'

class AdminWorkspaceService {
  static fetchByWorkspace = async ({ data }) => {
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
          ]
        }
      : {}

    const [workspaces, totalCount] = await Promise.all([
      WorkspaceRepo.findManyWithPagination({
        filter,
        skip,
        limit
      }),
      WorkspaceRepo.countDocuments({ filter })
    ])

    return {
      workspaces,
      totalCount,
      page,
      limit
    }
  }
}
export default AdminWorkspaceService
