import axiosClient from '@/config/axios'
import type {
  IPage,
  IPageParams,
  IRequestConfirm,
  IRequestFile,
  IRequestItem,
  IRequestPrice,
} from '@/interfaces/data'
import { useMutation, useQuery } from '@tanstack/react-query'

export interface IRequestListQuery {
  requests: IRequestConfirm[]
  page: IPage
}

export type RequestListFilter = {
  requestId?: number
  request?: string
  timeLimit?: string
  isConfirmed?: number
  approvalStatus?: number
}

export type RequestItemFilterType = {
  item?: string
}

export type RequestSearchParams = IPageParams & RequestListFilter

export interface IRequestItemListQuery {
  confirmAt?: string
  data: IRequestItem[]
  files: IRequestFile[]
  isDisable?: boolean
}

function useRequest() {
  const requestListQuery = (filters: RequestSearchParams) =>
    useQuery<IRequestListQuery>({
      queryKey: ['requestList', filters],
      queryFn: async () => {
        const response = await axiosClient.get('/request/getAll', {
          params: filters,
        })
        return response.data
      },
      enabled: !!filters,
      refetchOnWindowFocus: false,
    })

  const requestItemListQuery = (
    requestId: number | undefined,
    filters?: RequestItemFilterType,
  ) =>
    useQuery<IRequestItemListQuery>({
      queryKey: ['requestItemList', requestId, filters],
      queryFn: async () => {
        const response = await axiosClient.get(`/request/get/${requestId}`, {
          params: filters,
        })
        return response.data
      },
      enabled: !!requestId,
      refetchOnWindowFocus: false,
    })

  const migrateRequestItemPrice = (requestItemId: number | undefined) =>
    useMutation({
      mutationKey: ['migrateRequestItemPrice'],
      mutationFn: async (price: IRequestPrice) => {
        const response = await axiosClient.post(
          `/request/migrate/${requestItemId}`,
          price,
        )
        return response.data
      },
    })

  return {
    requestListQuery,
    requestItemListQuery,
    migrateRequestItemPrice,
  }
}

export default useRequest
