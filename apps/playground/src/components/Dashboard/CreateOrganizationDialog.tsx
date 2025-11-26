'use client'

import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { Field } from '@/components/primitives/Field/Field'
import { Input } from '@/components/primitives/Input/input'
import { useCreateOrganization } from '@/hooks/queries/useOrganizations'
import { useState } from 'react'

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const createOrganization = useCreateOrganization()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createOrganization.mutateAsync({ name: name.trim() })
      setName('')
      setOpen(false)
    } catch {
      // Error handling is done in the mutation hook
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      buttonText="Create Organization"
      title="Create Organization"
      description="Create a new organization to manage your component libraries"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Organization"
            required
            autoFocus
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createOrganization.isPending || !name.trim()}>
            {createOrganization.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
