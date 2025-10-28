import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { canContain, getValidChildTypes } from '@/utils/elementHierarchy'
import { AddElementCombobox } from './AddElementCombobox'
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
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconTrash } from '@tabler/icons-react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { CoralElementType } from '@reallygoodwork/coral-core'

interface SimpleElementTreeItemProps {
  element: ElementTreeNode
  depth: number
  onAddChild: (parentId: string, elementType: CoralElementType) => void
  onRemove: (elementId: string) => void
  onToggleExpanded: (elementId: string) => void
  onSelect: (elementId: string) => void
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
  onMoveUp: (elementId: string) => void
  onMoveDown: (elementId: string) => void
  selectedElementId: string | null
  isDragging?: boolean
}

const SimpleElementTreeItem = ({
  element,
  depth,
  onAddChild,
  onRemove,
  onToggleExpanded,
  onSelect,
  onUpdateElement,
  onMoveUp,
  onMoveDown,
  selectedElementId,
  isDragging = false,
  dragOverElement,
  dropPosition,
  isValidDrop,
  activeElement,
  allElements,
}: SimpleElementTreeItemProps & {
  dragOverElement?: string | null
  dropPosition?: 'before' | 'after' | 'inside' | null
  isValidDrop?: boolean
  activeElement?: ElementTreeNode | null
  allElements?: ElementTreeNode[]
}) => {
  // Calculate sibling position for showing up/down buttons
  const getSiblingInfo = () => {
    if (!allElements || element.id === 'root') {
      return { hasSiblings: false, isFirst: false, isLast: false }
    }

    const parentId = element.parentId || 'root'
    const siblings = allElements
      .filter((el) => {
        const elParentId = el.parentId || 'root'
        return elParentId === parentId
      })
      .sort((a, b) => {
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
          return a.orderIndex - b.orderIndex
        }
        return 0
      })

    const currentIndex = siblings.findIndex((el) => el.id === element.id)
    return {
      hasSiblings: siblings.length > 1,
      isFirst: currentIndex === 0,
      isLast: currentIndex === siblings.length - 1,
    }
  }

  const siblingInfo = getSiblingInfo()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: element.id,
    disabled: element.id === 'root', // Don't allow dragging the root element
    animateLayoutChanges: () => false, // Disable automatic reordering animations
  })

  const style = {
    transform: isSortableDragging ? CSS.Transform.toString(transform) : undefined,
    transition: isSortableDragging ? transition : undefined,
  }

  const hasChildren = element.children && element.children.length > 0
  const paddingLeft = depth * 20
  const draggingClass = isDragging || isSortableDragging ? 'opacity-50' : ''

  // Check if this element is being dragged over
  const isDragOver = dragOverElement === element.id

  // Simple visual feedback
  const dropZoneClass = isDragOver
    ? isValidDrop
      ? 'bg-green-100/80 border-2 border-green-500'
      : 'bg-red-100/80 border-2 border-red-500'
    : ''

  return (
    <div ref={setNodeRef} style={style} className={`w-full ${draggingClass}`}>
      <div
        data-element-id={element.id}
        className={`flex items-center gap-1 py-2 px-2 hover:bg-popover cursor-pointer group transition-all duration-200 min-h-[40px] border relative ${
          selectedElementId === element.id ? ' border-popover-foreground bg-popover' : 'border-transparent'
        } ${dropZoneClass}`}
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
        onClick={() => onSelect(element.id)}
      >
        {/* Drag handle - only show for non-root elements */}
        {element.id !== 'root' && (
          <div
            {...attributes}
            {...listeners}
            className="h-4 w-4 p-0 hover:bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 absolute left-0"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpanded(element.id)
            }}
          >
            {element.isExpanded ? <ChevronDown /> : <ChevronRight />}
          </Button>
        )}

        <div className="flex items-baseline gap-1 flex-1 min-w-0">
          <span className="text-xs text-primary-foreground">{element.elementType}</span>
          {isDragOver && (
            <span
              className={`text-xs px-1 py-0.5 rounded font-medium ${
                isValidDrop
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {isValidDrop ? 'Drop inside' : 'Cannot drop here'}
            </span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          {element.id !== 'root' && siblingInfo.hasSiblings && (
            <>
              {!siblingInfo.isFirst && (
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveUp(element.id)
                  }}
                  title="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
              )}
              {!siblingInfo.isLast && (
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveDown(element.id)
                  }}
                  title="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              )}
            </>
          )}

          <AddElementCombobox
            validChildTypes={getValidChildTypes(element.elementType)}
            onSelect={(elementType) => onAddChild(element.id, elementType)}
          />

          {element.id !== 'root' && (
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(element.id)
              }}
            >
              <IconTrash stroke={1.5} className="text-destructive" />
            </Button>
          )}
        </div>
      </div>

      {hasChildren && element.isExpanded && (
        <SortableContext
          items={
            element.children
              ?.map((child) => (typeof child === 'object' && 'id' in child ? (child as ElementTreeNode).id : ''))
              .filter(Boolean) || []
          }
          strategy={verticalListSortingStrategy}
        >
          <div>
            {element.children?.map((child) =>
              typeof child === 'object' && 'id' in child ? (
                <SimpleElementTreeItem
                  key={(child as ElementTreeNode).id}
                  element={child as ElementTreeNode}
                  depth={depth + 1}
                  onAddChild={onAddChild}
                  onRemove={onRemove}
                  onToggleExpanded={onToggleExpanded}
                  onSelect={onSelect}
                  onUpdateElement={onUpdateElement}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  selectedElementId={selectedElementId}
                  dragOverElement={dragOverElement ?? null}
                  dropPosition={dropPosition ?? null}
                  isValidDrop={isValidDrop ?? false}
                  activeElement={activeElement ?? null}
                  allElements={allElements}
                />
              ) : null,
            )}
          </div>
        </SortableContext>
      )}
    </div>
  )
}

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
                  allElements={allElements}
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
