import type { DesignToken } from '@/types'
import { Input } from '@/components/ui/input'
import { useSetTokenValue } from '@/hooks/queries/useTokenValues'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TokenValueEditorProps {
  token: DesignToken
  themeOptionId: string
  initialValue?: string | number
}

function formatValue(value: string | number, type?: string): string {
  if (typeof value === 'number') {
    return String(value)
  }
  return value
}

function ValueDisplay({ value, type }: { value: string | number; type?: string }) {
  const formattedValue = formatValue(value, type)

  if (type === 'color' && typeof value === 'string') {
    const colorValue = value.startsWith('#') ? value : `#${value}`
    return (
      <div className="flex items-center gap-2">
        <div
          className="size-4 rounded border border-border"
          style={{ backgroundColor: colorValue }}
        />
        <span className="font-mono text-sm">{formattedValue}</span>
      </div>
    )
  }

  return <span className="font-mono text-sm">{formattedValue}</span>
}

export function TokenValueEditor({ token, themeOptionId, initialValue }: TokenValueEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState<string>(initialValue !== undefined ? String(initialValue) : '')
  const setTokenValue = useSetTokenValue()

  useEffect(() => {
    setValue(initialValue !== undefined ? String(initialValue) : '')
  }, [initialValue])

  const handleSave = async () => {
    if (!value.trim() || !themeOptionId) {
      setIsEditing(false)
      return
    }

    const parsedValue = token.$type === 'number' ? Number(value) : value.trim()

    try {
      await setTokenValue.mutateAsync({
        tokenId: token.id,
        themeOptionId,
        $value: parsedValue,
      })
      setIsEditing(false)
    } catch {
      // Error handling is done in the mutation hook
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setValue(initialValue !== undefined ? String(initialValue) : '')
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type={token.$type === 'color' ? 'color' : token.$type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn('h-8 w-32', token.$type === 'color' && 'w-20')}
          autoFocus
        />
      </div>
    )
  }

  if (!themeOptionId) {
    return <span className="text-muted-foreground text-sm">Create a theme option to set values</span>
  }

  if (initialValue === undefined) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-muted-foreground hover:text-foreground text-sm italic"
      >
        Click to set value
      </button>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="text-left hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
    >
      <ValueDisplay value={initialValue} type={token.$type} />
    </button>
  )
}
