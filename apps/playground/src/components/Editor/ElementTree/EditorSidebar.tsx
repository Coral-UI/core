import { SimpleElementTree } from '@/components/Editor/ElementTree/SimpleElementTree'
import { useElementTree } from '@/hooks/useElementTree'

import { CoralElementType } from '@reallygoodwork/coral-core'

interface EditorSidebarProps {
  onElementSelect?: (elementId: string | null) => void
  elementTreeHook: ReturnType<typeof useElementTree>
}

export const EditorSidebar = ({ onElementSelect, elementTreeHook }: EditorSidebarProps) => {
  const {
    elements,
    addElement,
    removeElement,
    updateElement,
    toggleExpanded,
    getElementTree,
    moveElement,
    selectedElementId,
  } = elementTreeHook

  const handleSelect = (elementId: string) => {
    onElementSelect?.(elementId)
  }

  const handleAddChild = (parentId: string, elementType: CoralElementType) => {
    addElement(elementType, parentId)
  }

  return (
    <SimpleElementTree
      elements={getElementTree()}
      allElements={elements}
      onAddChild={handleAddChild}
      onRemove={removeElement}
      onToggleExpanded={toggleExpanded}
      onSelect={handleSelect}
      onUpdateElement={updateElement}
      onMoveElement={moveElement}
      selectedElementId={selectedElementId}
    />
  )
}
