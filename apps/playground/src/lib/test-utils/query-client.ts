/**
 * Test QueryClient factory
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Create a QueryClient for testing with disabled retries
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
