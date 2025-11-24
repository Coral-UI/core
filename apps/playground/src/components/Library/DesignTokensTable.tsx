import type { DesignToken, Theme } from '@/types'
import { Button } from '@/components/primitives/Button/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteToken } from '@/hooks/queries/useTokens'
import { useTokenValue } from '@/hooks/queries/useTokenValues'
import { useThemeOptions } from '@/hooks/queries/useThemes'
import { Trash2Icon } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { TokenValueEditor } from './TokenValueEditor'

interface DesignTokensTableProps {
  tokens: DesignToken[]
  libraryId: string
  themes: Theme[]
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
    // Try to parse as hex color
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

export function DesignTokensTable({ tokens, libraryId, themes }: DesignTokensTableProps) {
  const deleteToken = useDeleteToken()
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [selectedThemeOptionId, setSelectedThemeOptionId] = useState<string | null>(null)

  // Find the first theme with options, or use the first theme
  const selectedTheme = useMemo(() => {
    if (selectedThemeId) {
      return themes.find((t) => t.id === selectedThemeId) || themes[0] || null
    }
    return themes[0] || null
  }, [themes, selectedThemeId])

  const { data: themeOptions = [] } = useThemeOptions(selectedTheme?.id || '')

  // Find default option or use first option
  const selectedThemeOption = useMemo(() => {
    if (selectedThemeOptionId) {
      return themeOptions.find((opt) => opt.id === selectedThemeOptionId) || null
    }
    if (themeOptions.length === 0) return null
    return themeOptions.find((opt) => opt.isDefault) || themeOptions[0] || null
  }, [themeOptions, selectedThemeOptionId])

  // Update selected theme option when theme changes
  useEffect(() => {
    if (selectedTheme && themeOptions.length > 0) {
      const defaultOption = themeOptions.find((opt) => opt.isDefault) || themeOptions[0]
      if (defaultOption) {
        setSelectedThemeOptionId(defaultOption.id)
      }
    }
  }, [selectedTheme?.id, themeOptions])

  const handleDelete = (token: DesignToken) => {
    if (confirm(`Are you sure you want to delete token "${token.name}"?`)) {
      deleteToken.mutate({ id: token.id, libraryId })
    }
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No tokens yet. Create your first token to get started.</p>
      </div>
    )
  }

  // Show tokens even without themes, but show a message about needing themes for values
  const hasThemeAndOptions = selectedTheme && themeOptions.length > 0

  return (
    <div className="space-y-4">
      {!hasThemeAndOptions && (
        <div className="rounded-md border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-400">
          <p>
            <strong>Note:</strong> Create a theme and add options to set values for your tokens. Tokens are displayed below.
          </p>
        </div>
      )}

      {/* Theme Selector */}
      {hasThemeAndOptions && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Theme:</span>
          <select
            value={selectedTheme?.id || ''}
            onChange={(e) => setSelectedThemeId(e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>

          {themeOptions.length > 0 && (
            <>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">Option:</span>
              {themeOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedThemeOption?.id === option.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedThemeOptionId(option.id)}
                >
                  {option.name}
                  {option.isDefault && <span className="ml-1 text-xs">(default)</span>}
                </Button>
              ))}
            </>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              {hasThemeAndOptions ? `Value (${selectedThemeOption?.name || '—'})` : 'Value'}
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TokenRow
              key={token.id}
              token={token}
              themeOptionId={hasThemeAndOptions ? selectedThemeOption?.id || '' : ''}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TokenRow({
  token,
  themeOptionId,
  onDelete,
}: {
  token: DesignToken
  themeOptionId: string
  onDelete: (token: DesignToken) => void
}) {
  const { data: tokenValue } = useTokenValue(token.id, themeOptionId)

  return (
    <TableRow>
      <TableCell className="font-medium">{token.name}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">{token.$type || '—'}</span>
      </TableCell>
      <TableCell>
        {tokenValue ? (
          <TokenValueEditor
            token={token}
            themeOptionId={themeOptionId}
            initialValue={tokenValue.$value}
          />
        ) : (
          <TokenValueEditor
            token={token}
            themeOptionId={themeOptionId}
            initialValue={undefined}
          />
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(token)}
          className="shrink-0"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
