import axiosClient from '@/config/axios'
import { useQuery } from '@tanstack/react-query'

function useBusiness() {
  const getBusinessOptions = useQuery({
    queryKey: ['businessOptions'],
    queryFn: async () => {
      const response = await axiosClient.get('/business/options')
      return response.data
    },
    refetchOnWindowFocus: false,
  })

  const getBusinessByCode = (code: string) =>
    useQuery({
      queryKey: ['businessByCode'],
      queryFn: async () => {
        const response = await axiosClient.get(`/business/${code}`)
        return response.data
      },
      refetchOnWindowFocus: false,
      enabled: false,
    })
  return { getBusinessOptions, getBusinessByCode }
}

export default useBusiness
