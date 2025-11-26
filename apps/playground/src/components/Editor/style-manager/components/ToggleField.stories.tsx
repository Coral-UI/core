import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlignItemsCenter,
  AlignItemsJustify,
  AlignItemsLeft,
  AlignItemsRight,
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from '@/components/Editor/style-manager/icons'
import React from 'react'

import { useAppForm } from '../formContext'
import { ToggleField } from './ToggleField'

const meta = {
  title: 'Style Manager/ToggleField',
  component: ToggleField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleField>

export default meta
type Story = StoryObj<typeof meta>

// Wrapper component to provide form context
const ToggleFieldWrapper = ({
  label,
  options,
  defaultValue,
}: {
  label: string
  options: { value: string; label: string; icon?: React.ReactNode; tooltip?: React.ReactNode }[]
  defaultValue?: string
}) => {
  const form = useAppForm({
    defaultValues: {
      alignment: defaultValue,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="w-96"
    >
      <form.Field name="alignment">
        <ToggleField label={label} options={options} />
      </form.Field>
      <div className="mt-4 text-sm text-muted-foreground">Current value: {form.state.values.alignment || 'none'}</div>
    </form>
  )
}

export const TextAlignment: Story = {
  render: () => (
    <ToggleFieldWrapper
      label="Text Alignment"
      defaultValue="left"
      options={[
        { value: 'left', label: 'Align Left', icon: <AlignItemsLeft /> },
        { value: 'center', label: 'Align Center', icon: <AlignItemsCenter /> },
        { value: 'right', label: 'Align Right', icon: <AlignItemsRight /> },
        { value: 'justify', label: 'Justify', icon: <AlignItemsJustify /> },
      ]}
    />
  ),
}

export const TextFormatting: Story = {
  render: () => (
    <ToggleFieldWrapper
      label="Text Formatting"
      defaultValue="bold"
      options={[
        { value: 'bold', label: 'Bold', icon: <Bold /> },
        { value: 'italic', label: 'Italic', icon: <Italic /> },
        { value: 'underline', label: 'Underline', icon: <Underline /> },
        { value: 'strikethrough', label: 'Strikethrough', icon: <Strikethrough /> },
      ]}
    />
  ),
}

export const SingleOption: Story = {
  render: () => (
    <ToggleFieldWrapper
      label="Display Mode"
      defaultValue="grid"
      options={[{ value: 'grid', label: 'Grid', icon: <AlignItemsCenter /> }]}
    />
  ),
}

export const WithoutIcons: Story = {
  render: () => (
    <ToggleFieldWrapper
      label="Theme"
      defaultValue="light"
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'auto', label: 'Auto' },
      ]}
    />
  ),
}

export const NoDefaultValue: Story = {
  render: () => (
    <ToggleFieldWrapper
      label="Selection"
      options={[
        { value: 'option1', label: 'Option 1', icon: <IconAlignLeft /> },
        { value: 'option2', label: 'Option 2', icon: <IconAlignCenter /> },
        { value: 'option3', label: 'Option 3', icon: <IconAlignRight /> },
      ]}
    />
  ),
}

export const ManyOptions: Story = {
  render: () => (
    <ToggleFieldWrapper
      label="Many Options"
      defaultValue="option1"
      options={[
        { value: 'option1', label: 'Option 1', icon: <IconAlignLeft /> },
        { value: 'option2', label: 'Option 2', icon: <IconAlignCenter /> },
        { value: 'option3', label: 'Option 3', icon: <IconAlignRight /> },
        { value: 'option4', label: 'Option 4', icon: <IconAlignJustify /> },
        { value: 'option5', label: 'Option 5', icon: <IconBold /> },
        { value: 'option6', label: 'Option 6', icon: <IconItalic /> },
      ]}
    />
  ),
}

export const WithValidation: Story = {
  render: () => {
    const form = useAppForm({
      defaultValues: {
        requiredField: undefined,
      },
      onSubmit: async ({ value }) => {
        console.log('Form submitted:', value)
      },
    })

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="w-96"
      >
        <form.Field
          name="requiredField"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return 'This field is required'
              }
              return undefined
            },
          }}
        >
          <ToggleField
            label="Required Field"
            options={[
              { value: 'option1', label: 'Option 1', icon: <IconAlignLeft /> },
              { value: 'option2', label: 'Option 2', icon: <IconAlignCenter /> },
              { value: 'option3', label: 'Option 3', icon: <IconAlignRight /> },
            ]}
          />
        </form.Field>
        <div className="mt-4 text-sm text-muted-foreground">
          Current value: {form.state.values.requiredField || 'none'}
        </div>
        {form.state.errors.length > 0 && (
          <div className="mt-2 text-sm text-destructive-fg">
            Form errors: {form.state.errors.map((e) => e.message).join(', ')}
          </div>
        )}
      </form>
    )
  },
}
