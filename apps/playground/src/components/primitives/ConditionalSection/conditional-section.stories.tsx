import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { NumberInput } from '../NumberInput/number-input'
import { ConditionalSection } from './conditional-section'

const meta = {
  title: 'Primitives/ConditionalSection',
  component: ConditionalSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    show: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ConditionalSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    show: true,
    legend: 'Flexbox Options',
    children: (
      <>
        <NumberInput label="Flex Direction" defaultValue={1} /> <NumberInput label="Flex Direction" defaultValue={1} />
      </>
    ),
  },
}

export const Hidden: Story = {
  args: {
    show: false,
    legend: 'Hidden Section',
    children: <p>This content is hidden</p>,
  },
}

export const WithoutLegend: Story = {
  args: {
    show: true,
    children: <NumberInput label="Spacing" defaultValue={8} />,
  },
}

export const Interactive: Story = {
  args: {
    show: true,
    legend: 'Conditional Content',
    children: <NumberInput label="Value" defaultValue={100} />,
  },
  render: () => {
    const [show, setShow] = React.useState(true)
    return (
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show section
        </label>
        <ConditionalSection show={show} legend="Conditional Content">
          <p>This content appears when the checkbox is checked.</p>
          <NumberInput label="Value" defaultValue={100} />
        </ConditionalSection>
      </div>
    )
  },
}
