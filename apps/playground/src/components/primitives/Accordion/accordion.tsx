import { cn } from '@/lib/utils'
import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

// Root component
const Accordion = BaseAccordion.Root

// Item component
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
>(({ className, ...props }, ref) => {
  return (
    <BaseAccordion.Item
      ref={ref}
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  )
})
AccordionItem.displayName = 'AccordionItem'

// Header component
const AccordionHeader = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Header>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Header>
>(({ className, ...props }, ref) => {
  return <BaseAccordion.Header ref={ref} data-slot="accordion-header" className={cn('flex', className)} {...props} />
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
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
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
    <BaseAccordion.Panel
      ref={ref}
      data-slot="accordion-panel"
      className={cn('overflow-hidden text-sm', className)}
      {...props}
    >
      <div className="pt-0 pb-4">{children}</div>
    </BaseAccordion.Panel>
  )
})
AccordionPanel.displayName = 'AccordionPanel'

export { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger }
