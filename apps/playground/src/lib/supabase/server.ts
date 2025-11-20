/**
 * Supabase server client for Server Components and Server Actions
 *
 * Creates a Supabase client for use in Server Components, Route Handlers, and Server Actions.
 * This client handles cookies properly for SSR.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from './database.types'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
    )
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        // Server Components are read-only, mutations should use middleware or Route Handlers
        // This will log a warning if mutations occur
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}
