import Unauthorize from '@/pages/not-found/Unauthorize'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/not-found')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Unauthorize />
}
