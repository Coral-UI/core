import { Breadcrumbs } from '@/components/Breadcrumbs'
import { LoadingContent } from '@/components/LoadingContent'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useLibrary, useLibraryCssReset, useUpdateLibraryCssReset } from '@/hooks/queries/useLibraries'
import { useTheme } from '@/components/ThemeProvider'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { IconDeviceFloppy } from '@tabler/icons-react'

export const Route = createFileRoute('/orgs/$orgId/libraries/$libraryId/css-reset')({
  component: CssResetRoute,
})

function CssResetRoute() {
  const { orgId, libraryId } = Route.useParams()
  const { theme } = useTheme()
  const { data: library, isLoading: libLoading } = useLibrary(libraryId)
  const { data: cssReset = '', isLoading: cssLoading } = useLibraryCssReset(libraryId)
  const updateCssReset = useUpdateLibraryCssReset()

  const [cssValue, setCssValue] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize CSS value when data loads
  useEffect(() => {
    if (!cssLoading && cssReset !== undefined) {
      setCssValue(cssReset)
      setHasChanges(false)
    }
  }, [cssReset, cssLoading])

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

  if (libLoading || cssLoading) {
    return <LoadingContent type="libraries" />
  }

  if (!library) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Library not found</div>
        <Link to="/orgs/$orgId" params={{ orgId }}>
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
      <PageHeader
        title="CSS Reset"
        description="Add custom CSS reset styles that will be applied to the preview pane"
      >
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
