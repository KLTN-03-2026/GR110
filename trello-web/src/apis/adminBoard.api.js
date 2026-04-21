import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminBoardAPI = async ({ search, page, limit }) => {
  const response = await authorizeAdminAxiosInstance.get(`${API_ROOT}/v1/admin/boards`, {
    params: {
      ...(search ? { search } : {}),
      page,
      limit
    }
  })
  return response.data.metadata
}
