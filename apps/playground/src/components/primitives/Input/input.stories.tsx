import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Field } from '../Field/Field'
import { Input } from './input'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Input',
  },
}

export const InvalidState: Story = {
  args: {
    placeholder: 'Input',
  },
  render: () => (
    <Field label="Input" error="This field has an error">
      <Input placeholder="Input" />
    </Field>
  ),
}
