import { cn } from '@/lib/utils'
import { Tabs as BaseTabs } from '@base-ui-components/react/tabs'
import * as React from 'react'

function Tabs({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root className={cn('flex flex-col', className)} {...props} />
}

function TabsList({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      className={cn(
        'bg-card text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        "h-6 px-2.5 py-3.5 inline-flex items-center justify-center rounded-sm text-xs select-none [&>svg:not([class*='size-'])]:size-4 whitespace-nowrap shrink-0 flex-1 gap-1 focus-visible:bg-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-outline active:bg-interactive-bg-primary/80 data-active:bg-primary hover:bg-background border border-transparent data-active:border-card-border text-foreground data-active:text-primary-foreground text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel className={cn('flex-1 outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
