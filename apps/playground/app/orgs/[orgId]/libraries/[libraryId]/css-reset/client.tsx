'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/primitives/Button/button'
import { useUpdateLibraryCssReset } from '@/hooks/queries/useLibraries'
import { libraryCssResetQueryOptions, libraryQueryOptions } from '@/lib/queries/query-options'
import MonacoEditor from '@monaco-editor/react'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = {
  orgId: string
  libraryId: string
}

export function CssResetClient({ orgId, libraryId }: Props) {
  const { theme } = useTheme()
  const { data: library } = useSuspenseQuery(libraryQueryOptions(libraryId))
  const { data: cssReset = '' } = useSuspenseQuery(libraryCssResetQueryOptions(libraryId))
  const updateCssReset = useUpdateLibraryCssReset()

  const [cssValue, setCssValue] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize CSS value when data loads
  useEffect(() => {
    if (cssReset !== undefined) {
      setCssValue(cssReset)
      setHasChanges(false)
    }
  }, [cssReset])

  // Track changes
  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || ''
    setCssValue(newValue)
    setHasChanges(newValue !== cssReset)
  }

  const handleSave = () => {
    updateCssReset.mutate(
      { libraryId, css: cssValue },
      {
        onSuccess: () => {
          setHasChanges(false)
        },
      },
    )
  }

  if (!library) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Library not found</div>
        <Link href={`/orgs/${orgId}`}>
          <Button variant="outline" className="mt-4">
            Back to Organization
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <Breadcrumbs className="mb-4" />
      <PageHeader title="CSS Reset" description="Add custom CSS reset styles that will be applied to the preview pane">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateCssReset.isPending}
          className="flex items-center gap-2"
        >
          <IconDeviceFloppy size={16} />
          {updateCssReset.isPending ? 'Saving...' : 'Save'}
        </Button>
      </PageHeader>

      <div className="mt-6 border border-border rounded-lg overflow-hidden">
        <MonacoEditor
          height="calc(100vh - 300px)"
          value={cssValue}
          onChange={handleEditorChange}
          language="css"
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          options={{
            minimap: {
              enabled: false,
            },
            lineNumbers: 'on',
            fontSize: 14,
            wordWrap: 'on',
            useTabStops: false,
            tabSize: 2,
            contextmenu: false,
            scrollBeyondLastLine: false,
            padding: {
              top: 16,
              bottom: 16,
            },
          }}
        />
      </div>

      {hasChanges && (
        <div className="mt-4 text-sm text-muted-foreground">
          You have unsaved changes. Click Save to apply them to the preview pane.
        </div>
      )}
    </div>
  )
}
