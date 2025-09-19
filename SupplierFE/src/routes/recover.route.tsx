import { ForgotPassword } from '@/pages/auth/ForgotPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recover')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForgotPassword />
}
