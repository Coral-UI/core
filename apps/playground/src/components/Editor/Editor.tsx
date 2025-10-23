import { Badge } from '@/components/base/Badge'
import { Button } from '@/components/base/Button'
import { EditorPreviewPane } from '@/components/Editor/EditorPreviewPane'
import { EditorSidebar } from '@/components/Editor/EditorSidebar'
import { ElementProperties } from '@/components/Editor/ElementProperties'
import { ImportCodeDialog } from '@/components/Editor/ImportCodeDialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useElementTree } from '@/hooks/useElementTree'
import { IconFileImport } from '@tabler/icons-react'
import { Redo, Undo } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CoralRootNode, transformHTMLToSpec } from '@reallygoodwork/coral-core'

export const Editor = () => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const elementTreeHook = useElementTree()
  const { elements, updateElement, getElementTree, selectElement, undo, redo, canUndo, canRedo } = elementTreeHook

  const selectedElement = selectedElementId ? elements.find((el) => el.id === selectedElementId) : null

  const convertToCoralSpec = (): CoralRootNode => {
    // Get fresh element tree on each render
    const elementTree = getElementTree()

    if (elementTree.length === 0) {
      return {
        name: 'root',
        elementType: 'div',
        type: 'NODE',
        children: [],
      } as CoralRootNode
    }

    const buildCoralNode = (element: any): any => {
      const node = {
        id: element.id, // Preserve ID for click handlers
        name: element.name,
        elementType: element.elementType,
        type: element.type || 'NODE',
        textContent: element.textContent,
        description: element.description,
        elementAttributes: element.elementAttributes,
        styles: element.styles, // Include styles in the coral spec
        responsiveStyles: element.responsiveStyles, // Include responsive styles
        children: element.children?.length > 0 ? element.children.map(buildCoralNode) : undefined,
      }

      return Object.fromEntries(Object.entries(node).filter(([_, value]) => value !== undefined))
    }

    if (elementTree.length === 1) {
      return buildCoralNode(elementTree[0]) as CoralRootNode
    }

    return {
      name: 'root',
      elementType: 'div',
      type: 'NODE',
      children: elementTree.map(buildCoralNode),
    } as CoralRootNode
  }

  // Force re-render when elements change
  const spec = convertToCoralSpec()

  const handleElementSelect = (elementId: string | null) => {
    selectElement(elementId)
    setSelectedElementId(elementId)
  }

  const handleImportCode = (code: string) => {
    try {
      const spec = transformHTMLToSpec(code)

      // Convert the coral spec to ElementTreeNode format
      const convertCoralToElements = (node: any, parentId?: string): any[] => {
        const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const element: any = {
          id,
          parentId,
          name: node.name || node.elementType,
          elementType: node.elementType,
          type: node.type || 'NODE',
          textContent: node.textContent,
          elementAttributes: node.elementAttributes,
          styles: node.styles,
          responsiveStyles: node.responsiveStyles,
          isExpanded: true,
        }

        let allElements = [element]

        if (node.children && node.children.length > 0) {
          node.children.forEach((child: any) => {
            const childElements = convertCoralToElements(child, id)
            allElements = [...allElements, ...childElements]
          })
        }

        return allElements
      }

      const newElements = convertCoralToElements(spec)

      // Replace all elements with the imported ones
      elementTreeHook.clearHistory()
      elementTreeHook.elements.splice(0, elementTreeHook.elements.length, ...newElements)

      toast.success('Component imported successfully')
    } catch (error) {
      toast.error(`Failed to import: ${(error as Error).message}`)
    }
  }

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        if (canUndo) undo()
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        if (canRedo) redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  return (
    <div className="flex h-dvh pt-10">
      <aside className="max-w-64 bg-sidebar">
        <div className="flex items-center justify-between gap-2 p-2 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium">Name</p>
            <Badge variant="secondary">Unsaved</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => setImportDialogOpen(true)}
              title="Import from Code"
              aria-label="Import from Code"
            >
              <IconFileImport className="size-3.5" />
            </Button>
            <Button variant="secondary" size="icon-sm" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              <Undo className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
              <Redo className="size-3.5" />
            </Button>
          </div>
        </div>
        <EditorSidebar onElementSelect={handleElementSelect} elementTreeHook={elementTreeHook} />
      </aside>
      <div className="flex-1 bg-background h-full">
        <EditorPreviewPane spec={spec} onElementClick={handleElementSelect} selectedElementId={selectedElementId} />
      </div>
      <aside className="bg-sidebar max-w-96 w-full">
        <ElementProperties element={selectedElement || null} onUpdateElement={updateElement} />
      </aside>

      <ImportCodeDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImport={handleImportCode} />
    </div>
  )
}
