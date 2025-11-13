import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/Tabs'
import { HTMLRenderer } from '@/components/Editor/Preview/HTMLRenderer'
import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
// import { useElementSelectionStore } from '@/stores/useElementSelectionStore'
import { Editor } from '@monaco-editor/react'
import { IconBracketsAngle, IconEyeSearch, IconSchema } from '@tabler/icons-react'
import { CopyIcon, MonitorIcon, SmartphoneIcon, TabletIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CoralRootNode } from '@reallygoodwork/coral-core'

import { Sandbox } from './Sandbox'

type ViewportPreset = {
  name: string
  width: number
  icon: React.ReactNode
}

const VIEWPORT_PRESETS: ViewportPreset[] = [
  { name: 'Mobile', width: 375, icon: <SmartphoneIcon className="size-3" /> },
  { name: 'Tablet', width: 768, icon: <TabletIcon className="size-3" /> },
  { name: 'Desktop', width: 1440, icon: <MonitorIcon className="size-3" /> },
]

interface EditorPreviewPaneProps {
  spec: CoralRootNode
}

export const EditorPreviewPane = ({ spec }: EditorPreviewPaneProps) => {
  // const selectedElementId = useElementSelectionStore((state) => state.selectedElementId)
  const { theme } = useTheme()
  const [specValue, setSpecValue] = useState<string>('')
  const [viewportWidth, setViewportWidth] = useState<number>(VIEWPORT_PRESETS[2]?.width ?? 1440)

  useEffect(() => {
    setSpecValue(JSON.stringify(spec, null, 2))
  }, [spec])

  const handleSpecChange = (value: string | undefined) => {
    setSpecValue(value || '')
  }

  const handleCopySpec = () => {
    toast.success('Coral spec copied to clipboard')
    navigator.clipboard.writeText(specValue)
  }

  return (
    <Tabs defaultValue="preview" className="w-full h-full">
      <div className="p-2 pb-0">
        <TabsList>
          <TabsTrigger value="preview">
            <IconEyeSearch strokeWidth={1.5} className="size-4" /> Visual Preview
          </TabsTrigger>
          <TabsTrigger value="spec">
            <IconSchema strokeWidth={1.5} className="size-4" /> Coral Spec
          </TabsTrigger>
          <TabsTrigger value="code">
            <IconBracketsAngle strokeWidth={1.5} className="size-4" /> Generated Code
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="preview" className="flex flex-col h-full w-full relative">
        <div className="h-full w-full p-2 bg-bg-primary">
          {spec && spec.name ? (
            <>
              <HTMLRenderer spec={spec} viewportWidth={viewportWidth} />
              <div className="px-2 py-1.5 flex justify-end gap-2 absolute bottom-6 right-6 bg-bg-surface rounded-input border border-border">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  value={viewportWidth.toString()}
                  onValueChange={(value) => setViewportWidth(parseInt(value))}
                >
                  {VIEWPORT_PRESETS.map((preset) => (
                    <ToggleGroupItem
                      size="lg"
                      key={preset.name}
                      value={preset.width.toString()}
                      aria-label={`${preset.name} (${preset.width}px)`}
                    >
                      {preset.icon}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-lg mb-2">No elements created yet</div>
                <div className="text-sm">Add elements using the sidebar to see a preview</div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="spec" className="flex flex-col h-full w-full flex-1 shrink-0">
        <div className="h-full w-full relative p-2 flex flex-col">
          <div className="border border-input rounded-xl flex-1 overflow-hidden">
            <Editor
              value={specValue}
              onChange={handleSpecChange}
              language="json"
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
                readOnly: true,
              }}
            />
          </div>
          <Button variant="secondary" size="icon-lg" onClick={handleCopySpec} className="absolute bottom-4 right-4">
            <CopyIcon />
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="code" className="flex flex-col h-full w-full flex-1 shrink-0">
        <Sandbox specValue={spec} />
      </TabsContent>
    </Tabs>
  )
}
