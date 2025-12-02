import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import MonacoEditor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

interface ImportCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (code: string) => void
}

export const ImportCodeDialog = ({ open, onOpenChange, onImport }: ImportCodeDialogProps) => {
  const { theme } = useTheme()
  const [code, setCode] = useState<string>('')

  const handleImport = () => {
    if (code.trim()) {
      onImport(code)
      setCode('')
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setCode('')
    onOpenChange(false)
  }

  return (
    <Dialog
      hideTrigger
      open={open}
      onOpenChange={onOpenChange}
      buttonText="Import from Code"
      title="Import from Code"
      description="Paste your HTML code below to import it into the editor"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex-1 min-h-[400px] border border-border rounded-lg overflow-hidden flex flex-col">
          <MonacoEditor
            height={400}
            value={code}
            onChange={(value) => setCode(value || '')}
            language="html"
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
