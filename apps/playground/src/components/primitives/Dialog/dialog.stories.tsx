import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

import { Button } from '../Button/button'
import { Dialog } from './dialog'

const meta = {
  title: 'Primitives/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        buttonText="Open Dialog"
        title="Dialog Title"
        description="Dialog Description"
      />
    )
  },
}

export const WithChildren: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        buttonText="Open Dialog"
        title="Dialog Title"
        description="Dialog Description"
      >
        <div className="space-y-4">
          <p>This is custom dialog content.</p>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </Dialog>
    )
  },
}
