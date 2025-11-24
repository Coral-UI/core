'use client'

import { Button } from '@/components/primitives/Button/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ELEMENT_TYPE_DEFINITIONS, getElementTypeGroups } from '@/utils/elementTypes'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { CoralElementType } from '@reallygoodwork/coral-core'

interface ElementTypeComboboxProps {
  value: CoralElementType
  onChange: (value: CoralElementType) => void
}

export function ElementTypeCombobox({ value, onChange }: ElementTypeComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const groups = getElementTypeGroups()
  const selectedElement = ELEMENT_TYPE_DEFINITIONS.find((el) => el.type === value)

  const handleSelect = (elementType: CoralElementType) => {
    onChange(elementType)
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
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-9">
          <div className="flex items-center gap-2">
            {selectedElement?.icon}
            <span>{selectedElement?.label || 'Select element type'}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
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
                    <Check className={cn('h-4 w-4', value === elementType.type ? 'opacity-100' : 'opacity-0')} />
                    {elementType.icon}
                    <span className="text-xs flex-1">{elementType.label}</span>
                    <span className="text-xxs text-muted-foreground font-mono tabular-nums uppercase">
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
