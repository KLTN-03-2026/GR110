import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { logoutAdminApi } from '~/redux/adminUser/adminSlice'
import { refreshAdminTokenAPI } from '~/apis/adminAuth.api'

let axiosReduxStore

export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

let authorizeAdminAxiosInstance = axios.create()

authorizeAdminAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizeAdminAxiosInstance.defaults.withCredentials = true

authorizeAdminAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise = null

authorizeAdminAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    interceptorLoadingElements(false)

    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutAdminApi(false))
      return Promise.reject(error)
    }

    const originalRequest = error.config
    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAdminTokenAPI()
          .then((data) => {
            console.log('ref token');
            
            return data?.accessTokenAdmin
          })
          .catch(() => {
            axiosReduxStore.dispatch(logoutAdminApi(false))
            return Promise.reject(error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      return refreshTokenPromise.then(() => {
        return authorizeAdminAxiosInstance(originalRequest)
      })
    }

    if (error.response?.status !== 410) {
      error.response?.data?.message
        ? toast.error(error.response.data.message)
        : toast.error(error.message)
    }
    return Promise.reject(error)
  }
)

export default authorizeAdminAxiosInstance
