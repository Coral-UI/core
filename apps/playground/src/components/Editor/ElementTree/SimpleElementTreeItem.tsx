import { Button } from '@/components/ui/button'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { getValidChildTypes } from '@/utils/elementHierarchy'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconTrash } from '@tabler/icons-react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'

import { CoralElementType } from '@reallygoodwork/coral-core'

import { AddElementCombobox } from './AddElementCombobox'

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

export const SimpleElementTreeItem = ({
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
                  allElements={allElements ?? []}
                />
              ) : null,
            )}
          </div>
        </SortableContext>
      )}
    </div>
  )
}
