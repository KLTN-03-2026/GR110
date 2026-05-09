import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchPlanApi = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/landing-page/plan`)
  return response.data.metadata
}
