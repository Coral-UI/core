import { cn } from '@/lib/utils'
import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

import './accordion.css'

// Root component
const Accordion = BaseAccordion.Root

// Item component
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
>(({ className, ...props }, ref) => {
  return (
    <BaseAccordion.Item ref={ref} data-slot="accordion-item" className={cn('accordion-item', className)} {...props} />
  )
})
AccordionItem.displayName = 'AccordionItem'

// Header component
const AccordionHeader = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Header>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Header>
>(({ className, ...props }, ref) => {
  return (
    <BaseAccordion.Header
      ref={ref}
      data-slot="accordion-header"
      className={cn('accordion-header', className)}
      {...props}
    />
  )
})
AccordionHeader.displayName = 'AccordionHeader'

// Trigger component
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseAccordion.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={cn('accordion-trigger', className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="accordion-trigger-icon" />
    </BaseAccordion.Trigger>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

// Panel component
const AccordionPanel = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseAccordion.Panel ref={ref} data-slot="accordion-panel" className={cn('accordion-panel', className)} {...props}>
      <div>{children}</div>
    </BaseAccordion.Panel>
  )
})
AccordionPanel.displayName = 'AccordionPanel'

export { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger }
