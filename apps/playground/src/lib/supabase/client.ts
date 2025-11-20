/**
 * Supabase browser client for Client Components
 *
 * Creates a Supabase client for use in Client Components.
 * Environment variables should be set in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
  )
}

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
