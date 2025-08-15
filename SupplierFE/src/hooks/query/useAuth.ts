import axiosClient from '@/config/axios'
import { useMutation } from '@tanstack/react-query'

type LoginPayloadType = {
  LoginName: string
  SupplierPass: string
}

export type RegisterPayloadType = LoginPayloadType & {
  CompanyName: string
  PhoneNumber: string
  Email: string
  RepresentativeName: string
  ReenterSupplierPass: string
}

function useAuth() {
  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayloadType) => {
      const response = await axiosClient.post('/auth/login', payload)
      return response.data
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayloadType) => {
      const response = await axiosClient.post('/auth/register', payload)
      return response.data
    },
  })

  const logOutMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post('/auth/logout')
      return response.data
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload: { LoginName: string }) => {
      const response = await axiosClient.post('/auth/recover', payload)
      return response.data
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: { SupplierPass: string; token?: string }) => {
      const response = await axiosClient.put('/auth/reset-password', payload)
      return response.data
    },
  })
  return {
    loginMutation,
    registerMutation,
    logOutMutation,
    resetPasswordMutation,
    forgotPasswordMutation,
  }
}

export default useAuth
