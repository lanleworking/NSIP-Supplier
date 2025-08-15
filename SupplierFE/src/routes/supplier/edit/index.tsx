import { SupplierInformationEdit } from '@/pages/main/SupplierInformationEdit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/supplier/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SupplierInformationEdit />
}
