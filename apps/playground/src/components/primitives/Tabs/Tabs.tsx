import { cn } from '@/lib/utils'
import { Tabs as BaseTabs } from '@base-ui-components/react/tabs'
import * as React from 'react'

import './tabs.css'

function Tabs({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root className={cn('tabs', className)} {...props} />
}

function TabsList({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.List>) {
  return <BaseTabs.List className={cn('tabs-list', className)} {...props} />
}

function TabsTrigger({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.Tab>) {
  return <BaseTabs.Tab className={cn('tabs-trigger', className)} {...props} />
}

function TabsContent({ className, ...props }: { className?: string } & React.ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel className={cn('flex-1 outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
