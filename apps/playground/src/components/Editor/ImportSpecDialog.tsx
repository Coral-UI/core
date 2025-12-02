import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import MonacoEditor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'

import { CoralRootNode } from '@reallygoodwork/coral-core'

interface ImportSpecDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (spec: CoralRootNode) => void
}

export const ImportSpecDialog = ({ open, onOpenChange, onImport }: ImportSpecDialogProps) => {
  const { theme } = useTheme()
  const [code, setCode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleImport = () => {
    if (!code.trim()) {
      toast.error('Please paste a Coral spec JSON')
      return
    }

    try {
      const parsed = JSON.parse(code.trim())

      // Basic validation - check if it looks like a CoralRootNode
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid spec format')
      }

      // Validate it has required fields for a CoralRootNode
      if (!parsed.elementType && !parsed.name) {
        throw new Error('Spec must have elementType or name')
      }

      setError(null)
      onImport(parsed as CoralRootNode)
      setCode('')
      onOpenChange(false)
      toast.success('Spec imported successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON format'
      setError(errorMessage)
      toast.error(`Failed to import spec: ${errorMessage}`)
    }
  }

  const handleCancel = () => {
    setCode('')
    setError(null)
    onOpenChange(false)
  }

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '')
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  return (
    <Dialog
      hideTrigger
      open={open}
      onOpenChange={onOpenChange}
      buttonText="Import Spec"
      title="Import Coral Spec"
      description="Paste your Coral spec JSON below to import it and overwrite the current spec"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex-1 min-h-[400px] border border-border rounded-lg overflow-hidden flex flex-col">
          <MonacoEditor
            height={400}
            value={code}
            onChange={handleCodeChange}
            language="json"
            theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
            options={{
              minimap: {
                enabled: false,
              },
              lineNumbers: 'on',
              fontSize: 12,
              wordWrap: 'on',
              useTabStops: false,
              tabSize: 2,
              contextmenu: false,
            }}
          />
        </div>
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!code.trim()}>
            Import
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
