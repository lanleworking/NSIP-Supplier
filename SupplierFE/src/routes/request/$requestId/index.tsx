import { LazyComponent } from '@/components/LazyComponent'
import { fetchAllPayment } from '@/libs/axios/fetchPayment'
import { RequestItem } from '@/pages/main/RequestItem'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/request/$requestId/')({
  loader: async () => {
    const payments = await fetchAllPayment()
    return payments
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = useLoaderData({
    from: '/request/$requestId/',
  })

  return (
    <LazyComponent>
      <RequestItem paymentList={data} />
    </LazyComponent>
  )
}
