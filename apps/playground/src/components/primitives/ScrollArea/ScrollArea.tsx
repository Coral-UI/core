import { cn } from '@/lib/utils'
import { ScrollArea as BaseScrollArea } from '@base-ui-components/react/scroll-area'
import * as React from 'react'

function ScrollArea({
  children,
  className,
  innerClassName,
  ...props
}: { children: React.ReactNode; className?: string; innerClassName?: string } & React.ComponentProps<
  typeof BaseScrollArea.Root
>) {
  return (
    <BaseScrollArea.Root className={cn('h-full', className)} {...props}>
      <BaseScrollArea.Viewport className={cn('h-full overscroll-contain rounded-md pr-2', innerClassName)}>
        {children}
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className="m-1 flex w-1 justify-center rounded bg-bg-surface opacity-0 transition-opacity delay-300 pointer-events-none data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[hovering]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75 data-[scrolling]:pointer-events-auto">
        <BaseScrollArea.Thumb className="w-full rounded bg-input-border" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  )
}

export { ScrollArea }
