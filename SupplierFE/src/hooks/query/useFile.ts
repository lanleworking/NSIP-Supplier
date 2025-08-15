import axiosClient from '@/config/axios'
import { useMutation } from '@tanstack/react-query'

function useFile() {
  const uploadFileMutation = useMutation({
    mutationFn: async (payload: {
      files: File[]
      requestId: number
      removeFileIds: number[] | undefined
    }) => {
      const res = await axiosClient.post('/file/upload', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    },
  })
  const removeFileMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const res = await axiosClient.delete(`/file/remove/${fileId}`)
      return res.data
    },
  })
  return { uploadFileMutation, removeFileMutation }
}

export default useFile
