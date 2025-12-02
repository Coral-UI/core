/**
 * Custom hook for auth state
 */

import type { Session, User } from '@/lib/supabase/types'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

/**
 * Hook to get current auth state
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      })
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return state
}

/**
 * Hook to sign in with email and password
 */
export function useSignIn() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { signIn, loading, error }
}

/**
 * Hook to sign up with email and password
 */
export function useSignUp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signUp = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        throw signUpError
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { signUp, loading, error }
}

/**
 * Hook to sign out
 */
export function useSignOut() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signOut = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        throw signOutError
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { signOut, loading, error }
}

/**
 * Hook to sign in with Google OAuth
 */
export function useSignInWithGoogle() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Mock OAuth - not available in standalone mode
      throw new Error('OAuth not available in standalone mode')
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      setLoading(false)
      throw error
    }
  }

  return { signInWithGoogle, loading, error }
}

/**
 * Hook to sign in with Figma OAuth
 */
export function useSignInWithFigma() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signInWithFigma = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Mock OAuth - not available in standalone mode
      throw new Error('OAuth not available in standalone mode')
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      setLoading(false)
      throw error
    }
  }

  return { signInWithFigma, loading, error }
}
