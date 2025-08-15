import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { createTheme, MantineProvider } from '@mantine/core'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import './config/chartSetup.ts'
import reportWebVitals from './reportWebVitals.ts'

// mantine css
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import { ConfigProvider } from 'antd'
const theme = createTheme({
  fontFamily: 'GlyphaVO, sans-serif',
  primaryColor: 'primary-color',
  colors: {
    'primary-color': [
      '#eb8023',
      '#eb8023',
      '#eb8023',
      '#eb8023',
      '#eb8023',
      '#eb8023',
      '#eb8023',
      '#eb8023',
      '#eb8023',
      '#eb8023',
    ],
  },
})

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'GlyphaVO, sans-serif',
              colorPrimary: '#eb8023',
            },
          }}
        >
          <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
            <RouterProvider router={router} />
          </TanStackQueryProvider.Provider>
        </ConfigProvider>
      </MantineProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
