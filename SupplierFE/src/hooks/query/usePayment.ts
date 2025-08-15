import axiosClient from '@/config/axios'
import type { ComboboxData } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'

function usePayment() {
  const paymentOptionQuery = useQuery<ComboboxData>({
    queryKey: ['payment'],
    queryFn: async () => {
      const response = await axiosClient.get('/payment/get-options')
      return response.data
    },
    enabled: true,
    refetchOnWindowFocus: false,
  })

  return { paymentOptionQuery }
}

export default usePayment
