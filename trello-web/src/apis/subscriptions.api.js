import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const createWorkspacePayment = async ({ workspaceId, planId }) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/subscriptions/${workspaceId}/payment/${planId}`
  )
  return response.data.metadata
}

export const fetchPayment = async ({ subscriptionId }) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/subscriptions/${subscriptionId}`
  )
  return response.data.metadata
}

export const createOrderPal = async ({ subscriptionId, payment }) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/subscriptions/createOrder/paypal/${subscriptionId}`, payment
  )
  return response.data.metadata
}

export const captureOrderPal = async ({ subscriptionId, orderID }) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/subscriptions/captureOrderPal/paypal/${subscriptionId}`, { orderID }
  )
  return response.data.metadata
}

export const selectWorkspaceFreePlan = async ({ workspaceId, planId }) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/subscriptions/${workspaceId}/free/${planId}`
  )
  toast.success('Your workspace has been switched to the Free plan successfully!')
  return response.data.metadata
}