import axiosClient from '@/config/axios'
import { useMutation } from '@tanstack/react-query'

function useConfirm() {
  const confirmRequestPrice = (requestItemId: number | undefined) =>
    useMutation({
      mutationKey: ['confirmRequestPrice', requestItemId],
      mutationFn: async (requestItemId: number | undefined) => {
        if (!requestItemId) throw new Error('Request item ID is required')
        const response = await axiosClient.post(`/confirm/${requestItemId}`)
        return response.data
      },
    })
  return { confirmRequestPrice }
}

export default useConfirm
