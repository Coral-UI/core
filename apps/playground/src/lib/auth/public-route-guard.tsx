'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthContext } from './auth-context'

/**
 * Public route guard component
 *
 * Redirects authenticated users away from public routes (login/signup)
 */
interface PublicRouteGuardProps {
  children: ReactNode
  redirectTo?: string
}

export function PublicRouteGuard({ children, redirectTo = '/' }: PublicRouteGuardProps): JSX.Element {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <div>Redirecting...</div>
  }

  return <>{children}</>
}
