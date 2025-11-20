import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    required_error: 'Please select a role',
  }),
})

type InviteFormValues = z.infer<typeof inviteSchema>

interface InviteMemberDialogProps {
  organizationId: string
}

export function InviteMemberDialog({ organizationId }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<InviteFormValues>({
    defaultValues: {
      email: '',
      role: 'viewer',
    },
    validators: {
      onChange: inviteSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        // Get auth token
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.access_token) {
          throw new Error('Not authenticated')
        }

        // Call API endpoint
        const response = await fetch('/api/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            organizationId,
            email: value.email,
            role: value.role,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to send invitation')
        }

        toast.success('Invitation sent successfully')
        form.reset()
        setOpen(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation'
        toast.error('Failed to send invitation', { description: errorMessage })
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <Dialog
      buttonText="Invite Member"
      title="Invite Member"
      description="Send an invitation to join this organization"
      open={open}
      onOpenChange={setOpen}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
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
                placeholder="user@example.com"
                aria-invalid={field.state.meta.errors.length > 0}
                autoFocus
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        <form.Field
          name="role"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Role</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as 'admin' | 'editor' | 'viewer')}
              >
                <SelectTrigger id={field.name} aria-invalid={field.state.meta.errors.length > 0}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !form.state.isValid}>
            {isSubmitting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
