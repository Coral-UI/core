import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { TextAreaField } from './TextAreaField'

const meta = {
  title: 'Primitives/TextAreaField',
  component: TextAreaField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    rows: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TextAreaField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your description...',
    rows: 3,
  },
}

export const WithValue: Story = {
  args: {
    value: 'This is some text',
    placeholder: 'Enter your description...',
    rows: 3,
  },
}

export const Disabled: Story = {
  args: {
    value: 'This field is disabled',
    disabled: true,
    rows: 3,
  },
}

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'This is a default value',
    placeholder: 'Enter your notes...',
    rows: 3,
  },
}

export const CustomRows: Story = {
  args: {
    rows: 8,
    placeholder: 'Enter a longer text...',
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | undefined>('')

    return (
      <div className="flex flex-col gap-2 w-80">
        <TextAreaField value={value} onChange={setValue} placeholder="Type something..." rows={4} />
        <p className="text-xs text-muted-foreground">Character count: {value?.length || 0}</p>
      </div>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <TextAreaField placeholder="Default state" rows={3} />
      <TextAreaField placeholder="Required field" required rows={3} />
      <TextAreaField value="Disabled value" disabled rows={3} />
      <TextAreaField placeholder="Custom rows" rows={6} />
    </div>
  ),
}
