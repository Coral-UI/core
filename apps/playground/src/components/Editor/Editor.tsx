import { EditorPreviewPane } from '@/components/Editor/EditorPreviewPane'
import { EditorSidebar } from '@/components/Editor/EditorSidebar'
import { ElementProperties } from '@/components/Editor/ElementProperties'
import { ImportCodeDialog } from '@/components/Editor/ImportCodeDialog'
import { useElementTree } from '@/hooks/useElementTree'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Undo, Redo, FileCode } from 'lucide-react'
import { toast } from 'sonner'

import { CoralRootNode, transformHTMLToSpec } from '@reallygoodwork/coral-core'
import { Badge } from '../ui/badge'

export const Editor = () => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const elementTreeHook = useElementTree()
  const { elements, updateElement, getElementTree, selectElement, undo, redo, canUndo, canRedo } = elementTreeHook

  const selectedElement = selectedElementId ? elements.find((el) => el.id === selectedElementId) : null
  const elementTree = getElementTree()

  const convertToCoralSpec = (): CoralRootNode => {
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
    <div className="flex flex-col h-screen pt-12">
      <div className="flex items-center justify-between gap-2 px-4 py-1 border-b border-border bg-sidebar">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            Component Name
          </p>
          <Badge variant="secondary">Unsaved</Badge>
        </div>
        <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setImportDialogOpen(true)}
          title="Import from Code"
        >
          <FileCode className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </Button>
        </div>
      </div>
      <div className="flex flex-row flex-1 overflow-hidden">
        <div className="w-64 border-r border-border bg-sidebar">
          <EditorSidebar onElementSelect={handleElementSelect} elementTreeHook={elementTreeHook} />
        </div>
        <div className="flex-1 p-2 bg-background">
          <EditorPreviewPane spec={spec} onElementClick={handleElementSelect} selectedElementId={selectedElementId} />
        </div>
        <div className="w-64 border-l border-border bg-sidebar">
          <ElementProperties element={selectedElement || null} onUpdateElement={updateElement} />
        </div>
      </div>
      <ImportCodeDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImport={handleImportCode} />
    </div>
  )
}
