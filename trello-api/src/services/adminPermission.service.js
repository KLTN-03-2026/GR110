import PermissionRepo from '~/repo/adminPermission.repo'

export default class AdminPermissionService {
  static fetchPermission = async ({ data }) => {
    const keyword = data?.search?.trim() || ''
    const page = Number(data?.page || 1)
    const limit = Number(data?.limit || 8)
    const skip = (page - 1) * limit
    const type = data?.type.trim() || 'all'

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const filter = keyword
      ? {
          $or: [
            { permissionCode: { $regex: escapedKeyword, $options: 'i' } },
            { description: { $regex: escapedKeyword, $options: 'i' } }
          ]
        }
      : {}

    const [permissions, totalCount] = await Promise.all([
      PermissionRepo.findManyWithPagination({
        filter,
        skip,
        limit,
        type
      }),
      PermissionRepo.countDocuments({ filter })
    ])

    return {
      permissions: permissions || [],
      totalCount,
      page,
      limit
    }
  }
}
