import { toast } from 'react-toastify'
import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchTicketsAPI = async ({
  search = '',
  page = 1,
  limit = 3,
  status = 'all',
  type = 'all'
}) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/tickets`, {
    params: {
      search,
      page,
      limit,
      status,
      type
    }
  })

  return response.data.metadata
}

export const createTicketApi = async ({ ticketData }) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/tickets`, ticketData)
  toast.success('Ticket created successfully!')
  return response.data.metadata
}
