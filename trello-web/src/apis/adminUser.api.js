import { toast } from 'react-toastify'
import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminUsersAPI = async ({ search, page, limit, role }) => {
  const response = await authorizeAdminAxiosInstance.get(`${API_ROOT}/v1/admin/users`, {
    params: {
      ...(search ? { search } : {}),
      page,
      limit,
      role
    }
  })
  return response.data.metadata
}

export const updateBlockUserAPI = async ({ userId }) => {
  const response = await authorizeAdminAxiosInstance.patch(`${API_ROOT}/v1/admin/users/block/${userId}`)
  toast.success('User change status successfully!')
  return response.data.metadata
}

export const updateAdminUserApi = async ({ userId, userData }) => {
  const response = await authorizeAdminAxiosInstance.put(`${API_ROOT}/v1/admin/users/${userId}`, userData)
  toast.success('User updated successfully!')
  return response.data.metadata
}

export const createAdminAccountAPI = async ({ userData }) => {
  const response = await authorizeAdminAxiosInstance.post(`${API_ROOT}/v1/admin/users`, userData)
  toast.success('Admin account created successfully!')
  return response.data.metadata
}

export const deleteAdminAccountAPI = async ({ userId }) => {
  const response = await authorizeAdminAxiosInstance.delete(`${API_ROOT}/v1/admin/users/${userId}`)
  toast.success('Admin account deleted successfully!')
  return response.data.metadata
}
