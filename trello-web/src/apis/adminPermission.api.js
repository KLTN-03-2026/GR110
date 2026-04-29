import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminPermissionAPI = async ({ search, page, limit, type }) => {
  const response = await authorizeAdminAxiosInstance.get(`${API_ROOT}/v1/admin/permissions`, {
    params: {
      ...(search ? { search } : {}),
      page,
      limit,
      type
    }
  })
  return response.data.metadata
}
