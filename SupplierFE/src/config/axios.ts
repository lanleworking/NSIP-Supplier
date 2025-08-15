import { API_URL } from '@/constants/config'
import axios, { type AxiosInstance } from 'axios'

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const code = error.response?.data?.CODE
    if (status === 401) {
      if (code === 'SUPPLIER_INACTIVE') {
        window.location.href = '/not-found'
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
