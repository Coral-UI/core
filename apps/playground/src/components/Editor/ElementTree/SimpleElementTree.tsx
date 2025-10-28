import { ScrollArea } from '@/components/ui/scroll-area'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { canContain } from '@/utils/elementHierarchy'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'

import { CoralElementType } from '@reallygoodwork/coral-core'

import { SimpleElementTreeItem } from './SimpleElementTreeItem'

interface SimpleElementTreeProps {
  elements: ElementTreeNode[]
  onAddChild: (parentId: string, elementType: CoralElementType) => void
  onRemove: (elementId: string) => void
  onToggleExpanded: (elementId: string) => void
  onSelect: (elementId: string) => void
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
  onMoveElement: (elementId: string, newParentId?: string, index?: number) => void
  allElements: ElementTreeNode[]
  selectedElementId: string | null
}

export const SimpleElementTree = ({
  elements,
  onAddChild,
  onRemove,
  onToggleExpanded,
  onSelect,
  onUpdateElement,
  onMoveElement,
  allElements,
  selectedElementId,
}: SimpleElementTreeProps) => {
  const [activeElement, setActiveElement] = useState<ElementTreeNode | null>(null)
  const [dragOverElement, setDragOverElement] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null)
  const [isValidDrop, setIsValidDrop] = useState<boolean>(false)
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Track mouse position during drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const findElementById = (id: UniqueIdentifier) => {
    return allElements.find((el) => el.id === id)
  }

  const findParentElement = (elementId: string) => {
    return allElements.find((el) =>
      el.children?.some(
        (child) => typeof child === 'object' && 'id' in child && (child as ElementTreeNode).id === elementId,
      ),
    )
  }

  const handleMoveUp = (elementId: string) => {
    console.log('[handleMoveUp] called for:', elementId)
    const element = findElementById(elementId)
    if (!element) {
      console.log('[handleMoveUp] element not found')
      return
    }

    const parentElement = findParentElement(elementId)
    const parentId = parentElement?.id || element.parentId

    // Get siblings and sort by orderIndex
    const siblings = allElements
      .filter((el) => {
        const elParentId = el.parentId || 'root'
        const targetParentId = parentId || 'root'
        return elParentId === targetParentId
      })
      .sort((a, b) => {
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
          return a.orderIndex - b.orderIndex
        }
        return 0
      })

    console.log(
      '[handleMoveUp] siblings:',
      siblings.map((s) => ({ id: s.id, name: s.name, orderIndex: s.orderIndex })),
    )

    const currentIndex = siblings.findIndex((el) => el.id === elementId)

    if (currentIndex > 0) {
      // Move up (swap with previous sibling)
      console.log('[handleMoveUp] moving from', currentIndex, 'to', currentIndex - 1)
      onMoveElement(elementId, parentId, currentIndex - 1)
    } else {
      console.log('[handleMoveUp] already at top')
    }
  }

  const handleMoveDown = (elementId: string) => {
    console.log('[handleMoveDown] called for:', elementId)
    const element = findElementById(elementId)
    if (!element) {
      console.log('[handleMoveDown] element not found')
      return
    }

    const parentElement = findParentElement(elementId)
    const parentId = parentElement?.id || element.parentId

    // Get siblings and sort by orderIndex
    const siblings = allElements
      .filter((el) => {
        const elParentId = el.parentId || 'root'
        const targetParentId = parentId || 'root'
        return elParentId === targetParentId
      })
      .sort((a, b) => {
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
          return a.orderIndex - b.orderIndex
        }
        return 0
      })

    console.log(
      '[handleMoveDown] siblings:',
      siblings.map((s) => ({ id: s.id, name: s.name, orderIndex: s.orderIndex })),
    )

    const currentIndex = siblings.findIndex((el) => el.id === elementId)
    console.log('[handleMoveDown] currentIndex:', currentIndex, 'length:', siblings.length)

    if (currentIndex < siblings.length - 1 && currentIndex !== -1) {
      // Move down (swap with next sibling)
      console.log('[handleMoveDown] moving from', currentIndex, 'to', currentIndex + 1)
      onMoveElement(elementId, parentId, currentIndex + 1)
    } else {
      console.log('[handleMoveDown] already at bottom')
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const element = findElementById(event.active.id)
    setActiveElement(element || null)
    setDragOverElement(null)
    setDropPosition(null)
    setIsValidDrop(false)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event

    if (!over || !activeElement || over.id === active.id) {
      setDragOverElement(null)
      setDropPosition(null)
      setIsValidDrop(false)
      return
    }

    const overElement = findElementById(over.id)
    if (!overElement) {
      setDragOverElement(null)
      setDropPosition(null)
      setIsValidDrop(false)
      return
    }

    // Don't allow dropping on descendants or dragging root
    if (isDescendant(activeElement.id, overElement.id, allElements) || activeElement.id === 'root') {
      setDragOverElement(overElement.id)
      setDropPosition(null)
      setIsValidDrop(false)
      return
    }

    // SIMPLE FIGMA-LIKE BEHAVIOR:
    // Default: Drop as last child (inside)
    // This makes nesting easy and intuitive

    const position = 'inside'
    const isValid = canContain(overElement.elementType, activeElement.elementType)

    setDragOverElement(overElement.id)
    setDropPosition(position)
    setIsValidDrop(isValid)
  }

  // Helper function to check if activeId is a descendant of targetId (prevents dropping parent into child)
  const isDescendant = (
    activeId: UniqueIdentifier,
    targetId: UniqueIdentifier,
    allElements: ElementTreeNode[],
  ): boolean => {
    const target = allElements.find((el) => el.id === targetId)
    if (!target || !target.children) return false

    for (const child of target.children) {
      if (typeof child === 'object' && 'id' in child) {
        if (child.id === activeId) return true
        if (isDescendant(activeId, (child as ElementTreeNode).id, allElements)) return true
      }
    }
    return false
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id || !isValidDrop) {
      setActiveElement(null)
      setDragOverElement(null)
      setDropPosition(null)
      setIsValidDrop(false)
      return
    }

    const activeElement = findElementById(active.id)
    const overElement = findElementById(over.id)

    if (activeElement && overElement) {
      // Don't allow dropping on descendants or dragging root
      if (isDescendant(activeElement.id, overElement.id, allElements) || activeElement.id === 'root') {
        setActiveElement(null)
        setDragOverElement(null)
        setDropPosition(null)
        setIsValidDrop(false)
        return
      }

      // Simple: Always drop as a child
      onMoveElement(activeElement.id, overElement.id)
    }

    setActiveElement(null)
    setDragOverElement(null)
    setDropPosition(null)
    setIsValidDrop(false)
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <h3 className="text-xs font-semibold text-foreground tracking-tight">Structure</h3>
        {/* <div className="text-xs text-muted-foreground">Drag to nest & reorder</div> */}
      </div>

      <div className="flex-1 overflow-auto">
        <ScrollArea>
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <SortableContext items={elements.map((el) => el.id)} strategy={verticalListSortingStrategy}>
              {elements.map((element) => (
                <SimpleElementTreeItem
                  key={element.id}
                  element={element}
                  depth={0}
                  onAddChild={onAddChild}
                  onRemove={onRemove}
                  onToggleExpanded={onToggleExpanded}
                  onSelect={onSelect}
                  onUpdateElement={onUpdateElement}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  selectedElementId={selectedElementId}
                  dragOverElement={dragOverElement ?? null}
                  dropPosition={dropPosition ?? null}
                  isValidDrop={isValidDrop ?? false}
                  activeElement={activeElement ?? null}
                  allElements={allElements ?? []}
                />
              ))}
            </SortableContext>

            <DragOverlay>
              {activeElement ? (
                <div className="bg-background border border-border rounded p-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">{activeElement.elementType}</span>
                    <span className="text-sm">{activeElement.name}</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </ScrollArea>
      </div>
    </div>
  )
}
