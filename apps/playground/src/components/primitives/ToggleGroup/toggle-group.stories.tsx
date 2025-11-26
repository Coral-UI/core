import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from '@tabler/icons-react'
import React from 'react'

import { ToggleGroup } from './toggle-group'

const meta = {
  title: 'Primitives/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'array',
    },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

const alignmentItems = [
  {
    ariaLabel: 'Align left',
    value: 'left',
    icon: <IconAlignLeft className="size-4" />,
  },
  {
    ariaLabel: 'Align center',
    value: 'center',
    icon: <IconAlignCenter className="size-4" />,
  },
  {
    ariaLabel: 'Align right',
    value: 'right',
    icon: <IconAlignRight className="size-4" />,
  },
]

export const Default: Story = {
  args: {
    items: alignmentItems,
    defaultValue: ['left'],
  },
}

export const Multiple: Story = {
  args: {
    items: alignmentItems,
    defaultValue: ['left', 'center'],
    multiple: true,
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(['left'])
    return <ToggleGroup items={alignmentItems} value={value} onValueChange={setValue} />
  },
}
