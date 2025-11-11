import { EditorSidebar } from '@/components/Editor/ElementTree/EditorSidebar'
import { ImportCodeDialog } from '@/components/Editor/ImportCodeDialog'
import { EditorPreviewPane } from '@/components/Editor/Preview/EditorPreviewPane'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { useElementTreeQuery } from '@/hooks/useElementTreeQuery'
import { convertFormValuesToCoralStyles } from '@/utils/convertFormToCoralStyles'
import { IconFileImport } from '@tabler/icons-react'
import { Redo, Undo } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { CoralRootNode, CoralStyleType, transformHTMLToSpec } from '@reallygoodwork/coral-core'

import type { StyleFormValues } from '../style-manager/formSchema'
import { ScrollArea } from '../base/ScrollArea'
import { StyleForm } from '../style-manager/styleForm'

// Default values from StyleForm to use in conversion
// These are used to determine which form values should be included in the Coral styles
const styleFormDefaultValues = {
  backgroundColor: '#000000',
  backgroundColorFormat: 'hex',
  color: '#ffffff',
  colorFormat: 'hex',
  paddingInlineStart: 0,
  paddingInlineEndUnit: 'px',
  paddingInlineEnd: 0,
  paddingBlockStartUnit: 'px',
  paddingBlockStart: 0,
  paddingBlockEndUnit: 'px',
  paddingBlockEnd: 0,
  paddingInlineStartUnit: 'px',
  marginInlineStart: 0,
  marginInlineStartUnit: 'px',
  marginInlineEnd: 0,
  marginInlineEndUnit: 'px',
  marginBlockStart: 0,
  marginBlockStartUnit: 'px',
  marginBlockEnd: 0,
  marginBlockEndUnit: 'px',
  borderEnabled: false,
  display: 'block',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 0,
  flexBasisUnit: 'px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: 0,
  gapUnit: 'px',
  overflowEnabled: false,
  width: 0,
  widthUnit: 'px',
  height: 0,
  heightUnit: 'px',
  typographyEnabled: false,
} as Record<string, unknown>

