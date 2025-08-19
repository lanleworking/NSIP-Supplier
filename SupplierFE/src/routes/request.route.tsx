import { LazyComponent } from '@/components/LazyComponent'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/request')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LazyComponent>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </LazyComponent>
  )
}
