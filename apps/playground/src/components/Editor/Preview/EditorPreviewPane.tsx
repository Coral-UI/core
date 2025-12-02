import { DEFAULT_CSS_RESET } from '@/components/Editor/CssResetDialog'
import { HTMLRenderer } from '@/components/Editor/Preview/HTMLRenderer'
import { Button } from '@/components/primitives/Button/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/Tabs/Tabs'
import { ToggleGroup } from '@/components/primitives/ToggleGroup/toggle-group'
import { useSetViewportWidth, useViewportBreakpoint } from '@/hooks/queries/useViewportBreakpoint'
// import { useElementSelectionStore } from '@/stores/useElementSelectionStore'
import { Editor } from '@monaco-editor/react'
import {
  IconBracketsAngle,
  IconCode,
  IconDeviceImac,
  IconDeviceIpad,
  IconDeviceMobile,
  IconEyeSearch,
  IconFileImport,
  IconSchema,
} from '@tabler/icons-react'
import { CopyIcon, Loader2, Redo, SaveIcon, Undo } from 'lucide-react'
import { useTheme } from 'next-themes'
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
  { name: 'Mobile', width: 375, icon: <IconDeviceMobile className="size-3" /> },
  { name: 'Tablet', width: 768, icon: <IconDeviceIpad className="size-3" /> },
  { name: 'Desktop', width: 1440, icon: <IconDeviceImac className="size-3" /> },
]

interface EditorPreviewPaneProps {
  spec: CoralRootNode
  libraryId?: string | null
  setImportDialogOpen: (open: boolean) => void
  setImportSpecDialogOpen: (open: boolean) => void
  setCssResetDialogOpen: (open: boolean) => void
  handleUndo: () => void
  handleRedo: () => void
  handleSave: () => void
  isSaving: boolean
  hasUnsavedChanges: boolean
  componentName: string
  cssReset?: string
}

export const EditorPreviewPane = ({
  spec,
  libraryId: _libraryId,
  setImportDialogOpen,
  setImportSpecDialogOpen,
  setCssResetDialogOpen,
  handleUndo,
  handleRedo,
  handleSave,
  isSaving,
  hasUnsavedChanges,
  cssReset = DEFAULT_CSS_RESET,
}: EditorPreviewPaneProps) => {
  // const selectedElementId = useElementSelectionStore((state) => state.selectedElementId)
  const { theme } = useTheme()
  const [specValue, setSpecValue] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('preview')
  const { data: viewportBreakpointState } = useViewportBreakpoint()
  const viewportWidth = viewportBreakpointState?.viewportWidth ?? VIEWPORT_PRESETS[2]?.width ?? 1440
  const setViewportWidth = useSetViewportWidth()
  const effectiveCssReset = cssReset || DEFAULT_CSS_RESET

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

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <Tabs defaultValue="preview" className="w-full h-full flex" onValueChange={handleTabChange} value={activeTab}>
      <div className="flex items-center justify-between">
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

        <div className="flex items-center gap-2">
          {activeTab === 'preview' && (
            <div className="">
              <ToggleGroup
                value={[viewportWidth.toString()]}
                onValueChange={(value) => {
                  const stringValue = Array.isArray(value) && value.length > 0 ? value[0] : ''
                  if (stringValue) {
                    setViewportWidth.mutate(parseInt(stringValue))
                  }
                }}
                items={VIEWPORT_PRESETS.map((preset) => ({
                  value: preset.width.toString(),
                  ariaLabel: `${preset.name} (${preset.width}px)`,
                  icon: preset.icon,
                }))}
              ></ToggleGroup>
            </div>
          )}

          <Button
            variant="ghost"
            title="Save"
            size="icon-sm"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
          >
            {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <SaveIcon className="size-3.5" />}
            {/* {isSaving ? 'Saving...' : 'Save'} */}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setImportDialogOpen(true)}
            title="Import from Code"
            aria-label="Import from Code"
          >
            <IconFileImport className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setImportSpecDialogOpen(true)}
            title="Import Coral Spec"
            aria-label="Import Coral Spec"
          >
            <IconSchema className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCssResetDialogOpen(true)}
            title="CSS Reset"
            aria-label="CSS Reset"
          >
            <IconCode className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleUndo} title="Undo (⌘Z / Ctrl+Z)">
            <Undo className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleRedo} title="Redo (⌘⇧Z / Ctrl+Y)">
            <Redo className="size-3.5" />
          </Button>
        </div>
      </div>

      <TabsContent value="preview" className="flex flex-col h-full w-full relative px-0 pb-2.5">
        <div className="h-full w-full">
          {spec && spec.name ? (
            <>
              <HTMLRenderer spec={spec} viewportWidth={viewportWidth} cssReset={effectiveCssReset} />
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

      <TabsContent value="spec" className="flex flex-col h-full w-full flex-1 shrink-0 px-0 pb-2.5  pt-1.5">
        <div className="h-full w-full relative flex flex-col ">
          <div className="rounded-xl flex-1 overflow-hidden shadow-popover">
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

      <TabsContent value="code" className="flex flex-col h-full w-full flex-1 shrink-0 px-0 pb-2.5  pt-1.5 ">
        <Sandbox specValue={spec} cssReset={effectiveCssReset} />
      </TabsContent>
    </Tabs>
  )
}
