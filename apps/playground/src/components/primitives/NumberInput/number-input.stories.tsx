import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { NumberInput } from './number-input'

const meta = {
  title: 'Primitives/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
    hideControls: {
      control: 'boolean',
    },
    hideLabel: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Width',
    defaultValue: 100,
  },
}

export const Small: Story = {
  args: {
    label: 'Width',
    size: 'sm',
    defaultValue: 50,
  },
}

export const WithUnit: Story = {
  args: {
    label: 'Padding',
    defaultValue: 16,
    unitValue: 'px',
    onUnitChange: (value) => console.log('Unit changed:', value),
  },
}

export const WithoutControls: Story = {
  args: {
    label: 'Opacity',
    defaultValue: 0.5,
    hideControls: true,
    min: 0,
    max: 1,
    step: 0.1,
  },
}

export const WithError: Story = {
  args: {
    label: 'Width',
    value: -10,
    error: 'Value must be positive',
    min: 0,
  },
}

export const AutoPlaceholder: Story = {
  args: {
    label: 'Width',
    placeholder: 'auto',
    unitValue: 'auto',
  },
}

export const CustomUnitOptions: Story = {
  args: {
    label: 'Font Size',
    defaultValue: 16,
    unitOptions: [
      { label: 'px', value: 'px' },
      { label: 'rem', value: 'rem' },
      { label: 'em', value: 'em' },
    ],
    unitValue: 'px',
  },
}

export const WithLeadingIcon: Story = {
  args: {
    label: 'Spacing',
    defaultValue: 8,
    leadingIcon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2v20M2 12h20" strokeWidth="2" />
      </svg>
    ),
  },
}
