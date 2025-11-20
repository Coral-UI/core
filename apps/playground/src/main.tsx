import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtools } from '@tanstack/react-form-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource-variable/geist'

// Supports weights 100-700

import { routeTree } from './routeTree.gen'

import './index.css'

import { ThemeProvider } from './components/ThemeProvider'
import { getPlatform } from './lib/adapters'
import { AuthProvider } from './lib/auth/auth-context'
import { AnalyticsProvider } from './lib/analytics/analytics-context'

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute - data is fresh for 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
      retry: 1,
    },
  },
})

// Log platform on startup
console.log(`🚀 Coral Playground running on: ${getPlatform()}`)

// Create a new router instance with context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AnalyticsProvider>
          <ThemeProvider defaultTheme="dark" storageKey="coral-ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </AnalyticsProvider>
      </AuthProvider>
      <TanStackDevtools
        plugins={[
          {
            name: 'FormDevtoolsPlugin',
            render: <FormDevtools />,
            defaultOpen: false,
          },
          {
            name: 'ReactQueryDevtoolsPanel',
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: false,
          },
          {
            name: 'TanStackRouterDevtoolsPanel',
            render: <TanStackRouterDevtoolsPanel router={router} />,
            defaultOpen: false,
          },
        ]}
      />
    </QueryClientProvider>
  </StrictMode>,
)
