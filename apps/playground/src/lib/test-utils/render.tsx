/**
 * Custom render function with providers for testing
 */
import type { RenderOptions } from '@testing-library/react'
import { AnalyticsProvider } from '@/lib/analytics/analytics-context'
import { AuthProvider } from '@/lib/auth/auth-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { type ReactElement } from 'react'

import { createTestQueryClient } from './query-client'

interface AllTheProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
}

function AllTheProviders({ children, queryClient }: AllTheProvidersProps): JSX.Element {
  const client = queryClient !== undefined ? queryClient : createTestQueryClient()

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

/**
 * Custom render function that includes all providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient },
): ReturnType<typeof render> {
  const { queryClient, ...renderOptions } = options ?? {}
  return render(ui, {
    wrapper: ({ children }) => {
      if (queryClient !== undefined) {
        return <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
      }
      return <AllTheProviders>{children}</AllTheProviders>
    },
    ...renderOptions,
  })
}

// Re-export types and utilities from @testing-library/react, but use our custom render
export type { RenderOptions } from '@testing-library/react'
export { customRender as render }
