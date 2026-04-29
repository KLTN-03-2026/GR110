import AdminPaymentRepo from '~/repo/adminPayment.repo'

class AdminPaymentService {
  static fetchByPayment = async ({ data }) => {
    const keyword = data?.search?.trim() || ''
    const gateway = data?.gateway || 'all'
    const page = Number(data?.page || 1)
    const limit = Number(data?.limit || 8)
    const skip = (page - 1) * limit

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const filter = {
      ...(keyword
        ? {
            $or: [
              { workSpaceTile: { $regex: escapedKeyword, $options: 'i' } },
              { gateway: { $regex: escapedKeyword, $options: 'i' } },
              { planTitle: { $regex: escapedKeyword, $options: 'i' } }
            ]
          }
        : {}),
      ...(gateway !== 'all' ? { gateway } : {})
    }

    const [payments, totalCount] = await Promise.all([
      AdminPaymentRepo.findManyWithPagination({
        filter,
        skip,
        limit
      }),
      AdminPaymentRepo.countDocuments({ filter })
    ])

    return {
      payments,
      totalCount,
      page,
      limit
    }
  }
}

export default AdminPaymentService
