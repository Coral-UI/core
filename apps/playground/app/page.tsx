'use client'

import { Dashboard } from '@/components/Dashboard/Dashboard'
import { AuthGuard } from '@/lib/auth/auth-guard'

export default function HomePage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
