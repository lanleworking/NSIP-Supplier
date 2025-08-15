import toast from 'react-hot-toast'

interface IErrorRes {
  code: number
  response: any
  message: string
}

export const fetchErrorRes = (error: any) => {
  const er = error as IErrorRes
  console.error(er)
  toast.error(
    `${error?.status || ''} | ${er.response?.data?.message || 'Something went wrong'}`,
  )
}
