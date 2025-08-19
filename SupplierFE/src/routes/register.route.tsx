import { LazyComponent } from '@/components/LazyComponent'
import { Register } from '@/pages/auth/Register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LazyComponent>
      <Register />
    </LazyComponent>
  )
}
