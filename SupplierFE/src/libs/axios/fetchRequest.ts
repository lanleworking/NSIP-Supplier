import axiosClient from '@/config/axios'

export const fetchRequestChart = async () => {
  const response = await axiosClient.get('/request/sentChartData')
  return response.data
}
