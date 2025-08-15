import axiosClient from '@/config/axios'

export const fetchAllPayment = async () => {
  const res = await axiosClient.get('/payment/get-all')
  return res.data
}
