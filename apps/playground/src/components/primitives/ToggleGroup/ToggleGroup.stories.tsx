import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconBrandReact, IconHtml } from '@tabler/icons-react'
import React from 'react'

import { ToggleGroup } from './ToggleGroup'

const meta = {
  title: 'Primitives/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [{ render: () => <IconHtml /> }, { render: () => <IconBrandReact /> }],
  },
  render: (args) => <ToggleGroup {...args} />,
}
