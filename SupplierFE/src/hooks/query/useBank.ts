import axiosClient from '@/config/axios'
import { useQuery } from '@tanstack/react-query'

function useBank() {
  const getBankOptions = useQuery({
    queryKey: ['bankOptions'],
    queryFn: async () => {
      const response = await axiosClient.get('/bank/options')

      return response.data
    },
    refetchOnWindowFocus: false,
  })
  return { getBankOptions }
}

export default useBank
