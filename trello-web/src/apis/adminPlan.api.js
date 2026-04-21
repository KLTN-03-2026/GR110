import { toast } from 'react-toastify'
import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminPlanAPI = async ({ search, page, limit }) => {
  const response = await authorizeAdminAxiosInstance.get(`${API_ROOT}/v1/admin/plans`, {
    params: {
      ...(search ? { search } : {}),
      page,
      limit
    }
  })
  return response.data.metadata
}

export const updateBlockPlanAPI = async ({ planId }) => {
  const response = await authorizeAdminAxiosInstance.patch(`${API_ROOT}/v1/admin/plans/status/${planId}`)
  toast.success('Plan change status successfully!')
  return response.data.metadata
}

export const deleteAdminPlanAPI = async ({ planId }) => {
  const response = await authorizeAdminAxiosInstance.delete(`${API_ROOT}/v1/admin/plans/delete/${planId}`)
  toast.success('Plan deleted successfully!')
  return response.data.metadata
}

export const updateAdminPlanApi = async ({ planId, planData }) => {
  const response = await authorizeAdminAxiosInstance.put(`${API_ROOT}/v1/admin/plans/${planId}`, planData)
  toast.success('Plan updated successfully!')
  return response.data.metadata
}

export const createAdminPlanAPI = async ({ planData }) => {
  const response = await authorizeAdminAxiosInstance.post(`${API_ROOT}/v1/admin/plans`, planData)
  toast.success('Admin plan created successfully!')
  return response.data.metadata
}
