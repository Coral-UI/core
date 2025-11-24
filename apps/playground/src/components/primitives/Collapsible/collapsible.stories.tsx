import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from './collapsible'

const meta = {
  title: 'Primitives/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[400px]">
      <CollapsibleTrigger>Recovery keys</CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="pt-2 space-y-2">
          <div className="font-mono text-sm">alien-bean-pasta</div>
          <div className="font-mono text-sm">wild-irish-burrito</div>
          <div className="font-mono text-sm">horse-battery-staple</div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible className="w-[400px]" defaultOpen={true}>
      <CollapsibleTrigger>Recovery keys</CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="pt-2 space-y-2">
          <div className="font-mono text-sm">alien-bean-pasta</div>
          <div className="font-mono text-sm">wild-irish-burrito</div>
          <div className="font-mono text-sm">horse-battery-staple</div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger>Recovery keys</CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="pt-2 space-y-2">
              <div className="font-mono text-sm">alien-bean-pasta</div>
              <div className="font-mono text-sm">wild-irish-burrito</div>
              <div className="font-mono text-sm">horse-battery-staple</div>
            </div>
          </CollapsiblePanel>
        </Collapsible>
        <p className="text-xs text-muted-foreground">Panel is {open ? 'open' : 'closed'}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <Collapsible className="w-[400px]" disabled>
      <CollapsibleTrigger>Recovery keys</CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="pt-2 space-y-2">
          <div className="font-mono text-sm">alien-bean-pasta</div>
          <div className="font-mono text-sm">wild-irish-burrito</div>
          <div className="font-mono text-sm">horse-battery-staple</div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  ),
}

export const WithLongContent: Story = {
  render: () => (
    <Collapsible className="w-[400px]">
      <CollapsibleTrigger>Documentation</CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="pt-2 space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Getting Started</h4>
            <p className="text-sm text-muted-foreground">
              This is a collapsible panel that can contain longer content. It's useful for organizing information that
              can be hidden or shown on demand.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Animated expand/collapse</li>
              <li>Keyboard accessible</li>
              <li>Controlled and uncontrolled modes</li>
              <li>Customizable styling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Usage</h4>
            <p className="text-sm text-muted-foreground">
              Use the Collapsible component when you need to show or hide content based on user interaction. It's
              perfect for FAQs, settings panels, and disclosure widgets.
            </p>
          </div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <Collapsible className="w-[400px]">
      <CollapsibleTrigger className="[&>svg]:hidden">Recovery keys (no icon)</CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="pt-2 space-y-2">
          <div className="font-mono text-sm">alien-bean-pasta</div>
          <div className="font-mono text-sm">wild-irish-burrito</div>
          <div className="font-mono text-sm">horse-battery-staple</div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  ),
}
