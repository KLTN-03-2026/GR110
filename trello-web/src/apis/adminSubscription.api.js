import { toast } from 'react-toastify'
import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminSubscriptionAPI = async ({ search, page, limit }) => {
  const response = await authorizeAdminAxiosInstance.get(`${API_ROOT}/v1/admin/subscriptions`, {
    params: {
      ...(search ? { search } : {}),
      page,
      limit
    }
  })
  return response.data.metadata
}

export const updateAdminSubscriptionApi = async ({ subscriptionId, subscriptionData }) => {
  const response = await authorizeAdminAxiosInstance.put(`${API_ROOT}/v1/admin/subscriptions/${subscriptionId}`, subscriptionData)
  toast.success('Subscriptions updated successfully!')
  return response.data.metadata
}

export const cancelAdminSubscriptionApi = async ({ subscriptionId, subscriptionData}) => {
  const response = await authorizeAdminAxiosInstance.patch(`${API_ROOT}/v1/admin/subscriptions/${subscriptionId}`, subscriptionData)
  toast.success('Subscriptions cancelled successfully!')
  return response.data.metadata
}


