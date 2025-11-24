'use client'

import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { Input } from '@/components/primitives/Input/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/Select/select'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  role: z.enum(['admin', 'editor', 'viewer']),
})

interface InviteMemberDialogProps {
  organizationId: string
}

export function InviteMemberDialog({ organizationId }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
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
        // Call API endpoint (auth handled via cookies in middleware)
        const response = await fetch('/api/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
                <p className="text-sm text-destructive">
                  {typeof field.state.meta.errors[0] === 'string'
                    ? field.state.meta.errors[0]
                    : field.state.meta.errors[0]?.message || 'Invalid value'}
                </p>
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
