'use client'

import { Button } from '@/components/primitives/Button/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card/card'
import { Input } from '@/components/primitives/Input/input'
import { Label } from '@/components/ui/label'
import { useSignIn, useSignInWithFigma, useSignInWithGoogle } from '@/lib/auth/use-auth'
import { useForm } from '@tanstack/react-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

/**
 * Login form component
 *
 * Provides email/password login and OAuth options (Google, Figma)
 */
export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const { signIn, loading: signInLoading, error: signInError } = useSignIn()
  const { signInWithGoogle, loading: googleLoading } = useSignInWithGoogle()
  const { signInWithFigma, loading: figmaLoading } = useSignInWithFigma()

  const [oauthError, setOauthError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn(value.email, value.password)
        toast.success('Signed in successfully')
        router.push('/')
      } catch (err) {
        // Error is handled by the hook
        const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
        toast.error('Sign in failed', { description: errorMessage })
        throw err
      }
    },
  })

  // Show error from URL search params (e.g., from callback redirect)
  useEffect(() => {
    if (error) {
      toast.error('Authentication error', { description: error })
      // Clear the error from URL
      router.replace('/login')
    }
  }, [error, router])

  const handleGoogleSignIn = async () => {
    try {
      setOauthError(null)
      await signInWithGoogle()
      // Note: signInWithGoogle redirects, so we won't reach here
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google'
      setOauthError(errorMessage)
      toast.error('Google sign in failed', { description: errorMessage })
    }
  }

  const handleFigmaSignIn = async () => {
    try {
      setOauthError(null)
      await signInWithFigma()
      // Note: signInWithFigma redirects, so we won't reach here
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Figma'
      setOauthError(errorMessage)
      toast.error('Figma sign in failed', { description: errorMessage })
    }
  }

  const isLoading = signInLoading || googleLoading || figmaLoading

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={field.state.meta.errors.length > 0}
                  autoFocus
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {typeof field.state.meta.errors[0] === 'string'
                      ? field.state.meta.errors[0]
                      : field.state.meta.errors[0]?.message || 'Invalid value'}
                  </p>
                )}
              </div>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {typeof field.state.meta.errors[0] === 'string'
                      ? field.state.meta.errors[0]
                      : field.state.meta.errors[0]?.message || 'Invalid value'}
                  </p>
                )}
              </div>
            )}
          />
          {(signInError || oauthError) && (
            <div className="text-destructive text-sm">{signInError?.message || oauthError || 'An error occurred'}</div>
          )}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={isLoading || !canSubmit || isSubmitting}>
                {signInLoading || isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            )}
          />
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">Or continue with</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <svg className="mr-2 size-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-2.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleFigmaSignIn} disabled={isLoading}>
            <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.852 8.981h-4.588v-1.536c0-1.378 1.12-2.494 2.5-2.494 1.378 0 2.5 1.116 2.5 2.494v1.536zm-4.588 0H8.148v-1.536c0-1.378 1.12-2.494 2.5-2.494 1.378 0 2.5 1.116 2.5 2.494v1.536zm-3.164 0H4.984c-.552 0-1 .448-1 1v11.536c0 .552.448 1 1 1h3.116c.552 0 1-.448 1-1V9.981c0-.552-.448-1-1-1zm4.588 0c-.552 0-1 .448-1 1v11.536c0 .552.448 1 1 1h3.116c.552 0 1-.448 1-1V9.981c0-.552-.448-1-1-1zm4.588 0c-.552 0-1 .448-1 1v11.536c0 .552.448 1 1 1h3.116c.552 0 1-.448 1-1V9.981c0-.552-.448-1-1-1z" />
            </svg>
            {figmaLoading ? 'Signing in...' : 'Continue with Figma'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Button variant="link" className="h-auto p-0" href="/signup">
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}
