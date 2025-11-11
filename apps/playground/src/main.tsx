import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtools } from '@tanstack/react-form-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/ibm-plex-mono/400.css'
// Supports weights 100-700
import '@fontsource-variable/ibm-plex-sans'
import '@fontsource-variable/figtree'

import { routeTree } from './routeTree.gen'

import './index.css'

import { ThemeProvider } from './components/ThemeProvider'
import { getPlatform } from './lib/adapters'

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // For client-side state, data never goes stale
      gcTime: Infinity, // Keep data in cache indefinitely
    },
  },
})

// Log platform on startup
console.log(`🚀 Coral Playground running on: ${getPlatform()}`)

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="coral-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
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
