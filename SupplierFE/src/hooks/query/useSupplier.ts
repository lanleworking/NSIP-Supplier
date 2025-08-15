import axiosClient from '@/config/axios'
import type { ISupplier } from '@/interfaces/data'
import { useMutation } from '@tanstack/react-query'

function useSupplier() {
  const updateSupplierInfo = useMutation<ISupplier, Error, ISupplier>({
    mutationFn: async (payload: ISupplier) => {
      const response = await axiosClient.put<ISupplier>(
        '/supplier/update',
        payload,
      )
      return response.data
    },
  })

  const updateSupplierPass = useMutation({
    mutationFn: async (payload: { oldPass: string; newPass: string }) => {
      const response = await axiosClient.put(
        '/supplier/update/password',
        payload,
      )
      return response.data
    },
  })
  return { updateSupplierInfo, updateSupplierPass }
}

export default useSupplier
