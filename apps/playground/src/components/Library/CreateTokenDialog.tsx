import type { DesignTokenType } from '@/types'
import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { SelectInput } from '@/components/primitives/Select/select'
import { Input } from '@/components/primitives/Input/input'
import { Field } from '@/components/primitives/Field/Field'
import { useCreateToken } from '@/hooks/queries/useTokens'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CreateTokenDialogProps {
  libraryId: string
}

const TOKEN_TYPES: { value: DesignTokenType; label: string }[] = [
  { value: 'color', label: 'Color' },
  { value: 'dimension', label: 'Dimension' },
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
]

export function CreateTokenDialog({ libraryId }: CreateTokenDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<DesignTokenType | ''>('string' as DesignTokenType | '')
  const [description, setDescription] = useState('')
  const createToken = useCreateToken()

  const validateName = (tokenName: string): boolean => {
    // DTCG spec: no $, {, }, . characters
    return !tokenName.includes('$') && !tokenName.includes('{') && !tokenName.includes('}') && !tokenName.includes('.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !type) return

    if (!validateName(name.trim())) {
      alert('Token name cannot contain $, {, }, or . characters')
      return
    }

    try {
      await createToken.mutateAsync({
        libraryId,
        name: name.trim(),
        $type: type as DesignTokenType,
        ...(description.trim() && { $description: description.trim() }),
      })
      setName('')
      setType('')
      setDescription('')
      setOpen(false)
    } catch {
      // Error handling is done in the mutation hook
    }
  }

  const isFormValid = name.trim() && type && validateName(name.trim())

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      buttonText="Create Token"
      title="Create Design Token"
      description="Create a new design token. You can set values for different theme options after creating the token."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" className="space-y-2" error={name.trim() && !validateName(name.trim()) ? 'Token name cannot contain $, {, }, or . characters' : undefined} description="Cannot contain $, {'{'}, {'}'}, or . characters">

          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="primary-color"
            required
            autoFocus
          />

        </Field>

        <Field label="Type" className="space-y-2"  description="The type of the token">

          <SelectInput
            id="type"
            value={type}
            onValueChange={(value) => setType(value as DesignTokenType | '')}
            items={TOKEN_TYPES.map((option) => ({ label: option.label, value: option.value }))}
          />

        </Field>

        <Field label="Description (optional)" className="space-y-2" description="A description of the token">

          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A description of this token"
          />
        </Field>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createToken.isPending || !isFormValid}>
            {createToken.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
