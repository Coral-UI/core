/**
 * Supabase browser client for Client Components
 *
 * Creates a Supabase client for use in Client Components.
 * Environment variables should be set in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * In standalone/Vite mode, returns a mock client that doesn't connect to Supabase.
 */

import type { Database } from './database.types'

// Check if we're in standalone/Vite mode (no process.env available)
const isStandaloneMode = typeof process === 'undefined' || typeof process.env === 'undefined'

// Mock Supabase client for standalone mode
const createMockQueryBuilder = () => ({
  select: () => ({
    eq: () => createMockQueryBuilder(),
    neq: () => createMockQueryBuilder(),
    gt: () => createMockQueryBuilder(),
    gte: () => createMockQueryBuilder(),
    lt: () => createMockQueryBuilder(),
    lte: () => createMockQueryBuilder(),
    like: () => createMockQueryBuilder(),
    ilike: () => createMockQueryBuilder(),
    is: () => createMockQueryBuilder(),
    in: () => createMockQueryBuilder(),
    contains: () => createMockQueryBuilder(),
    containedBy: () => createMockQueryBuilder(),
    rangeGt: () => createMockQueryBuilder(),
    rangeGte: () => createMockQueryBuilder(),
    rangeLt: () => createMockQueryBuilder(),
    rangeLte: () => createMockQueryBuilder(),
    rangeAdjacent: () => createMockQueryBuilder(),
    overlaps: () => createMockQueryBuilder(),
    textSearch: () => createMockQueryBuilder(),
    match: () => createMockQueryBuilder(),
    not: () => createMockQueryBuilder(),
    or: () => createMockQueryBuilder(),
    filter: () => createMockQueryBuilder(),
    order: () => createMockQueryBuilder(),
    limit: () => createMockQueryBuilder(),
    range: () => createMockQueryBuilder(),
    abortSignal: () => createMockQueryBuilder(),
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    csv: () => Promise.resolve({ data: '', error: null }),
    geojson: () => Promise.resolve({ data: null, error: null }),
    explain: () => Promise.resolve({ data: null, error: null }),
    rollback: () => createMockQueryBuilder(),
    returns: () => createMockQueryBuilder(),
    then: (onResolve?: (value: any) => any) => {
      const result = { data: [], error: null }
      return onResolve ? Promise.resolve(onResolve(result)) : Promise.resolve(result)
    },
  }),
  insert: () => ({
    select: () => Promise.resolve({ data: null, error: null }),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (onResolve?: (value: any) => any) => {
      const result = { data: null, error: null }
      return onResolve ? Promise.resolve(onResolve(result)) : Promise.resolve(result)
    },
  }),
  update: () => ({
    eq: () => createMockQueryBuilder(),
    select: () => Promise.resolve({ data: null, error: null }),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (onResolve?: (value: any) => any) => {
      const result = { data: null, error: null }
      return onResolve ? Promise.resolve(onResolve(result)) : Promise.resolve(result)
    },
  }),
  upsert: () => ({
    select: () => Promise.resolve({ data: null, error: null }),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (onResolve?: (value: any) => any) => {
      const result = { data: null, error: null }
      return onResolve ? Promise.resolve(onResolve(result)) : Promise.resolve(result)
    },
  }),
  delete: () => ({
    eq: () => createMockQueryBuilder(),
    then: (onResolve?: (value: any) => any) => {
      const result = { data: null, error: null }
      return onResolve ? Promise.resolve(onResolve(result)) : Promise.resolve(result)
    },
  }),
})

const mockClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
      error: null,
    }),
  },
  from: () => createMockQueryBuilder(),
  rpc: () => Promise.resolve({ data: null, error: null }),
} as any

let supabaseClient: any

if (isStandaloneMode) {
  // Use mock client for standalone/Vite mode
  supabaseClient = mockClient
} else {
  // Real Supabase client for Next.js mode
  try {
    const { createBrowserClient } = require('@supabase/ssr')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // Fall back to mock if env vars are missing
      supabaseClient = mockClient
    } else {
      supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    }
  } catch {
    // Fall back to mock if @supabase/ssr is not available
    supabaseClient = mockClient
  }
}

export const supabase = supabaseClient
