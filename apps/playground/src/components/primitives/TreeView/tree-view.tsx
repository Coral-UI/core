'use client'

import { cn, omitUndefined } from '@/lib/utils'
// import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion'
import { IconChevronRight } from '@tabler/icons-react'
import React from 'react'

import './tree-view.css'

interface TreeDataItem {
  id: string
  name: string
  icon?: React.ElementType
  selectedIcon?: React.ElementType
  openIcon?: React.ElementType
  children?: TreeDataItem[]
  actions?: React.ReactNode
  onClick?: () => void
  draggable?: boolean
  droppable?: boolean
  disabled?: boolean
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem
  initialSelectedItemId?: string
  onSelectChange?: (item: TreeDataItem | undefined) => void
  expandAll?: boolean
  defaultNodeIcon?: React.ElementType | undefined
  defaultLeafIcon?: React.ElementType | undefined
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSelectedItemId,
      onSelectChange,
      expandAll,
      defaultLeafIcon,
      defaultNodeIcon,
      className,
      onDocumentDrag,
      ...props
    },
    ref,
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(initialSelectedItemId)

    const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

    // Sync internal state with initialSelectedItemId prop when it changes externally
    React.useEffect(() => {
      setSelectedItemId(initialSelectedItemId)
    }, [initialSelectedItemId])

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id)
        if (onSelectChange) {
          onSelectChange(item)
        }
      },
      [onSelectChange],
    )

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      setDraggedItem(item)
    }, [])

    const handleDrop = React.useCallback(
      (targetItem: TreeDataItem) => {
        if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
          onDocumentDrag(draggedItem, targetItem)
        }
        setDraggedItem(null)
      },
      [draggedItem, onDocumentDrag],
    )

    const expandedItemIds = React.useMemo(() => {
      if (!initialSelectedItemId) {
        return [] as string[]
      }

      const ids: string[] = []

      function walkTreeItems(items: TreeDataItem[] | TreeDataItem, targetId: string) {
        if (items instanceof Array) {
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i]!.id)
            if (walkTreeItems(items[i]!, targetId) && !expandAll) {
              return true
            }
            if (!expandAll) ids.pop()
          }
        } else if (!expandAll && items.id === targetId) {
          return true
        } else if (items.children) {
          return walkTreeItems(items.children, targetId)
        }
      }

      walkTreeItems(data, initialSelectedItemId)
      return ids
    }, [data, expandAll, initialSelectedItemId])

    return (
      <div className={cn('tree-view', className)}>
        <TreeItem
          data={data}
          ref={ref}
          {...omitUndefined({
            selectedItemId,
            handleDragStart,
            handleDrop,
            defaultNodeIcon,
            defaultLeafIcon,
          })}
          handleSelectChange={handleSelectChange}
          expandedItemIds={expandedItemIds}
          draggedItem={draggedItem}
          {...props}
        />
        <div
          className="tree-view-drop-target"
          onDrop={(_e) => {
            handleDrop({ id: '', name: 'parent_div' })
          }}
        ></div>
      </div>
    )
  },
)
TreeView.displayName = 'TreeView'

type TreeItemProps = TreeProps & {
  selectedItemId?: string | undefined
  handleSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  defaultNodeIcon?: React.ElementType | undefined
  defaultLeafIcon?: React.ElementType | undefined
  handleDragStart?: ((item: TreeDataItem) => void) | undefined
  handleDrop?: ((item: TreeDataItem) => void) | undefined
  draggedItem: TreeDataItem | null
  level?: number
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      defaultNodeIcon,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      level = 1,
      ...props
    },
    ref,
  ) => {
    if (!(data instanceof Array)) {
      data = [data]
    }
    return (
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.children ? (
              <TreeNode
                item={item}
                {...omitUndefined({
                  selectedItemId,
                  handleDragStart,
                  handleDrop,
                })}
                expandedItemIds={expandedItemIds}
                handleSelectChange={handleSelectChange}
                defaultNodeIcon={defaultNodeIcon}
                defaultLeafIcon={defaultLeafIcon}
                draggedItem={draggedItem}
                level={level}
              />
            ) : (
              <TreeLeaf
                item={item}
                {...omitUndefined({
                  selectedItemId,
                  handleDragStart,
                  handleDrop,
                })}
                handleSelectChange={handleSelectChange}
                defaultLeafIcon={defaultLeafIcon}
                draggedItem={draggedItem}
              />
            )}
          </li>
        ))}
      </ul>
    )
  },
)
TreeItem.displayName = 'TreeItem'

