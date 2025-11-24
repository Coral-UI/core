import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const WithBrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.com/image.png" alt="Broken" />
      <AvatarFallback>FB</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithCustomStyles: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-12 border-2 border-primary">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="bg-primary text-primary-foreground">CN</AvatarFallback>
      </Avatar>
      <Avatar className="size-12 ring-2 ring-accent ring-offset-2">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="bg-accent text-accent-foreground">AC</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const MultipleAvatars: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar className="size-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="size-10 -ml-2 border-2 border-background">
        <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="size-10 -ml-2 border-2 border-background">
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
    </div>
  ),
}
