/**
 * Local type definitions for Supabase types
 * These are minimal types needed for the app to work without importing @supabase packages
 */

export interface User {
  id: string
  email?: string
  [key: string]: unknown
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
  [key: string]: unknown
}

export interface SupabaseClient<T = any> {
  auth: {
    getUser: () => Promise<{ data: { user: User | null }; error: Error | null }>
    getSession: () => Promise<{ data: { session: Session | null }; error: Error | null }>
    signOut: () => Promise<{ error: Error | null }>
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }>
    signUp: (credentials: { email: string; password: string }) => Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }>
    signInWithOAuth: (options: { provider: string; options?: { redirectTo?: string } }) => Promise<{ error: Error | null }>
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      data: { subscription: { unsubscribe: () => void } }
      error: Error | null
    }
  }
  from: (table: string) => any
  rpc: (fn: string, args?: any) => Promise<{ data: any; error: Error | null }>
}
