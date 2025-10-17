import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ElementTreeNode } from '@/hooks/useElementTree'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronRight, Circle, GripVertical, Plus, Square, Trash2, Type } from 'lucide-react'
import { useState } from 'react'

import { CoralElementType } from '@reallygoodwork/coral-core'

const ELEMENT_TYPES: { type: CoralElementType; label: string; icon: JSX.Element }[] = [
  { type: 'div', label: 'Container', icon: <Square className="w-3 h-3" /> },
  { type: 'section', label: 'Section', icon: <Square className="w-3 h-3" /> },
  { type: 'header', label: 'Header', icon: <Square className="w-3 h-3" /> },
  { type: 'footer', label: 'Footer', icon: <Square className="w-3 h-3" /> },
  { type: 'main', label: 'Main', icon: <Square className="w-3 h-3" /> },
  { type: 'nav', label: 'Navigation', icon: <Square className="w-3 h-3" /> },
  { type: 'article', label: 'Article', icon: <Square className="w-3 h-3" /> },
  { type: 'aside', label: 'Aside', icon: <Square className="w-3 h-3" /> },
  { type: 'h1', label: 'Heading 1', icon: <Type className="w-3 h-3" /> },
  { type: 'h2', label: 'Heading 2', icon: <Type className="w-3 h-3" /> },
  { type: 'h3', label: 'Heading 3', icon: <Type className="w-3 h-3" /> },
  { type: 'p', label: 'Paragraph', icon: <Type className="w-3 h-3" /> },
  { type: 'span', label: 'Span', icon: <Type className="w-3 h-3" /> },
  { type: 'text', label: 'Text', icon: <Type className="w-3 h-3" /> },
  { type: 'button', label: 'Button', icon: <Circle className="w-3 h-3" /> },
  { type: 'input', label: 'Input', icon: <Circle className="w-3 h-3" /> },
  { type: 'a', label: 'Link', icon: <Type className="w-3 h-3" /> },
  { type: 'img', label: 'Image', icon: <Square className="w-3 h-3" /> },
  { type: 'ul', label: 'Unordered List', icon: <Square className="w-3 h-3" /> },
  { type: 'ol', label: 'Ordered List', icon: <Square className="w-3 h-3" /> },
  { type: 'li', label: 'List Item', icon: <Square className="w-3 h-3" /> },
]

interface SortableElementItemProps {
  element: ElementTreeNode
  depth: number
  onAddChild: (parentId: string, elementType: CoralElementType) => void
  onRemove: (elementId: string) => void
  onToggleExpanded: (elementId: string) => void
  onSelect: (elementId: string) => void
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
  isDragging?: boolean
}

const SortableElementItem = ({
  element,
  depth,
  onAddChild,
  onRemove,
  onToggleExpanded,
  onSelect,
  onUpdateElement,
  isDragging = false,
}: SortableElementItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(element.name)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const hasChildren = element.children && element.children.length > 0
  const paddingLeft = depth * 16

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

  const draggingClass = isDragging || isSortableDragging ? 'opacity-50' : ''

  return (
    <div ref={setNodeRef} style={style} className={`w-full ${draggingClass}`}>
      <div
        className={`flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer group ${
          element.isSelected ? 'bg-primary/10 border-l-2 border-primary' : ''
        }`}
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
        onClick={() => onSelect(element.id)}
      >
        <div
          {...attributes}
          {...listeners}
          className="h-4 w-4 p-0 hover:bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <GripVertical className="h-3 w-3" />
        </div>

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

        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-xs text-muted-foreground font-mono">{element.elementType}</span>
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
            <span className="text-sm flex-1 min-w-0 truncate" onDoubleClick={() => setIsEditing(true)}>
              {element.name}
            </span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-6 w-6 p-0 rounded border-0 bg-transparent hover:bg-muted flex items-center justify-center">
              <Plus className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="text-xs text-muted-foreground px-2 py-1">Add Child Element</div>
              <DropdownMenuSeparator />
              {ELEMENT_TYPES.map((elementType) => (
                <DropdownMenuItem
                  key={elementType.type}
                  onClick={() => {
                    console.log('Dropdown item clicked:', elementType.type, element.id)
                    onAddChild(element.id, elementType.type)
                  }}
                  className="flex items-center gap-2"
                >
                  {elementType.icon}
                  <span>{elementType.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{elementType.type}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {element.id !== 'root' && (
            <Button
              variant="ghost"
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
          strategy={rectSortingStrategy}
        >
          <div>
            {element.children?.map((child) =>
              typeof child === 'object' && 'id' in child ? (
                <SortableElementItem
                  key={(child as ElementTreeNode).id}
                  element={child as ElementTreeNode}
                  depth={depth + 1}
                  onAddChild={onAddChild}
                  onRemove={onRemove}
                  onToggleExpanded={onToggleExpanded}
                  onSelect={onSelect}
                  onUpdateElement={onUpdateElement}
                />
              ) : null,
            )}
          </div>
        </SortableContext>
      )}
    </div>
  )
}

interface DraggableElementTreeProps {
  elements: ElementTreeNode[]
  onAddChild: (parentId: string, elementType: CoralElementType) => void
  onAddRoot: (elementType: CoralElementType) => void
  onRemove: (elementId: string) => void
  onToggleExpanded: (elementId: string) => void
  onSelect: (elementId: string) => void
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
  onMoveElement: (elementId: string, newParentId?: string, index?: number) => void
}

export const DraggableElementTree = ({
  elements,
  onAddChild,
  onAddRoot: _onAddRoot,
  onRemove,
  onToggleExpanded,
  onSelect,
  onUpdateElement,
  onMoveElement,
}: DraggableElementTreeProps) => {
  const [activeElement, setActiveElement] = useState<ElementTreeNode | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const rootElements = elements.filter((el) => !el.parentId)

  const handleDragStart = (event: DragStartEvent) => {
    const element = elements.find((el) => el.id === event.active.id)
    setActiveElement(element || null)
  }

  const handleDragOver = (_event: DragOverEvent) => {
    // Handle drag over logic for reordering
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      setActiveElement(null)
      return
    }

    const activeElement = elements.find((el) => el.id === active.id)
    const overElement = elements.find((el) => el.id === over.id)

    if (activeElement && overElement) {
      // Move the active element to be a sibling of the over element
      onMoveElement(activeElement.id, overElement.parentId)
    }

    setActiveElement(null)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-medium">Elements</h3>
        <div className="text-xs text-muted-foreground">Click + on root to add elements</div>
      </div>

      <div className="flex-1 overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={rootElements.map((el) => el.id)} strategy={rectSortingStrategy}>
            {rootElements.map((element) => (
              <SortableElementItem
                key={element.id}
                element={element}
                depth={0}
                onAddChild={onAddChild}
                onRemove={onRemove}
                onToggleExpanded={onToggleExpanded}
                onSelect={onSelect}
                onUpdateElement={onUpdateElement}
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
