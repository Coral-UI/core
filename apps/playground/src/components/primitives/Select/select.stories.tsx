import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Select,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from './select'

const meta = {
  title: 'Primitives/Select',
  component: SelectInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
} satisfies Meta<typeof SelectInput>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
]

export const Default: Story = {
  args: {
    items,
    defaultValue: 'apple',
  },
}

export const Small: Story = {
  args: {
    items,
    defaultValue: 'banana',
    size: 'sm',
  },
}

export const WithLeadingIcon: Story = {
  args: {
    items,
    defaultValue: 'cherry',
    leadingIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2v20M2 12h20" strokeWidth="2" />
      </svg>
    ),
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('apple')
    return <SelectInput items={items} value={value} onValueChange={setValue} />
  },
}

export const Composable: Story = {
  render: () => (
    <Select items={items} defaultValue="apple">
      <SelectTrigger className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner>
          <SelectPopup>
            <SelectList>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectList>
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </Select>
  ),
}
