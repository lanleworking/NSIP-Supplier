import MainLayout from '@/layouts/MainLayout/MainLayout'
import { fetchRequestChart } from '@/libs/axios/fetchRequest'
import { RequestList } from '@/pages/main/RequestList'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  loader: async () => {
    const data = await fetchRequestChart()
    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = useLoaderData({
    from: '/',
  })

  useEffect(() => {
    document.title = 'Trang chủ - VasPort'
  }, [])
  return (
    <MainLayout>
      <RequestList chartData={data} />
    </MainLayout>
  )
}
