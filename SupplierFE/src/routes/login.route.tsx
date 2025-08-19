import { LazyComponent } from '@/components/LazyComponent'
import { Login } from '@/pages/auth/Login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LazyComponent>
      <Login />
    </LazyComponent>
  )
}
