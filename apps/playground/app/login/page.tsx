'use client'

import { LoginForm } from '@/components/Auth/LoginForm'
import { PublicRouteGuard } from '@/lib/auth/public-route-guard'

export default function LoginPage() {
  return (
    <PublicRouteGuard>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    </PublicRouteGuard>
  )
}
