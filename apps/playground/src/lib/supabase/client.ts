/**
 * Supabase browser client for Client Components
 *
 * Mock client for standalone/Vite mode - no Supabase imports
 */

import type { Database } from './database.types'

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
    signInWithOAuth: async () => ({ error: new Error('OAuth not available in standalone mode') }),
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

// Always use mock client in Vite/standalone mode
export const supabase = mockClient
