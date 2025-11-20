/**
 * Typed query helpers for Supabase
 *
 * Provides type-safe wrappers around Supabase queries
 */

import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

type Client = SupabaseClient<Database>

/**
 * Typed select helper that ensures type safety
 * Note: This is a convenience function - Supabase client already provides typed queries
 */
export function typedSelect<T extends keyof Database['public']['Tables']>(
  client: Client,
  table: T,
): ReturnType<Client['from']> {
  return client.from(table) as ReturnType<Client['from']>
}

/**
 * Helper to extract single row from Supabase response
 * Throws if no row is found
 */
export function extractSingle<T>(data: T[] | null, error: Error | null): T {
  if (error) {
    throw error
  }
  if (!data || data.length === 0) {
    throw new Error('No data returned from query')
  }
  return data[0]
}

/**
 * Helper to extract single row from Supabase response (nullable)
 * Returns null if no row is found
 */
export function extractSingleOrNull<T>(data: T[] | null, error: Error | null): T | null {
  if (error) {
    throw error
  }
  if (!data || data.length === 0) {
    return null
  }
  return data[0]
}

/**
 * Helper to extract array from Supabase response
 * Returns empty array if null
 */
export function extractArray<T>(data: T[] | null, error: Error | null): T[] {
  if (error) {
    throw error
  }
  return data ?? []
}

/**
 * Type guard for Supabase error
 */
export function isSupabaseError(error: unknown): error is { message: string; code?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}
