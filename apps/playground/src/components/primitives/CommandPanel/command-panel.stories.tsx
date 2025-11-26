import { CommandPanel } from './command-panel'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { IconSquare } from '@tabler/icons-react'

const meta = {
  title: 'Primitives/CommandPanel',
  component: CommandPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommandPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSuggestionSelect: (item: string) => {
      console.log('suggestion selected', item)
    },
    // open: true,
    // onOpenChange: () => {},
    items: [{ label: 'Item 1', icon: <IconSquare />, shortcut: 'Ctrl+1' }, { label: 'Item 2', icon: <IconSquare />, shortcut: 'Ctrl+2' }, { label: 'Item 3', icon: <IconSquare />, shortcut: 'Ctrl+3' }],
    suggestions: [{ label: 'Suggestion 1', icon: <IconSquare />, shortcut: 'Ctrl+1' }, { label: 'Suggestion 2', icon: <IconSquare />, shortcut: 'Ctrl+2' }, { label: 'Suggestion 3', icon: <IconSquare />, shortcut: 'Ctrl+3' }],
  },
}