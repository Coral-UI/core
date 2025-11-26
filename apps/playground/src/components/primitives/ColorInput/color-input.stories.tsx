import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ColorInput } from './color-input'
import { IconPalette, IconBackground } from '@tabler/icons-react'

const meta = {
  title: 'Primitives/ColorInput',
  component: ColorInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultFormat: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl', 'hsb'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'transparent'],
    },
  },
} satisfies Meta<typeof ColorInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('#3b82f6')
    return <ColorInput label="Color" value={value} onValueChange={setValue} defaultFormat="hex" />
  },
}

export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = React.useState('#ef4444')
    return <ColorInput label="Background Color" value={value} onValueChange={setValue} defaultFormat="hex" />
  },
}

export const WithLeadingIcon: Story = {
  render: () => {
    const [value, setValue] = React.useState('#10b981')
    return (
      <ColorInput
        label="Text Color"
        value={value}
        onValueChange={setValue}
        defaultFormat="hex"
        leadingIcon={<IconPalette className="size-4" />}
      />
    )
  },
}

export const SmallSize: Story = {
  render: () => {
    const [value, setValue] = React.useState('#8b5cf6')
    return (
      <ColorInput
        label="Color"
        value={value}
        onValueChange={setValue}
        defaultFormat="hex"
        size="sm"
        leadingIcon={<IconPalette className="size-4" />}
      />
    )
  },
}

export const LargeSize: Story = {
  render: () => {
    const [value, setValue] = React.useState('#f59e0b')
    return (
      <ColorInput
        label="Color"
        value={value}
        onValueChange={setValue}
        defaultFormat="hex"
        size="lg"
        leadingIcon={<IconPalette className="size-4" />}
      />
    )
  },
}

export const TransparentVariant: Story = {
  render: () => {
    const [value, setValue] = React.useState('#ec4899')
    return (
      <ColorInput
        label="Border Color"
        value={value}
        onValueChange={setValue}
        defaultFormat="hex"
        variant="transparent"
        leadingIcon={<IconBackground className="size-4" />}
      />
    )
  },
}

export const HiddenLabel: Story = {
  render: () => {
    const [value, setValue] = React.useState('#06b6d4')
    return (
      <ColorInput
        label="Color"
        value={value}
        onValueChange={setValue}
        defaultFormat="hex"
        hideLabel={true}
        leadingIcon={<IconPalette className="size-4" />}
      />
    )
  },
}

export const RGBFormat: Story = {
  render: () => {
    const [value, setValue] = React.useState('#10b981')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('rgb')
    return (
      <ColorInput
        label="Color"
        value={value}
        onValueChange={setValue}
        format={format}
        defaultFormat="rgb"
        onFormatChange={setFormat}
      />
    )
  },
}

export const HSLFormat: Story = {
  render: () => {
    const [value, setValue] = React.useState('#8b5cf6')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('hsl')
    return (
      <ColorInput
        label="Color"
        value={value}
        onValueChange={setValue}
        format={format}
        defaultFormat="hsl"
        onFormatChange={setFormat}
      />
    )
  },
}

export const HSBFormat: Story = {
  render: () => {
    const [value, setValue] = React.useState('#f59e0b')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('hsb')
    return (
      <ColorInput
        label="Color"
        value={value}
        onValueChange={setValue}
        format={format}
        defaultFormat="hsb"
        onFormatChange={setFormat}
      />
    )
  },
}

export const WithAlpha: Story = {
  render: () => {
    const [value, setValue] = React.useState('rgba(59, 130, 246, 0.5)')
    return <ColorInput label="Color with Alpha" value={value} onValueChange={setValue} defaultFormat="hex" />
  },
}

export const Invalid: Story = {
  render: () => {
    const [value, setValue] = React.useState('#invalid')
    return (
      <ColorInput
        label="Color"
        value={value}
        onValueChange={setValue}
        defaultFormat="hex"
        invalid={true}
      />
    )
  },
}

export const Empty: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    return <ColorInput label="Color" value={value} onValueChange={setValue} defaultFormat="hex" />
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('#3b82f6')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('hex')
    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-muted-foreground">Current value: {value || '(empty)'}</div>
        <div className="text-sm text-muted-foreground">Current format: {format}</div>
        <ColorInput
          label="Color"
          value={value}
          onValueChange={setValue}
          format={format}
          defaultFormat="hex"
          onFormatChange={setFormat}
          leadingIcon={<IconPalette className="size-4" />}
        />
      </div>
    )
  },
}

export const AllSizes: Story = {
  render: () => {
    const [value1, setValue1] = React.useState('#3b82f6')
    const [value2, setValue2] = React.useState('#10b981')
    const [value3, setValue3] = React.useState('#f59e0b')
    return (
      <div className="flex flex-col gap-4">
        <ColorInput label="Small" value={value1} onValueChange={setValue1} defaultFormat="hex" size="sm" />
        <ColorInput label="Default" value={value2} onValueChange={setValue2} defaultFormat="hex" size="default" />
        <ColorInput label="Large" value={value3} onValueChange={setValue3} defaultFormat="hex" size="lg" />
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => {
    const [value1, setValue1] = React.useState('#3b82f6')
    const [value2, setValue2] = React.useState('#10b981')
    return (
      <div className="flex flex-col gap-4">
        <ColorInput
          label="Default Variant"
          value={value1}
          onValueChange={setValue1}
          defaultFormat="hex"
          variant="default"
        />
        <ColorInput
          label="Transparent Variant"
          value={value2}
          onValueChange={setValue2}
          defaultFormat="hex"
          variant="transparent"
        />
      </div>
    )
  },
}
