import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react'
import { Toggle } from './toggle'

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'active'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'square'],
    },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ariaLabel: 'Bold',
    icon: <IconBold className="size-4" />,
    defaultValue: false,
  },
}

export const Pressed: Story = {
  args: {
    ariaLabel: 'Bold',
    icon: <IconBold className="size-4" />,
    defaultPressed: true,
  },
}

export const Small: Story = {
  args: {
    ariaLabel: 'Italic',
    icon: <IconItalic className="size-4" />,
    size: 'sm',
  },
}

export const Square: Story = {
  args: {
    ariaLabel: 'Underline',
    icon: <IconUnderline className="size-4" />,
    size: 'square',
  },
}

export const ActiveVariant: Story = {
  args: {
    ariaLabel: 'Bold',
    icon: <IconBold className="size-4" />,
    variant: 'active',
    defaultPressed: true,
  },
}

export const Controlled: Story = {
  render: () => {
    const [pressed, setPressed] = React.useState(false)
    return (
      <Toggle
        ariaLabel="Bold"
        icon={<IconBold className="size-4" />}
        pressed={pressed}
        onPressedChange={setPressed}
      />
    )
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Toggle ariaLabel="Bold" icon={<IconBold className="size-4" />} />
        <Toggle ariaLabel="Italic" icon={<IconItalic className="size-4" />} />
        <Toggle ariaLabel="Underline" icon={<IconUnderline className="size-4" />} />
      </div>
      <div className="flex gap-2">
        <Toggle ariaLabel="Bold" icon={<IconBold className="size-4" />} variant="active" />
        <Toggle ariaLabel="Italic" icon={<IconItalic className="size-4" />} variant="active" />
        <Toggle ariaLabel="Underline" icon={<IconUnderline className="size-4" />} variant="active" />
      </div>
    </div>
  ),
}
