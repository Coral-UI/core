import { EditorSidebar } from '@/components/EditorSidebar'
import { ElementProperties } from '@/components/ElementProperties'
import { useState } from 'react'

import { CoralRootNode } from '@reallygoodwork/coral-core'
import { useElementTree } from '@/hooks/useElementTree'

import { EditorPreviewPane } from './EditorPreviewPane'

export const Editor = () => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const elementTreeHook = useElementTree()
  const { 
    elements, 
    updateElement,
    getElementTree,
    selectElement
  } = elementTreeHook

  const selectedElement = selectedElementId ? elements.find(el => el.id === selectedElementId) : null
  const elementTree = getElementTree()

  const convertToCoralSpec = (): CoralRootNode => {
    if (elementTree.length === 0) {
      return {
        name: 'root',
        elementType: 'div',
        type: 'NODE',
        children: []
      } as CoralRootNode
    }

    const buildCoralNode = (element: any): any => {
      const node = {
        name: element.name,
        elementType: element.elementType,
        type: element.type || 'NODE',
        textContent: element.textContent,
        description: element.description,
        elementAttributes: element.elementAttributes,
        styles: element.styles, // Include styles in the coral spec
        children: element.children?.length > 0 
          ? element.children.map(buildCoralNode)
          : undefined
      }
      
      return Object.fromEntries(
        Object.entries(node).filter(([_, value]) => value !== undefined)
      )
    }

    if (elementTree.length === 1) {
      return buildCoralNode(elementTree[0]) as CoralRootNode
    }

    return {
      name: 'root',
      elementType: 'div',
      type: 'NODE',
      children: elementTree.map(buildCoralNode)
    } as CoralRootNode
  }

  // Force re-render when elements change
  const spec = convertToCoralSpec()

  const handleElementSelect = (elementId: string | null) => {
    selectElement(elementId)
    setSelectedElementId(elementId)
  }

  return (
    <div className="flex flex-row h-screen pt-10">
      <div className="w-64 border-r border-border">
        <EditorSidebar 
          onElementSelect={handleElementSelect}
          elementTreeHook={elementTreeHook}
        />
      </div>
      <div className="flex-1 p-2 bg-muted">
        <EditorPreviewPane spec={spec} />
      </div>
      <div className="w-64 border-l border-border">
        <ElementProperties 
          element={selectedElement || null}
          onUpdateElement={updateElement}
        />
      </div>
    </div>
  )
}
