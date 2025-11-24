'use client'

import { Button } from '@/components/primitives/Button/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'

export function Combobox({
  options = [],
  value: initialValue,
  onChange,
  label,
  placeholder = 'Search...',
  noneFoundLabel = 'No options found.',
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  noneFoundLabel: string
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialValue || '')

  useEffect(() => {
    setValue(initialValue || '')
  }, [initialValue])

  const handleChange = (value: string) => {
    setValue(value)
    onChange(value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between mt-1">
          {value ? options.find((option) => option.value === value)?.label : label}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{noneFoundLabel}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    handleChange(option.value)
                    setOpen(false)
                  }}
                >
                  <CheckIcon className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
