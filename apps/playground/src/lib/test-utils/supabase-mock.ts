/**
 * Mock Supabase client factory for testing
 */

import type { Database } from '@/lib/supabase/database.types'
import type { SupabaseClient } from '@/lib/supabase/types'

/**
 * Create a mock Supabase client for testing
 *
 * This is a minimal mock that can be extended with specific behaviors
 * for individual tests.
 */
export function createMockSupabaseClient(): Partial<SupabaseClient<Database>> {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    rpc: () => ({
      single: () => Promise.resolve({ data: null, error: null }),
    }),
  } as unknown as Partial<SupabaseClient<Database>>
}
