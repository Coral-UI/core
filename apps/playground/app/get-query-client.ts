import { QueryClient } from '@tanstack/react-query'

/**
 * Creates a new QueryClient instance for server-side use.
 * This should be used in Server Components for prefetching data.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  })
}
