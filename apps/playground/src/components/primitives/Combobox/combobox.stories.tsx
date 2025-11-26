import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Combobox } from './combobox'

const meta = {
  title: 'Primitives/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: ['Item 1', 'Item 2', 'Item 3'],
  },
}
