import { toast } from 'react-toastify'
import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAdminTicketAPI = async ({ search, page, limit }) => {
  const response = await authorizeAdminAxiosInstance.get(`${API_ROOT}/v1/admin/tickets`, {
    params: {
      ...(search ? { search } : {}),
      page,
      limit
    }
  })
  return response.data.metadata
}

export const rejectTicketAPI = async ({ ticketId }) => {
  const response = await authorizeAdminAxiosInstance.patch(
    `${API_ROOT}/v1/admin/tickets/${ticketId}/reject`
  )
return response.data.metadata
}

export const replyTicketAPI = async ({ ticketId, replyContent }) => {
  const response = await authorizeAdminAxiosInstance.patch(
    `${API_ROOT}/v1/admin/tickets/${ticketId}/reply`,
    { replyContent }
  )
  return response.data.metadata
}
