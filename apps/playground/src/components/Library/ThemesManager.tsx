import type { Theme, ThemeOption } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateThemeOptionDialog } from '@/components/Library/CreateThemeOptionDialog'
import { useDeleteTheme, useDeleteThemeOption, useThemeOptions, useUpdateThemeOption } from '@/hooks/queries/useThemes'
import { Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemesManagerProps {
  themes: Theme[]
  libraryId: string
}

export function ThemesManager({ themes, libraryId }: ThemesManagerProps) {
  const deleteTheme = useDeleteTheme()
  const deleteThemeOption = useDeleteThemeOption()

  const handleDeleteTheme = (theme: Theme) => {
    if (confirm(`Are you sure you want to delete theme "${theme.name}"? This will delete all theme options and token values for this theme.`)) {
      deleteTheme.mutate({ id: theme.id, libraryId })
    }
  }

  const handleDeleteThemeOption = (option: ThemeOption, theme: Theme) => {
    if (confirm(`Are you sure you want to delete option "${option.name}"? This will delete all token values for this option.`)) {
      deleteThemeOption.mutate({ id: option.id, themeId: theme.id })
    }
  }

  if (themes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No themes yet. Create your first theme to organize token values.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          libraryId={libraryId}
          onDelete={handleDeleteTheme}
          onDeleteOption={handleDeleteThemeOption}
        />
      ))}
    </div>
  )
}

function ThemeCard({
  theme,
  libraryId: _libraryId,
  onDelete,
  onDeleteOption,
}: {
  theme: Theme
  libraryId: string
  onDelete: (theme: Theme) => void
  onDeleteOption: (option: ThemeOption, theme: Theme) => void
}) {
  const { data: options = [] } = useThemeOptions(theme.id)
  const updateThemeOption = useUpdateThemeOption()

  const defaultOptionId = options.find((opt) => opt.isDefault)?.id || ''

  const handleDefaultChange = (optionId: string) => {
    if (optionId === defaultOptionId) return

    // Set the selected option as default
    updateThemeOption.mutate({
      id: optionId,
      input: { isDefault: true },
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{theme.name}</CardTitle>
            {theme.description && <CardDescription className="mt-1">{theme.description}</CardDescription>}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(theme)} className="shrink-0">
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Options</h4>
            <CreateThemeOptionDialog themeId={theme.id} />
          </div>

          {options.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor={`default-${theme.id}`} className="text-xs text-muted-foreground">
                  Default option:
                </label>
                <select
                  id={`default-${theme.id}`}
                  value={defaultOptionId}
                  onChange={(e) => handleDefaultChange(e.target.value)}
                  className={cn(
                    'flex h-7 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs',
                    'focus-visible:border-popover-foreground focus-visible:ring-popover-foreground focus-visible:ring-[3px]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'appearance-none',
                  )}
                >
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">No options yet. Add an option to get started.</p>
          ) : (
            <div className="space-y-1">
              {options.map((option) => (
                <div key={option.id} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{option.name}</span>
                    {option.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Default</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDeleteOption(option, theme)}
                    className="shrink-0"
                  >
                    <Trash2Icon className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
