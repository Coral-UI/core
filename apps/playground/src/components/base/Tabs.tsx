import { cn } from '@/lib/utils'
import { Tabs as BaseTabs } from '@base-ui-components/react/tabs'

function Tabs({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root className={cn('flex flex-col', className)} {...props} />
}

function TabsList({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      className={cn(
        'bg-interactive-bg-primary inline-flex w-fit items-center justify-center rounded-md p-0.5',
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
        "h-6 px-2.5 py-4 inline-flex items-center justify-center rounded-sm text-text-secondary text-sm select-none [&>svg:not([class*='size-'])]:size-4 whitespace-nowrap shrink-0 flex-1 gap-1 focus-visible:bg-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-outline active:bg-interactive-bg-primary/80 data-selected:bg-interactive-bg-secondary data-selected:text-text-primary hover:bg-interactive-bg-secondary/60 data-selected:text-text-primary/80",
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
