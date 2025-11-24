import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Input } from '../Input/input'
import { TextAreaField } from '../TextAreaField/TextAreaField'
import { Field } from './Field'

const meta = {
  title: 'Primitives/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    invalid: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Name',
    children: <Input placeholder="Enter your name" />,
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Email',
    description: 'We will never share your email with anyone else.',
    children: <Input type="email" placeholder="Enter your email" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Password',
    error: 'Password must be at least 8 characters',
    children: <Input type="password" placeholder="Enter your password" />,
  },
}

export const WithMultipleErrors: Story = {
  args: {
    label: 'Password',
    error: ['Password must be at least 8 characters', 'Password must contain a number'],
    children: <Input type="password" placeholder="Enter your password" />,
  },
}

export const Required: Story = {
  args: {
    label: 'Required Field',
    required: true,
    children: <Input placeholder="This field is required" required />,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    disabled: true,
    children: <Input value="Disabled value" disabled />,
  },
}

export const WithTextarea: Story = {
  args: {
    label: 'Description',
    description: 'Please provide a detailed description.',
    children: <TextAreaField placeholder="Enter your description..." rows={4} />,
  },
}

export const TextareaWithError: Story = {
  args: {
    label: 'Comments',
    error: 'Comments must be at least 10 characters',
    children: <TextAreaField placeholder="Enter your comments..." rows={4} />,
  },
}

export const InvalidState: Story = {
  args: {
    label: 'Field',
    invalid: true,
    children: <Input placeholder="This field is invalid" />,
  },
}

export const AllStates: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Field label="Default">
        <Input placeholder="Default state" />
      </Field>
      <Field label="With Description" description="This is a helpful description">
        <Input placeholder="Has description" />
      </Field>
      <Field label="With Error" error="This field has an error">
        <Input placeholder="Has error" />
      </Field>
      <Field label="Required" required>
        <Input placeholder="Required field" required />
      </Field>
      <Field label="Disabled" disabled>
        <Input value="Disabled value" disabled />
      </Field>
    </div>
  ),
}
