import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { Input } from '@/components/primitives/Input/input'
import { Label } from '@/components/ui/label'
import { useCreateComponent } from '@/hooks/queries/useComponents'
import { useState } from 'react'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

interface CreateComponentDialogProps {
  libraryId: string
}

export function CreateComponentDialog({ libraryId }: CreateComponentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createComponent = useCreateComponent()

  const createDefaultSpec = (): CoralRootNode => {
    return {
      name: 'root',
      elementType: 'div',
      type: 'NODE',
      children: [],
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const trimmedDescription = description.trim()
      await createComponent.mutateAsync({
        libraryId,
        name: name.trim(),
        ...(trimmedDescription && { description: trimmedDescription }),
        spec: createDefaultSpec(),
      })
      setName('')
      setDescription('')
      setOpen(false)
    } catch {
      // Error handling is done in the mutation hook
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      buttonText="Create Component"
      title="Create Component"
      description="Create a new component to start designing"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Component"
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A description of this component"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createComponent.isPending || !name.trim()}>
            {createComponent.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
