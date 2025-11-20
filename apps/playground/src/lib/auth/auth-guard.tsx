'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthContext } from './auth-context'

/**
 * Route protection component
 *
 * Redirects unauthenticated users to login
 */

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

/**
 * Component that protects routes requiring authentication
 */
export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps): JSX.Element {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Redirecting to login...</div>
  }

  return <>{children}</>
}
