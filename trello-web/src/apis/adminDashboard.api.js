import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminDashboardOverviewAPI = async ({ fromDate, toDate }) => {
  const response = await authorizeAdminAxiosInstance.get(
    `${API_ROOT}/v1/admin/dashboard/overview`,
    {
      params: {
        fromDate,
        toDate
      }
    }
  )

  return response.data.metadata
}
