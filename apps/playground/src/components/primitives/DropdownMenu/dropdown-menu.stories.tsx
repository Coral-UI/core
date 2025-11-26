import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Button } from '../Button/button'
import { DropdownMenu } from './dropdown-menu'

const meta = {
  title: 'Primitives/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Open</Button>,
    items: [{ key: 'item1', children: 'Item 1', onClick: () => console.log('Item 1'), closeOnClick: false }],
  },
}
