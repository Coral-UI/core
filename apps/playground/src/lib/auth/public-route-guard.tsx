import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: redirectTo })
    }
  }, [user, loading, navigate, redirectTo])

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <div>Redirecting...</div>
  }

  return <>{children}</>
}
