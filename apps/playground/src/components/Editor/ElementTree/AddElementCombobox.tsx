'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getElementTypeGroups } from '@/utils/elementTypes'
import { IconNewSection } from '@tabler/icons-react'
import * as React from 'react'

import { CoralElementType } from '@reallygoodwork/coral-core'

interface AddElementComboboxProps {
  validChildTypes: CoralElementType[]
  onSelect: (elementType: CoralElementType) => void
}

export function AddElementCombobox({ validChildTypes, onSelect }: AddElementComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const groups = getElementTypeGroups((elementType) => validChildTypes.includes(elementType.type))

  const handleSelect = (elementType: CoralElementType) => {
    onSelect(elementType)
    setOpen(false)
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon-sm" title="Add Child Element">
          <IconNewSection />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="end">
        <Command shouldFilter={false}>
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
        </Command>
      </PopoverContent>
    </Popover>
  )
}
