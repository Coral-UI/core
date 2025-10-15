import { ChevronDown, ChevronRight, Plus, Trash2, Type, Square, Circle, GripVertical, ArrowUp, ArrowDown, Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, TextCursorInputIcon, LinkIcon, ImageIcon, ListIcon, ListOrderedIcon, SquareMousePointerIcon, LayoutListIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { CoralElementType } from '@reallygoodwork/coral-core'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { canContain, getValidChildTypes, getElementCategory } from '@/utils/elementHierarchy'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  UniqueIdentifier,
  MeasuringStrategy,
  pointerWithin,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const ELEMENT_TYPES: { type: CoralElementType; label: string; icon: JSX.Element }[] = [
  { type: 'div', label: 'Container', icon: <Square className="w-3 h-3" /> },
  { type: 'section', label: 'Section', icon: <Square className="w-3 h-3" /> },
  { type: 'header', label: 'Header', icon: <Square className="w-3 h-3" /> },
  { type: 'footer', label: 'Footer', icon: <Square className="w-3 h-3" /> },
  { type: 'main', label: 'Main', icon: <Square className="w-3 h-3" /> },
  { type: 'nav', label: 'Navigation', icon: <Square className="w-3 h-3" /> },
  { type: 'article', label: 'Article', icon: <Square className="w-3 h-3" /> },
  { type: 'aside', label: 'Aside', icon: <Square className="w-3 h-3" /> },
  { type: 'h1', label: 'Heading 1', icon: <Heading1Icon className="w-3 h-3" /> },
  { type: 'h2', label: 'Heading 2', icon: <Heading2Icon className="w-3 h-3" /> },
  { type: 'h3', label: 'Heading 3', icon: <Heading3Icon className="w-3 h-3" /> },
  { type: 'h4', label: 'Heading 4', icon: <Heading4Icon className="w-3 h-3" /> },
  { type: 'h5', label: 'Heading 5', icon: <Heading5Icon className="w-3 h-3" /> },
  { type: 'p', label: 'Paragraph', icon: <Type className="w-3 h-3" /> },
  { type: 'span', label: 'Span', icon: <Type className="w-3 h-3" /> },
  { type: 'button', label: 'Button', icon: <SquareMousePointerIcon className="w-3 h-3" /> },
  { type: 'input', label: 'Input', icon: <TextCursorInputIcon className="w-3 h-3" /> },
  { type: 'a', label: 'Link', icon: <LinkIcon className="w-3 h-3" /> },
  { type: 'img', label: 'Image', icon: <ImageIcon className="w-3 h-3" /> },
  { type: 'ul', label: 'Unordered List', icon: <ListIcon className="w-3 h-3" /> },
  { type: 'ol', label: 'Ordered List', icon: <ListOrderedIcon className="w-3 h-3" /> },
  { type: 'li', label: 'List Item', icon: <LayoutListIcon className="w-3 h-3" /> },
]

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
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(element.name)

  // Calculate sibling position for showing up/down buttons
  const getSiblingInfo = () => {
    if (!allElements || element.id === 'root') {
      return { hasSiblings: false, isFirst: false, isLast: false }
    }

    const parentId = element.parentId || 'root'
    const siblings = allElements
      .filter(el => {
        const elParentId = el.parentId || 'root'
        return elParentId === parentId
      })
      .sort((a, b) => {
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
          return a.orderIndex - b.orderIndex
        }
        return 0
      })

    const currentIndex = siblings.findIndex(el => el.id === element.id)
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
  const paddingLeft = depth * 16
  const draggingClass = isDragging || isSortableDragging ? 'opacity-50' : ''

  // Check if this element is being dragged over
  const isDragOver = dragOverElement === element.id

  // Simple visual feedback
  const dropZoneClass = isDragOver
    ? (isValidDrop
        ? 'bg-green-100/80 border-2 border-green-500'
        : 'bg-red-100/80 border-2 border-red-500')
    : ''

  const categoryClass = getElementCategory(element.elementType) === 'structural-block'
    ? 'border-l-4 border-blue-500'
    : getElementCategory(element.elementType) === 'text-block'
    ? 'border-l-2 border-orange-200'
    : getElementCategory(element.elementType) === 'inline'
    ? 'border-l-2 border-purple-200'
    : ''

  const handleNameSubmit = () => {
    onUpdateElement(element.id, { name: editName })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
    } else if (e.key === 'Escape') {
      setEditName(element.name)
      setIsEditing(false)
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={`w-full ${draggingClass}`}>
      <div
        data-element-id={element.id}
        className={`flex items-center gap-1 py-2 px-2 hover:bg-muted/50 cursor-pointer group transition-all duration-200 min-h-[40px] ${
          element.isSelected ? 'bg-primary/10 border-l-2 border-accent-foreground' : ''
        } ${dropZoneClass} ${categoryClass}`}
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
        onClick={() => onSelect(element.id)}
      >
        {/* Drag handle - only show for non-root elements */}
        {element.id !== 'root' && (
          <div
            {...attributes}
            {...listeners}
            className="h-4 w-4 p-0 hover:bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpanded(element.id)
          }}
        >
          {hasChildren ? (
            element.isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )
          ) : (
            <div className="h-3 w-3" />
          )}
        </Button>

        <div className="flex items-baseline gap-1 flex-1 min-w-0">
          <span className="text-xs text-muted-foreground font-mono tabular-nums tracking-wide">
            {element.elementType}
          </span>
          {isDragOver && (
            <span className={`text-xs px-1 py-0.5 rounded font-medium ${
              isValidDrop ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {isValidDrop ? 'Drop inside' : 'Cannot drop here'}
            </span>
          )}
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              className="text-sm bg-transparent border-none outline-none flex-1 min-w-0"
              autoFocus
            />
          ) : (
            <span
              className="text-xs flex-1 min-w-0 truncate font-medium"
              onDoubleClick={() => setIsEditing(true)}
            >
              {element.name}
            </span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          {element.id !== 'root' && siblingInfo.hasSiblings && (
            <>
              {!siblingInfo.isFirst && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
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
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
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

          <DropdownMenu>
            <DropdownMenuTrigger className="h-6 w-6 p-0 rounded border-0 bg-transparent hover:bg-muted flex items-center justify-center">
              <Plus className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="text-xs text-muted-foreground px-2 py-1">Add Child Element</div>
              <DropdownMenuSeparator />
              {ELEMENT_TYPES
                .filter(elementType => {
                  const validChildTypes = getValidChildTypes(element.elementType)
                  return validChildTypes.includes(elementType.type)
                })
                .map((elementType) => (
                  <DropdownMenuItem
                    key={elementType.type}
                    onClick={() => onAddChild(element.id, elementType.type)}
                    className="flex items-center gap-2"
                  >
                    {elementType.icon}
                    <span className="text-xs">{elementType.label}</span>
                    <span className="text-xs text-muted-foreground ml-auto font-mono tabular-nums tracking-wide">
                      {elementType.type}
                    </span>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {element.id !== 'root' && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(element.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
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
                  dragOverElement={dragOverElement ?? null}
                  dropPosition={dropPosition ?? null}
                  isValidDrop={isValidDrop ?? false}
                  activeElement={activeElement ?? null}
                  allElements={allElements}
                />
              ) : null
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
}

export const SimpleElementTree = ({
  elements,
  onAddChild,
  onRemove,
  onToggleExpanded,
  onSelect,
  onUpdateElement,
  onMoveElement,
  allElements
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
    })
  )

  const findElementById = (id: UniqueIdentifier) => {
    return allElements.find(el => el.id === id)
  }

  const findParentElement = (elementId: string) => {
    return allElements.find(el =>
      el.children?.some(child => typeof child === 'object' && 'id' in child && (child as ElementTreeNode).id === elementId)
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
      .filter(el => {
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

    console.log('[handleMoveUp] siblings:', siblings.map(s => ({ id: s.id, name: s.name, orderIndex: s.orderIndex })))

    const currentIndex = siblings.findIndex(el => el.id === elementId)
    console.log('[handleMoveUp] currentIndex:', currentIndex)

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
      .filter(el => {
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

    console.log('[handleMoveDown] siblings:', siblings.map(s => ({ id: s.id, name: s.name, orderIndex: s.orderIndex })))

    const currentIndex = siblings.findIndex(el => el.id === elementId)
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
  const isDescendant = (activeId: UniqueIdentifier, targetId: UniqueIdentifier, allElements: ElementTreeNode[]): boolean => {
    const target = allElements.find(el => el.id === targetId)
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
      if (
        isDescendant(activeElement.id, overElement.id, allElements) ||
        activeElement.id === 'root'
      ) {
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-medium">Elements</h3>
        <div className="text-xs text-muted-foreground">Drag to nest & reorder</div>
      </div>



      <div className="flex-1 overflow-auto">
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
          <SortableContext
            items={elements.map(el => el.id)}
            strategy={verticalListSortingStrategy}
          >
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
      </div>
    </div>
  )
}