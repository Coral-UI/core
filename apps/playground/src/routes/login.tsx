import { LoginForm } from '@/components/Auth/LoginForm'
import { PublicRouteGuard } from '@/lib/auth/public-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      error: typeof search.error === 'string' ? search.error : undefined,
    }
  },
})

function LoginPage() {
  return (
    <PublicRouteGuard>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    </PublicRouteGuard>
  )
}
