import { SignupForm } from '@/components/Auth/SignupForm'
import { PublicRouteGuard } from '@/lib/auth/public-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      error: typeof search.error === 'string' ? search.error : undefined,
    }
  },
})

function SignupPage() {
  return (
    <PublicRouteGuard>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <SignupForm />
      </div>
    </PublicRouteGuard>
  )
}
