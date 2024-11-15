import { CaretUpDown } from '@phosphor-icons/react'
import React from 'react'

type SelectProps = {
  options: { value: string; label: string }[]
  value: string | undefined
  onChange: (value: string) => void
  ref?: React.Ref<HTMLSelectElement>
  name?: string
}

export const Select = React.forwardRef(
  ({ options, value, onChange, name }: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    return (
      <div className="relative w-[180px] border border-border bg-transparent rounded-md">
        <select
          name={name}
          ref={ref}
          className="flex h-9 items-center justify-between  whitespace-nowrap px-3 py-2 text-xs font-semibold tracking-tight shadow-sm ring-offset-background rounded-md  bg-input placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 appearance-none w-full border-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretUpDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    )
  },
)
