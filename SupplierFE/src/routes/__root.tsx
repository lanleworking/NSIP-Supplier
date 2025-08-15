import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import AuthProvider from '@/providers/Auth/AuthProvider'
import { Toaster } from 'react-hot-toast'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <AuthProvider>
        <Toaster />
        <Outlet />
      </AuthProvider>
    </>
  ),
})
