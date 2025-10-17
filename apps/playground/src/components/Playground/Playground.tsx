import { useTheme } from '@/components/ThemeProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import MonacoEditor from '@monaco-editor/react'
import { CopyIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { transformHTMLToSpec } from '@reallygoodwork/coral-core'
import { coralToHTML } from '@reallygoodwork/coral-to-html'
import { transformReactComponentToSpec } from '@reallygoodwork/react-to-coral'

function Playground() {
  const { theme } = useTheme()
  const [inputValue, setInputValue] = React.useState<string>('')
  const [specValue, setSpecValue] = React.useState<string>('')
  const [_outputValue, setOutputValue] = React.useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('html')

  const handleSpecChange = async (value: string | undefined) => {
    if (!value) return
    setSpecValue(value)
  }

  const handleInputChange = async (value: string | undefined) => {
    if (!value) return
    try {
      setInputValue(value.length > 0 ? value : '')
      if (selectedLanguage === 'html' && value.length > 0) {
        const spec = transformHTMLToSpec(value)
        const html = await coralToHTML(spec)
        setOutputValue(html)
        setSpecValue(JSON.stringify(spec, null, 2))
        toast.success('HTML converted to CoralUI spec')
      } else if (selectedLanguage === 'react' && value.length > 0) {
        const spec = transformReactComponentToSpec(value)
        setSpecValue(JSON.stringify(spec, null, 2))
        const html = await coralToHTML(spec)
        setOutputValue(html)
        toast.success('React component converted to CoralUI spec')
      } else {
        setSpecValue('')
      }
    } catch (error: unknown) {
      toast.error((error as Error).toString())
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setInputValue('')
    setSpecValue('')
  }

  const onCopySpec = () => {
    navigator.clipboard.writeText(specValue)
    toast.success('Spec copied to clipboard')
  }

  return (
    <div className="flex flex-col h-screen bg-background font-sans pt-12">
      <div className="px-4 w-full mx-auto flex flex-col flex-1">
        <div className="flex flex-col flex-1 max-h-[100dvh] mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2  h-full overflow-hidden ">
            <div className="flex flex-col overflow-auto">
              <header className="flex items-center justify-between px-4">
                <h2 className="text-xl font-medium tracking-tight text-foreground">Input</h2>
                <ToggleGroup
                  size="sm"
                  type="single"
                  value={selectedLanguage}
                  onValueChange={handleLanguageChange}
                  defaultValue="html"
                  variant="outline"
                >
                  <ToggleGroupItem value="html">HTML</ToggleGroupItem>
                  <ToggleGroupItem value="react">React</ToggleGroupItem>
                </ToggleGroup>
              </header>
              <div className="mt-2 mb-6 flex flex-col flex-1 max-h-[80dvh] ">
                <div className="flex-1 flex flex-col shrink-0 overflow-hidden rounded-l-lg border border-border">
                  <MonacoEditor
                    value={inputValue}
                    onChange={handleInputChange}
                    language={selectedLanguage === 'html' ? 'html' : 'tsx'}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    options={{
                      minimap: {
                        enabled: false,
                      },
                      lineNumbers: 'on',
                      fontSize: 11,
                      wordWrap: 'on',
                      useTabStops: false,
                      tabSize: 2,
                      contextmenu: false,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col overflow-auto">
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium tracking-tight text-foreground">Converted Spec</h2>
                  <Badge variant="outline">JSON</Badge>
                </div>
                <Button variant="secondary" size="icon" onClick={onCopySpec}>
                  <CopyIcon />
                </Button>
              </header>
              <div className="mt-2 mb-6 flex flex-col flex-1 max-h-[80dvh] ">
                <div className="flex-1 flex flex-col shrink-0 overflow-hidden border border-border  border-l-0 rounded-r-lg bg-surface">
                  <MonacoEditor
                    value={specValue}
                    onChange={handleSpecChange}
                    language={'json'}
                    // height={height}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    options={{
                      minimap: {
                        enabled: false,
                      },
                      padding: {
                        top: 10,
                        bottom: 10,
                      },
                      lineNumbers: 'on',
                      fontSize: 11,
                      wordWrap: 'on',
                      useTabStops: false,
                      tabSize: 2,
                      contextmenu: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Playground