export const Editor = () => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const elementTreeHook = useElementTreeQuery()
  const { elements, getElementTree, replaceAllElements, updateElement } = elementTreeHook

  // Get the selected element
  const selectedElement = useMemo(() => {
    return selectedElementId ? elements.find((el) => el.id === selectedElementId) : null
  }, [elements, selectedElementId])

  // Create a stable key for the form based only on element ID
  // This ensures the form remounts when switching elements
  const formKey = selectedElementId

  // Handle style form changes - only merge the changed style
  const handleStyleChange = useCallback(
    (formValues: StyleFormValues, changedFields?: Record<string, unknown>) => {
      if (!selectedElementId || !selectedElement) return

      // Only convert the fields that were actually changed
      // Include related unit fields for dimension properties
      const fieldsToConvert: Record<string, unknown> = {}

      if (changedFields && Object.keys(changedFields).length > 0) {
        // Add changed fields
        Object.keys(changedFields).forEach((key) => {
          fieldsToConvert[key] = changedFields[key]

          // If this is a dimension value field, also include its unit field
          // Check if this key has a corresponding unit field
          const unitKey = `${key}Unit`
          if (unitKey in formValues) {
            fieldsToConvert[unitKey] = formValues[unitKey as keyof StyleFormValues]
          }

          // If this is a unit field, also include its value field
          // Check if this is a unit field (ends with Unit)
          if (key.endsWith('Unit')) {
            const valueKey = key.replace('Unit', '')
            if (valueKey in formValues) {
              fieldsToConvert[valueKey] = formValues[valueKey as keyof StyleFormValues]
            }
          }
        })
      } else {
        // Fallback: if no changedFields provided, use all form values
        // But this shouldn't happen in normal operation
        Object.assign(fieldsToConvert, formValues)
      }

      // Convert only the changed fields to Coral styles
      const coralStyles = convertFormValuesToCoralStyles(
        fieldsToConvert as Record<string, unknown>,
        styleFormDefaultValues,
        selectedElement.styles as Record<string, unknown> | undefined,
      )

      // Only merge the styles that were actually changed
      const mergedStyles = {
        ...(selectedElement.styles || {}),
        ...coralStyles,
      }

      // Update the element with merged styles
      updateElement(selectedElementId, { styles: mergedStyles as CoralStyleType })
    },
    [selectedElementId, selectedElement, updateElement],
  )

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

    const buildCoralNode = (element: ElementTreeNode): CoralRootNode => {
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
        children:
          element.children && element.children.length > 0
            ? element.children.map((child) => buildCoralNode(child as ElementTreeNode))
            : undefined,
      }

      return Object.fromEntries(
        Object.entries(node).filter(([_, value]) => value !== undefined),
      ) as unknown as CoralRootNode
    }

    if (elementTree.length === 1) {
      return buildCoralNode(elementTree[0]!) as CoralRootNode
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
    setSelectedElementId(elementId)
  }

  const handleImportCode = (code: string) => {
    try {
      const spec = transformHTMLToSpec(code)

      // Convert the coral spec to ElementTreeNode format
      const convertCoralToElements = (node: CoralRootNode, parentId?: string): ElementTreeNode[] => {
        const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const element: ElementTreeNode = {
          id,
          parentId,
          name: node.name || node.elementType,
          elementType: node.elementType,
          type: node.type || 'NODE',
          isExpanded: true,
        }

        if (node.textContent) {
          element.textContent = node.textContent
        }
        if (node.elementAttributes) {
          element.elementAttributes = node.elementAttributes
        }
        if (node.styles) {
          element.styles = node.styles
        }
        if (node.responsiveStyles) {
          element.responsiveStyles = node.responsiveStyles
        }

        let allElements = [element]

        if (node.children && node.children.length > 0) {
          node.children.forEach((child: CoralRootNode) => {
            const childElements = convertCoralToElements(child, id)
            allElements = [...allElements, ...childElements]
          })
        }

        return allElements
      }

      const newElements = convertCoralToElements(spec)

      // Replace all elements with the imported ones
      replaceAllElements(newElements)

      toast.success('Component imported successfully')
    } catch (error) {
      toast.error(`Failed to import: ${(error as Error).message}`)
    }
  }

  // TODO: Implement undo/redo with TanStack Query
  // Keyboard shortcuts for undo/redo would need to be implemented differently
  // with TanStack Query's mutation history

  return (
    <div className="flex flex-col w-full h-[calc(100dvh-2.5rem)] mt-10 bg-background">
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border bg-bg-surface shrink-0 h-10">
        <div className="flex items-center gap-2 place-self-center">
          <p className="text-xs font-medium">Name</p>
          <Badge variant="destructive">Unsaved</Badge>
        </div>
        <div className="flex items-center gap-2 justify-self-end">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => setImportDialogOpen(true)}
            title="Import from Code"
            aria-label="Import from Code"
          >
            <IconFileImport className="size-3.5" />
          </Button>
          {/* TODO: Implement undo/redo with TanStack Query */}
          <Button variant="secondary" size="icon-sm" disabled title="Undo (Ctrl+Z)">
            <Undo className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" disabled title="Redo (Ctrl+Shift+Z)">
            <Redo className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 h-[calc(100dvh-2.5rem)] max-h-[calc(100dvh-2.5rem)] overflow-hidden">
        <aside className="w-64 bg-bg-surface flex flex-col h-full overflow-hidden border-r border-border">
          <EditorSidebar onElementSelect={handleElementSelect} selectedElementId={selectedElementId} />
        </aside>
        <main className="bg-background flex-1 overflow-hidden">
          <EditorPreviewPane spec={spec} onElementClick={handleElementSelect} selectedElementId={selectedElementId} />
        </main>
        <aside className="w-72 bg-bg-surface h-full overflow-hidden border-l border-border">
          <ScrollArea className="bg-bg-surface">
            {selectedElement ? (
              <StyleForm key={formKey || undefined} onChange={handleStyleChange} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="text-muted-foreground">
                  <p className="text-sm font-medium mb-2">No element selected</p>
                  <p className="text-xs">Select an element from the tree to edit its styles</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </aside>
      </div>
      <ImportCodeDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImport={handleImportCode} />
    </div>
  )
}
