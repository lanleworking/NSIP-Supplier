import { Suspense } from 'react'
import { Loading } from '../Loading'

interface LazyComponentProps {
  children: React.ReactNode
}

function LazyComponent({ children }: LazyComponentProps) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default LazyComponent
