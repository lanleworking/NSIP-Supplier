import { useLoadingStore } from '@/stores/loadingStore'
import { useEffect } from 'react'

export const useGlobalLoading = (isLoading: boolean) => {
  const setIsLoading = useLoadingStore((state) => state.setIsLoading)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])
}
