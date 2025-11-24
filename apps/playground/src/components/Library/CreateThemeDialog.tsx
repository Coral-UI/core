import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { Input } from '@/components/primitives/Input/input'
import { Label } from '@/components/ui/label'
import { useCreateTheme } from '@/hooks/queries/useThemes'
import { useState } from 'react'

interface CreateThemeDialogProps {
  libraryId: string
}

export function CreateThemeDialog({ libraryId }: CreateThemeDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createTheme = useCreateTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createTheme.mutateAsync({
        libraryId,
        name: name.trim(),
        ...(description.trim() && { description: description.trim() }),
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
      buttonText="Create Theme"
      title="Create Theme"
      description="Create a new theme to organize token values"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mode"
            required
            autoFocus
          />
          <p className="text-xs text-muted-foreground">e.g., "mode", "brand", "size"</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A description of this theme"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createTheme.isPending || !name.trim()}>
            {createTheme.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
