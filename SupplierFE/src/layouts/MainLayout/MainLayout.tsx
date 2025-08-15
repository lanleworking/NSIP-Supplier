import { AppShell } from '@mantine/core'
import { Header } from '../Header'
import { HEADER_HEIGHT } from '@/constants/layout'

type MainLayoutProps = {
  children: React.ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <AppShell
      header={{
        height: HEADER_HEIGHT,
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

export default MainLayout
