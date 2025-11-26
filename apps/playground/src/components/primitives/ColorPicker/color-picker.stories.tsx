import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/primitives/Button/button'
import React from 'react'

import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from './color-picker'

const meta = {
  title: 'Primitives/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultFormat: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl', 'hsb'],
    },
  },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('#3b82f6')
    return (
      <ColorPicker value={value} onValueChange={setValue} defaultFormat="hex">
        <ColorPickerTrigger asChild>
          <Button variant="colorPicker" className="flex items-center gap-2">
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect size="sm" defaultValue="hex" />
            <ColorPickerInput />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    )
  },
}

export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = React.useState('#ef4444')
    return (
      <ColorPicker value={value} onValueChange={setValue} defaultFormat="hex">
        <ColorPickerTrigger asChild>
          <Button variant="colorPicker" className="flex items-center gap-2">
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect size="sm" defaultValue="hex" />
            <ColorPickerInput />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    )
  },
}

export const RGBFormat: Story = {
  render: () => {
    const [value, setValue] = React.useState('#10b981')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('rgb')
    return (
      <ColorPicker
        value={value}
        onValueChange={setValue}
        format={format}
        onFormatChange={setFormat}
        defaultFormat="rgb"
      >
        <ColorPickerTrigger asChild>
          <Button variant="colorPicker" className="flex items-center gap-2">
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect size="sm" defaultValue="rgb" />
            <ColorPickerInput />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    )
  },
}

export const HSLFormat: Story = {
  render: () => {
    const [value, setValue] = React.useState('#8b5cf6')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('hsl')
    return (
      <ColorPicker
        value={value}
        onValueChange={setValue}
        format={format}
        onFormatChange={setFormat}
        defaultFormat="hsl"
      >
        <ColorPickerTrigger asChild>
          <Button variant="colorPicker" className="flex items-center gap-2">
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect size="sm" defaultValue="hsl" />
            <ColorPickerInput />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    )
  },
}

export const HSBFormat: Story = {
  render: () => {
    const [value, setValue] = React.useState('#f59e0b')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('hsb')
    return (
      <ColorPicker
        value={value}
        onValueChange={setValue}
        format={format}
        onFormatChange={setFormat}
        defaultFormat="hsb"
      >
        <ColorPickerTrigger asChild>
          <Button variant="colorPicker" className="flex items-center gap-2">
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect size="sm" defaultValue="hsb" />
            <ColorPickerInput />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    )
  },
}

export const WithAlpha: Story = {
  render: () => {
    const [value, setValue] = React.useState('rgba(59, 130, 246, 0.5)')
    return (
      <ColorPicker value={value} onValueChange={setValue} defaultFormat="hex">
        <ColorPickerTrigger asChild>
          <Button variant="colorPicker" className="flex items-center gap-2">
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect size="sm" defaultValue="hex" />
            <ColorPickerInput />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    )
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('#3b82f6')
    const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('hex')
    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-muted-foreground">Current value: {value}</div>
        <div className="text-sm text-muted-foreground">Current format: {format}</div>
        <ColorPicker
          value={value}
          onValueChange={setValue}
          format={format}
          onFormatChange={setFormat}
          defaultFormat="hex"
        >
          <ColorPickerTrigger asChild>
            <Button variant="colorPicker" className="flex items-center gap-2">
              <ColorPickerSwatch className="size-4" />
              {value}
            </Button>
          </ColorPickerTrigger>
          <ColorPickerContent>
            <ColorPickerArea />
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-2">
                <ColorPickerHueSlider />
                <ColorPickerAlphaSlider />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerFormatSelect size="sm" defaultValue="hex" />
              <ColorPickerInput />
            </div>
          </ColorPickerContent>
        </ColorPicker>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = React.useState('#3b82f6')
    return (
      <ColorPicker value={value} onValueChange={setValue} defaultFormat="hex" disabled>
        <ColorPickerTrigger asChild>
          <Button variant="colorPicker" className="flex items-center gap-2" disabled>
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
              <ColorPickerAlphaSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect size="sm" defaultValue="hex" />
            <ColorPickerInput />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    )
  },
}
