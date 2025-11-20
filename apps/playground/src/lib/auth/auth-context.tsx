import type { Session, User } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { useAuth } from './use-auth'

/**
 * AuthProvider component
 *
 * Provides auth state to the application via context
 */

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider component that wraps the app and provides auth state
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
