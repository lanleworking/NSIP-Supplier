import axiosClient from '@/config/axios'
import { PUBLIC_ROUTES } from '@/constants/routers'
import Loading from '@/layouts/Loading/Loading'
import { AuthContext } from '@/providers/Auth/AuthContext'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [curSupplier, setCurSupplier] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const router = useRouter()
  const location = router?.state?.location?.pathname || ''

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(location)

    if (!curSupplier) {
      const urlParams = new URLSearchParams(window.location.search)
      const redirectPath = urlParams.get('redirect')
      setCurSupplier(null)
      axiosClient
        .get('/auth/me')
        .then((data) => {
          setCurSupplier(data.data)
          if (redirectPath && !isPublic) {
            navigate({ to: redirectPath, replace: true })
          } else if (isPublic) {
            navigate({ to: '/', replace: true })
          }
        })
        .catch(() => {
          setCurSupplier(null)
          if (!isPublic) {
            navigate({ to: '/login', replace: true })
          }
        })
        .finally(() => setTimeout(() => setLoading(false), 300))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ curSupplier, loading, setCurSupplier }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}
export default AuthProvider
