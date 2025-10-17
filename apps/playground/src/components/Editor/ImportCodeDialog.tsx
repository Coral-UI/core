import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import MonacoEditor from '@monaco-editor/react'
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import from Code</DialogTitle>
          <DialogDescription>Paste your HTML code below to import it into the editor</DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!code.trim()}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
