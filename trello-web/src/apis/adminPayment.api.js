import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminPaymentAPI = async ({ search, page, limit, gateway }) => {
  const response = await authorizeAdminAxiosInstance.get(`${API_ROOT}/v1/admin/payments`, {
    params: {
      ...(search ? { search } : {}),
      page,
      limit,
      gateway
    }
  })
  return response.data.metadata
}

export const fetchAdminPaymentTransactionAPI = async ({ paymentId }) => {
  const response = await authorizeAdminAxiosInstance.get(
    `${API_ROOT}/v1/admin/payments/${paymentId}/transaction`
  )

  return response.data.metadata
}
