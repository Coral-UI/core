import { ChevronDown, ChevronRight, Plus, Trash2, Type, Square, Circle } from 'lucide-react'
import { useState } from 'react'
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

interface ElementTreeItemProps {
  element: ElementTreeNode
  depth: number
  onAddChild: (parentId: string, elementType: CoralElementType) => void
  onRemove: (elementId: string) => void
  onToggleExpanded: (elementId: string) => void
  onSelect: (elementId: string) => void
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
}

const ElementTreeItem = ({ 
  element, 
  depth, 
  onAddChild, 
  onRemove, 
  onToggleExpanded, 
  onSelect,
  onUpdateElement 
}: ElementTreeItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(element.name)

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

  return (
    <div className="w-full">
      <div 
        className={`flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer group ${
          element.isSelected ? 'bg-primary/10 border-l-2 border-primary' : ''
        }`}
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
        onClick={() => onSelect(element.id)}
      >
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
          <span className="text-xs text-muted-foreground font-mono">
            {element.elementType}
          </span>
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
              className="text-sm flex-1 min-w-0 truncate"
              onDoubleClick={() => setIsEditing(true)}
            >
              {element.name}
            </span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="text-xs text-muted-foreground px-2 py-1">Add Child Element</div>
              <DropdownMenuSeparator />
              {ELEMENT_TYPES.map((elementType) => (
                <DropdownMenuItem
                  key={elementType.type}
                  onClick={() => onAddChild(element.id, elementType.type)}
                  className="flex items-center gap-2"
                >
                  {elementType.icon}
                  <span>{elementType.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {elementType.type}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
        </div>
      </div>

      {hasChildren && element.isExpanded && (
        <div>
          {element.children?.map((child) =>
            typeof child === 'object' && 'id' in child ? (
              <ElementTreeItem
                key={child.id as string}
                element={child as ElementTreeNode}
                depth={depth + 1}
                onAddChild={onAddChild}
                onRemove={onRemove}
                onToggleExpanded={onToggleExpanded}
                onSelect={onSelect}
                onUpdateElement={onUpdateElement}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

interface ElementTreeProps {
  elements: ElementTreeNode[]
  onAddChild: (parentId: string, elementType: CoralElementType) => void
  onAddRoot: (elementType: CoralElementType) => void
  onRemove: (elementId: string) => void
  onToggleExpanded: (elementId: string) => void
  onSelect: (elementId: string) => void
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
}

export const ElementTree = ({ 
  elements, 
  onAddChild,
  onAddRoot, 
  onRemove, 
  onToggleExpanded, 
  onSelect,
  onUpdateElement 
}: ElementTreeProps) => {
  const rootElements = elements.filter(el => !el.parentId)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-medium">Elements</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="text-xs text-muted-foreground px-2 py-1">Add Root Element</div>
            <DropdownMenuSeparator />
            {ELEMENT_TYPES.map((elementType) => (
              <DropdownMenuItem
                key={elementType.type}
                onClick={() => onAddRoot(elementType.type)}
                className="flex items-center gap-2"
              >
                {elementType.icon}
                <span>{elementType.label}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {elementType.type}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto">
        {rootElements.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No elements yet. Click the + button to add your first element.
          </div>
        ) : (
          rootElements.map((element) => (
            <ElementTreeItem
              key={element.id}
              element={element}
              depth={0}
              onAddChild={onAddChild}
              onRemove={onRemove}
              onToggleExpanded={onToggleExpanded}
              onSelect={onSelect}
              onUpdateElement={onUpdateElement}
            />
          ))
        )}
      </div>
    </div>
  )
}