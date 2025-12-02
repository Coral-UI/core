import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import MonacoEditor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface CssResetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: string // Current CSS reset value
  onChange?: (value: string) => void // Callback when CSS reset changes
}

// Default modern CSS reset - exported for use in preview components
export const DEFAULT_CSS_RESET = `/* Modern CSS Reset */

/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Prevent font size inflation */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

/* Remove default margin in favour of better control in authored CSS */
body, h1, h2, h3, h4, p,
figure, blockquote, dl, dd {
  margin-block-start: 0;
  margin-block-end: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  line-height: 1.5;
}

/* Set shorter line heights on headings and interactive elements */
h1, h2, h3, h4,
button, input, label {
  line-height: 1.1;
}

/* Balance text wrapping on headings */
h1, h2,
h3, h4 {
  text-wrap: balance;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input, button,
textarea, select {
  font-family: inherit;
  font-size: inherit;
}

/* Make sure textareas without a rows attribute are not tiny */
textarea:not([rows]) {
  min-height: 10em;
}

/* Anything that has been anchored to should have extra scroll margin */
:target {
  scroll-margin-block: 5ex;
}
`

export const CssResetDialog = ({ open, onOpenChange, value = DEFAULT_CSS_RESET, onChange }: CssResetDialogProps) => {
  const { theme } = useTheme()
  const [code, setCode] = useState<string>(value || DEFAULT_CSS_RESET)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize code when dialog opens or value changes externally
  useEffect(() => {
    if (open) {
      const initialValue = value || DEFAULT_CSS_RESET
      setCode(initialValue)
      setHasChanges(false)
    }
  }, [open, value])

  const handleSave = () => {
    if (!code.trim()) {
      toast.error('CSS reset cannot be empty')
      return
    }

    // Call onChange callback if provided
    if (onChange) {
      onChange(code)
    }

    setHasChanges(false)
    onOpenChange(false)
    toast.success('CSS reset updated')
  }

  const handleCancel = () => {
    setCode(value || DEFAULT_CSS_RESET)
    setHasChanges(false)
    onOpenChange(false)
  }

  const handleCodeChange = (newValue: string | undefined) => {
    const updatedValue = newValue || ''
    setCode(updatedValue)
    // Compare against current value
    const currentValue = value || DEFAULT_CSS_RESET
    setHasChanges(updatedValue !== currentValue)
  }

  const handleUseDefault = () => {
    setCode(DEFAULT_CSS_RESET)
    setHasChanges(DEFAULT_CSS_RESET !== (value || DEFAULT_CSS_RESET))
  }

  return (
    <Dialog
      hideTrigger
      open={open}
      onOpenChange={onOpenChange}
      buttonText="CSS Reset"
      title="CSS Reset"
      description="Add custom CSS reset styles that will be applied to the preview pane and included in the generated component"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handleUseDefault}>
            Use Default Reset
          </Button>
        </div>
        <div className="flex-1 min-h-[400px] border border-border rounded-lg overflow-hidden flex flex-col">
          <MonacoEditor
            height={400}
            value={code}
            onChange={handleCodeChange}
            language="css"
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
        {hasChanges && (
          <div className="text-sm text-muted-foreground">You have unsaved changes. Click Save to apply them.</div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
