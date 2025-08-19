import { API_URL } from '@/constants/config'
import axios, { type AxiosInstance } from 'axios'
import { useLoadingStore } from '../stores/loadingStore'

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().setIsLoading(true)
    return config
  },
  (error) => {
    useLoadingStore.getState().setIsLoading(false)
    return Promise.reject(error)
  },
)

// Add response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setIsLoading(false)
    return response
  },
  (error) => {
    const status = error.response?.status
    const code = error.response?.data?.CODE
    if (status === 401) {
      if (code === 'SUPPLIER_INACTIVE') {
        window.location.href = '/not-found'
      }
    }

    useLoadingStore.getState().setIsLoading(false)
    return Promise.reject(error)
  },
)

export default axiosClient
