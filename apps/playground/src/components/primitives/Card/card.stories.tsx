import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Button } from '../Button/button'
import { ColorInput } from '../ColorInput/color-input'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardContent>
        <CardFooter>
          <Button>Card Footer Action</Button>
        </CardFooter>
      </>
    ),
  },
}

export const CardWithInput: Story = {
  args: {
    tight: true,
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <ColorInput label="Color Input" value="#000000" onValueChange={() => {}} />
        </CardContent>
        <CardFooter>
          <Button>Card Footer Action</Button>
        </CardFooter>
      </>
    ),
  },
}
