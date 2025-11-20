import { AuthGuard } from '@/lib/auth/auth-guard'
import { useAuthContext } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase/client'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name must be less than 100 characters').optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: (user?.user_metadata?.full_name as string) || '',
    },
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: value.displayName || null,
          },
        })

        if (error) {
          throw error
        }

        toast.success('Profile updated successfully')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
        toast.error('Update failed', { description: errorMessage })
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.setFieldValue('displayName', (user.user_metadata?.full_name as string) || '')
    }
  }, [user, form])

  if (!user) {
    return null
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ''} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <form.Field
                name="displayName"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Display Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !form.state.isValid}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
