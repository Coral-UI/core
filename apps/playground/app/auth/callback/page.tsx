'use client'

import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Auth callback route handler
 *
 * Handles OAuth redirects from providers (Google, Figma)
 * Extracts session tokens from URL and redirects to dashboard
 */
export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from URL hash/fragment
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          router.push(`/login?error=${encodeURIComponent(error.message)}`)
          return
        }

        if (data.session) {
          // Session successfully retrieved, redirect to dashboard
          router.push('/')
        } else {
          // No session found, redirect to login
          router.push('/login')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-lg font-medium">Completing sign in...</div>
        <div className="text-muted-foreground text-sm">Please wait while we redirect you.</div>
      </div>
    </div>
  )
}
