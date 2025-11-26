'use client'

import { Button } from '@/components/primitives/Button/button'
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CommandPanel } from '@/components/primitives/CommandPanel/command-panel'
import { Popover } from '@/components/primitives/Popover/popover'
import { getElementTypeGroups } from '@/utils/elementTypes'
import { IconPlus } from '@tabler/icons-react'
import * as React from 'react'

import { CoralElementType } from '@reallygoodwork/coral-core'

interface AddElementComboboxProps {
  validChildTypes: CoralElementType[]
  onSelect: (elementType: CoralElementType) => void
  onOpenChange?: (open: boolean) => void
}

export function AddElementCombobox({ validChildTypes, onSelect, onOpenChange }: AddElementComboboxProps) {
  const [search, setSearch] = React.useState('')

  const groups = getElementTypeGroups((elementType) => validChildTypes.includes(elementType.type))

  const handleSelect = (elementType: string) => {
    onSelect(elementType as CoralElementType)
    onOpenChange?.(false)
    setSearch('')
  }

  // Filter groups based on search
  const filteredGroups = React.useMemo(() => {
    if (!search) return groups

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.type.toLowerCase().includes(search.toLowerCase()) ||
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.group.toLowerCase().includes(search.toLowerCase()),
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [groups, search])

  return (
    <Popover
      trigger={
        <Button variant="elementPreview" size="icon-sm" title="Add Child Element">
          <IconPlus />
        </Button>
      }
    >
      <CommandPanel
        items={filteredGroups.flatMap((group) =>
          group.items.map((item) => ({ label: item.label, icon: item.icon, shortcut: item.type })),
        )}
        suggestions={[]}
        onSuggestionSelect={handleSelect}
      />
      {/* <PopoverContent
        className="w-[280px] p-0 z-20000"
        align="end"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onInteractOutside={(e) => {
          // Prevent closing when clicking on hit zones or interaction layer
          const target = e.target as HTMLElement
          if (target.closest('[data-debug-zone]') || target.closest('[data-element-id]')) {
            e.preventDefault()
          }
        }}
      > */}
      {/* <Command shouldFilter={false}>
        <CommandInput placeholder="Search elements..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>No elements found.</CommandEmpty>
          {filteredGroups.map((group) => (
            <CommandGroup key={group.name} heading={group.name}>
              {group.items.map((elementType) => (
                <CommandItem
                  key={elementType.type}
                  value={elementType.type}
                  onSelect={() => handleSelect(elementType.type)}
                  className="flex items-center gap-2"
                >
                  {elementType.icon}
                  <span className="text-xs flex-1">{elementType.label}</span>
                  <span className="text-xxs text-muted-foreground font-mono tabular-nums uppercase tracking-widest">
                    {elementType.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command> */}
      {/* </PopoverContent> */}
    </Popover>
  )
}
