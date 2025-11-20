'use client'

import { SignupForm } from '@/components/Auth/SignupForm'
import { PublicRouteGuard } from '@/lib/auth/public-route-guard'

export default function SignupPage() {
  return (
    <PublicRouteGuard>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <SignupForm />
      </div>
    </PublicRouteGuard>
  )
}

