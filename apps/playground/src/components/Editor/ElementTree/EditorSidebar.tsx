// import { Button } from '@/components/ui/button'
import { TreeDataItem, TreeView } from '@/components/ui/tree-view'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { useElementTreeQuery } from '@/hooks/useElementTreeQuery'
import { useElementSelectionStore } from '@/stores/useElementSelectionStore'
import { canContain } from '@/utils/elementHierarchy'
import { Minus, Plus } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

// Convert ElementTreeNode to TreeDataItem
const convertToTreeDataItem = (
  element: ElementTreeNode,
  selectedElementId: string | null,
  onSelect: (id: string) => void,
  onAddChild: (parentId: string) => void,
  onDelete: (id: string) => void,
): TreeDataItem => {
  const hasChildren = element.children && element.children.length > 0
  const isSelected = selectedElementId === element.id
  const canDelete = element.id !== 'root' // Don't allow deleting root

  const treeItem: TreeDataItem = {
    id: element.id,
    name: element.name || element.elementType,
    draggable: element.id !== 'root',
    droppable: true,
    onClick: () => onSelect(element.id),
  }

  if (hasChildren) {
    treeItem.children = (element.children as ElementTreeNode[]).map((child) =>
      convertToTreeDataItem(child, selectedElementId, onSelect, onAddChild, onDelete),
    )
  }

  if (isSelected) {
    treeItem.actions = (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            onAddChild(element.id)
          }}
          title="Add child element"
        >
          <Plus className="h-3 w-3" />
        </button>
        {canDelete && (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onDelete(element.id)
            }}
            title="Delete element"
          >
            <Minus className="h-3 w-3" />
          </button>
        )}
      </div>
    )
  }

  return treeItem
}

export const EditorSidebar = () => {
  const selectedElementId = useElementSelectionStore((state) => state.selectedElementId)
  const setSelectedElementId = useElementSelectionStore((state) => state.setSelectedElementId)
  const elementTreeHook = useElementTreeQuery()
  const { getElementTree, addElement, moveElement, removeElement } = elementTreeHook
  const [expandedItems, setExpandedItems] = useState<string[]>(['root'])

  const elementTree = getElementTree()

  // Handle delete element
  const handleDelete = useCallback(
    (elementId: string) => {
      removeElement(elementId)
      // Clear selection if the deleted element was selected
      if (selectedElementId === elementId) {
        setSelectedElementId(null)
      }
    },
    [removeElement, selectedElementId, setSelectedElementId],
  )

  // Convert element tree to TreeDataItem format
  const treeData = useMemo(() => {
    return elementTree.map((element) =>
      convertToTreeDataItem(
        element,
        selectedElementId || null,
        (id) => setSelectedElementId(id),
        (parentId) => {
          // Default to adding a div element
          addElement('div', parentId)
          // Expand the parent when adding a child
          if (!expandedItems.includes(parentId)) {
            setExpandedItems([...expandedItems, parentId])
          }
        },
        handleDelete,
      ),
    )
  }, [elementTree, selectedElementId, addElement, expandedItems, handleDelete, setSelectedElementId])

  const handleSelectChange = useCallback(
    (item: TreeDataItem | undefined) => {
      if (item) {
        setSelectedElementId(item.id)
      } else {
        setSelectedElementId(null)
      }
    },
    [setSelectedElementId],
  )

  const handleDragDrop = useCallback(
    (sourceItem: TreeDataItem, targetItem: TreeDataItem) => {
      // Don't allow dropping on self
      if (sourceItem.id === targetItem.id) return

      // Don't allow dropping root
      if (sourceItem.id === 'root') return

      // Get the source element to check if it can be nested in target
      const sourceElement = elementTreeHook.elements.find((el) => el.id === sourceItem.id)
      const targetElement = elementTreeHook.elements.find((el) => el.id === targetItem.id)

      if (!sourceElement || !targetElement) return

      // Check if target can contain source element type
      if (canContain(targetElement.elementType, sourceElement.elementType)) {
        // Move element to be a child of target
        moveElement(sourceItem.id, targetItem.id)
      }
    },
    [elementTreeHook, moveElement],
  )

  return (
    <div className="flex flex-col h-full card">
      <div className="pt-1.5">
        <p className="text-xs font-medium text-muted-foreground">Structure</p>
      </div>
      <div className="flex-1 overflow-auto">
        <TreeView
          data={treeData}
          {...(selectedElementId && { initialSelectedItemId: selectedElementId })}
          onSelectChange={handleSelectChange}
          onDocumentDrag={handleDragDrop}
          expandAll={false}
        />
      </div>
    </div>
  )
}
