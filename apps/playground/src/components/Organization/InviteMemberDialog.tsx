'use client'

import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { Field } from '@/components/primitives/Field/Field'
import { Input } from '@/components/primitives/Input/input'
import { SelectInput } from '@/components/primitives/Select/select'
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
      onSubmit: inviteSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        // API endpoint not available in standalone/Vite mode
        toast.error('Invitations are not available in standalone mode', {
          description: 'This feature requires server-side API endpoints',
        })
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
            <Field
              label="Email"
              error={field.state.meta.errors.length > 0 ? field.state.meta.errors[0]?.message : undefined}
            >
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
            </Field>
          )}
        />

        <form.Field
          name="role"
          children={(field) => (
            <Field label="Role" error={field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : undefined}>
              <SelectInput
                size="sm"
                id={field.name}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as 'admin' | 'editor' | 'viewer')}
                items={[
                  { label: 'Viewer', value: 'viewer' },
                  { label: 'Editor', value: 'editor' },
                  { label: 'Admin', value: 'admin' },
                ]}
              />
            </Field>
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