const TreeNode = ({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
  handleDragStart,
  handleDrop,
  draggedItem,
  level = 1,
}: {
  item: TreeDataItem
  handleSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  selectedItemId?: string | undefined
  defaultNodeIcon?: React.ElementType | undefined
  defaultLeafIcon?: React.ElementType | undefined
  handleDragStart?: ((item: TreeDataItem) => void) | undefined
  handleDrop?: ((item: TreeDataItem) => void) | undefined
  draggedItem: TreeDataItem | null
  level?: number
}) => {
  const [value, setValue] = React.useState(expandedItemIds.includes(item.id) ? [item.id] : [])
  const [isDragOver, setIsDragOver] = React.useState(false)

  const onDragStart = (e: React.DragEvent) => {
    if (!item.draggable) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', item.id)
    handleDragStart?.(item)
  }

  const onDragOver = (e: React.DragEvent) => {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault()
      setIsDragOver(true)
    }
  }

  const onDragLeave = () => {
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleDrop?.(item)
  }

  return (
    <BaseAccordion.Root multiple={true} value={value} onValueChange={(s) => setValue(s)}>
      <BaseAccordion.Item value={item.id}>
        <AccordionTrigger
          className={cn(
            'tree-variant',
            selectedItemId === item.id && 'selected-tree-variant',
            isDragOver && 'drag-over-tree-variant',
          )}
          onClick={() => {
            handleSelectChange(item)
            item.onClick?.()
          }}
          draggable={!!item.draggable}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <TreeIcon
            item={item}
            isSelected={true}
            isOpen={value.includes(item.id)}
            {...(defaultNodeIcon !== undefined && { default: defaultNodeIcon })}
          />
          <span className={cn('tree-leaf-name', selectedItemId === item.id ? 'selected' : '')}>{item.name}</span>
        </AccordionTrigger>
        {selectedItemId === item.id && (
          <TreeActions isSelected={selectedItemId === item.id}>{item.actions}</TreeActions>
        )}

        <AccordionContent
          className="tree-leaf-item-wrapper"
          level={level}
          style={{ '--tree-level': level } as React.CSSProperties}
        >
          <TreeItem
            className="tree-leaf-item"
            data={item.children ? item.children : item}
            {...omitUndefined({
              selectedItemId,
              handleDragStart,
              handleDrop,
              defaultLeafIcon,
              defaultNodeIcon,
            })}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            draggedItem={draggedItem}
            level={level + 1}
          />
        </AccordionContent>
      </BaseAccordion.Item>
    </BaseAccordion.Root>
  )
}

const TreeLeaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
    selectedItemId?: string | undefined
    handleSelectChange: (item: TreeDataItem | undefined) => void
    defaultLeafIcon?: React.ElementType | undefined
    handleDragStart?: ((item: TreeDataItem) => void) | undefined
    handleDrop?: ((item: TreeDataItem) => void) | undefined
    draggedItem: TreeDataItem | null
  }
>(
  (
    {
      className,
      item,
      selectedItemId,
      handleSelectChange,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      ...props
    },
    ref,
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false)

    const onDragStart = (e: React.DragEvent) => {
      if (!item.draggable || item.disabled) {
        e.preventDefault()
        return
      }
      e.dataTransfer.setData('text/plain', item.id)
      handleDragStart?.(item)
    }

    const onDragOver = (e: React.DragEvent) => {
      if (item.droppable !== false && !item.disabled && draggedItem && draggedItem.id !== item.id) {
        e.preventDefault()
        setIsDragOver(true)
      }
    }

    const onDragLeave = () => {
      setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
      if (item.disabled) return
      e.preventDefault()
      setIsDragOver(false)
      handleDrop?.(item)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'tree-leaf',
          'tree-variant',
          className,
          selectedItemId === item.id && 'selected-tree-variant',
          isDragOver && 'drag-over-tree-variant',
          item.disabled && 'tree-leaf-disabled',
        )}
        onClick={() => {
          if (item.disabled) return
          handleSelectChange(item)
          item.onClick?.()
        }}
        draggable={!!item.draggable && !item.disabled}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        {...props}
      >
        <TreeIcon item={item} isSelected={true} {...(defaultLeafIcon !== undefined && { default: defaultLeafIcon })} />
        <span className={cn('tree-leaf-name', selectedItemId === item.id ? 'selected' : '')}>{item.name}</span>
        <TreeActions isSelected={selectedItemId === item.id && !item.disabled}>{item.actions}</TreeActions>
      </div>
    )
  },
)
TreeLeaf.displayName = 'TreeLeaf'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Header className="tree-leaf-heading">
    <BaseAccordion.Trigger ref={ref} className={cn('tree-leaf-trigger', className)} {...props}>
      <IconChevronRight />
      {children}
    </BaseAccordion.Trigger>
  </BaseAccordion.Header>
))
AccordionTrigger.displayName = BaseAccordion.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel> & { level?: number }
>(({ className, children, level = 0, ...props }, ref) => (
  <BaseAccordion.Panel ref={ref} className={cn('tree-leaf-content', className)} data-level={level} {...props}>
    {children}
  </BaseAccordion.Panel>
))
AccordionContent.displayName = BaseAccordion.Panel.displayName

const TreeIcon = ({
  item,
  isOpen,
  isSelected,
  default: defaultIcon,
}: {
  item: TreeDataItem
  isOpen?: boolean
  isSelected?: boolean
  default?: React.ElementType | undefined
}) => {
  let Icon = defaultIcon
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon
  } else if (item.icon) {
    Icon = item.icon
  }
  return Icon ? <Icon className="tree-leaf-icon" /> : <></>
}

const TreeActions = ({ children, isSelected }: { children: React.ReactNode; isSelected: boolean }) => {
  return <div className={cn(isSelected ? 'selected' : '', 'tree-leaf-actions')}>{children}</div>
}

export { TreeView, type TreeDataItem }
