import type { ISupplier } from '@/interfaces/data'
import { createContext } from 'react'

export type AuthContextType = {
  curSupplier: ISupplier | null
  loading: boolean
  setCurSupplier: (supplier: any) => void
}

export const AuthContext = createContext<AuthContextType>({
  curSupplier: null,
  loading: true,
  setCurSupplier: () => {},
})
