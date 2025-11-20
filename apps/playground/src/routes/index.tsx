import { Dashboard } from '@/components/Dashboard/Dashboard'
import { AuthGuard } from '@/lib/auth/auth-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
