import { LazyComponent } from '@/components/LazyComponent'
import { ResetPassword } from '@/pages/auth/ResetPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reset-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LazyComponent>
      <ResetPassword />
    </LazyComponent>
  )
}
