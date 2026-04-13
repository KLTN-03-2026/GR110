import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const refreshAdminTokenAPI = async () => {
  const response = await authorizeAdminAxiosInstance.put(
    `${API_ROOT}/v1/admin/refresh_token`
  )
  return response.data.metadata
}