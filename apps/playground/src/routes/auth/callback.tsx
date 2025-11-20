import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { supabase } from '@/lib/supabase/client'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

/**
 * Auth callback route handler
 *
 * Handles OAuth redirects from providers (Google, Figma)
 * Extracts session tokens from URL and redirects to dashboard
 */
function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from URL hash/fragment
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          navigate({ to: '/login', search: { error: error.message } })
          return
        }

        if (data.session) {
          // Session successfully retrieved, redirect to dashboard
          navigate({ to: '/' })
        } else {
          // No session found, redirect to login
          navigate({ to: '/login' })
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        navigate({ to: '/login' })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-lg font-medium">Completing sign in...</div>
        <div className="text-muted-foreground text-sm">Please wait while we redirect you.</div>
      </div>
    </div>
  )
}
