import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateThemeOption } from '@/hooks/queries/useThemes'
import { useState } from 'react'

interface CreateThemeOptionDialogProps {
  themeId: string
}

export function CreateThemeOptionDialog({ themeId }: CreateThemeOptionDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const createThemeOption = useCreateThemeOption()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createThemeOption.mutateAsync({
        themeId,
        name: name.trim(),
        ...(isDefault && { isDefault: true }),
      })
      setName('')
      setIsDefault(false)
      setOpen(false)
    } catch {
      // Error handling is done in the mutation hook
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      buttonText="Add Option"
      title="Add Theme Option"
      description="Add a new option to this theme"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="light"
            required
            autoFocus
          />
          <p className="text-xs text-muted-foreground">e.g., "light", "dark", "blue", "red"</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="isDefault" className="cursor-pointer">
            Set as default option
          </Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createThemeOption.isPending || !name.trim()}>
            {createThemeOption.isPending ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
