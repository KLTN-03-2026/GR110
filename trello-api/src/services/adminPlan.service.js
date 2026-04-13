import { ObjectId } from 'mongodb'
import { NotFoundErrorResponse } from '~/core/error.response'
import PlanRepo from '~/repo/adminPlan.repo'

class AdminPlanService {
  static fetchByPlan = async ({ data }) => {
    const keyword = data?.search?.trim() || ''
    const page = Number(data?.page || 1)
    const limit = Number(data?.limit || 8)
    const skip = (page - 1) * limit

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const filter = {
        isDeleted: false,
        ...(keyword && {
        $or: [{ title: { $regex: escapedKeyword, $options: 'i' } }]
        })
    }

    const [plans, totalCount] = await Promise.all([
      PlanRepo.findManyWithPagination({
        filter,
        skip,
        limit
      }),
      PlanRepo.countDocuments({ filter })
    ])

    return {
      plans,
      totalCount,
      page,
      limit
    }
  }

  static updateBlockPlan = async ({ planId }) => {
    const plan = await PlanRepo.findById({ _id: planId })
    if (!plan) throw new NotFoundErrorResponse('Plan not found!')

    const updatedPlan = await PlanRepo.updateById({
      _id: planId,
      data: {
        status: plan.status === 'active' ? 'inactive' : 'active',
      }
    })
    return updatedPlan
  }

  static deleteAdminPlan = async ({ planId }) => {
    const plan = await PlanRepo.findById({ _id: planId })
    if (!plan) throw new NotFoundErrorResponse('Plan not found!')

    const deletedPlan = await PlanRepo.updateById({
      _id: planId,
      data: {
        isDeleted: true
      }
    })
    return deletedPlan
  }

  static updateAdminPlan = async ({ _id, data }) => {
    const plan = await PlanRepo.findById({ _id })
    if (!plan) throw new NotFoundErrorResponse('Plan not found!')

    const updatedPlan = await PlanRepo.updateById({
      _id: new ObjectId(_id),
      data: data
    })
    return updatedPlan
  }

  static createAdminPlan = async ({ planData }) => {
    const dataPlan = {
      ...planData,
      isDeleted: false
    }
    const newPlan = await PlanRepo.createOne({ data: dataPlan })
    return newPlan
  }
}
export default AdminPlanService
