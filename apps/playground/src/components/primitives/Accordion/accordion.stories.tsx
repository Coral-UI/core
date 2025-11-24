import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from './accordion'

const meta = {
  title: 'Primitives/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Accordion className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>What is Base UI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Base UI is a library of high-quality unstyled React components for design systems and web apps.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>How do I get started?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Head to the "Quick start" guide in the docs. If you've used unstyled libraries before, you'll feel at home.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Of course! Base UI is free and open source.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
}

export const SinglePanel: Story = {
  render: () => (
    <Accordion className="w-[400px]" multiple={false}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>What is Base UI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Base UI is a library of high-quality unstyled React components for design systems and web apps.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>How do I get started?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Head to the "Quick start" guide in the docs. If you've used unstyled libraries before, you'll feel at home.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Of course! Base UI is free and open source.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
}

export const MultiplePanels: Story = {
  render: () => (
    <Accordion className="w-[400px]" multiple={true} defaultValue={['item-1']}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>What is Base UI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Base UI is a library of high-quality unstyled React components for design systems and web apps.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>How do I get started?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Head to the "Quick start" guide in the docs. If you've used unstyled libraries before, you'll feel at home.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Of course! Base UI is free and open source.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(['item-1'])

    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <Accordion multiple={true} value={value} onValueChange={setValue}>
          <AccordionItem value="item-1">
            <AccordionHeader>
              <AccordionTrigger>What is Base UI?</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Base UI is a library of high-quality unstyled React components for design systems and web apps.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionHeader>
              <AccordionTrigger>How do I get started?</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Head to the "Quick start" guide in the docs. If you've used unstyled libraries before, you'll feel at
              home.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionHeader>
              <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>Of course! Base UI is free and open source.</AccordionPanel>
          </AccordionItem>
        </Accordion>
        <p className="text-xs text-muted-foreground">Open items: {value.join(', ') || 'none'}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <Accordion className="w-[400px]" disabled>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>What is Base UI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Base UI is a library of high-quality unstyled React components for design systems and web apps.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>How do I get started?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Head to the "Quick start" guide in the docs. If you've used unstyled libraries before, you'll feel at home.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
}

export const WithLongContent: Story = {
  render: () => (
    <Accordion className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>What is Base UI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <div className="space-y-2">
            <p>
              Base UI is a library of high-quality unstyled React components for design systems and web apps. It
              provides a solid foundation for building custom UI components.
            </p>
            <p>
              The library includes components like buttons, inputs, selects, dialogs, and more. All components are
              unstyled, giving you complete control over the visual design.
            </p>
            <p>
              Base UI is built with accessibility in mind, following WAI-ARIA guidelines and best practices for keyboard
              navigation and screen reader support.
            </p>
          </div>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>How do I get started?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <div className="space-y-2">
            <p>
              Head to the "Quick start" guide in the docs. If you've used unstyled libraries before, you'll feel at
              home.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Install the package</li>
              <li>Import the components you need</li>
              <li>Style them to match your design system</li>
            </ul>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
}
