import { cn } from '@/lib/utils'
import { Tooltip as TooltipPrimitive } from '@base-ui-components/react/tooltip'
import React from 'react'

type TooltipProps = {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement<Record<string, unknown>>
  /**
   * Optional className for the tooltip popup
   */
  className?: string
  /**
   * Which side of the trigger to show the tooltip
   */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * Distance between the trigger and tooltip in pixels
   */
  sideOffset?: number
  /**
   * How to align the tooltip relative to the trigger
   */
  align?: 'start' | 'center' | 'end'

  /**
   * Whether the tooltip is disabled
   */
  disabled?: boolean
}

/**
 * Tooltip - A reusable tooltip component built on BaseUI
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className,
  side = 'top',
  sideOffset = 8,
  align = 'center',
  disabled = false,
}) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root disabled={disabled}>
        <TooltipPrimitive.Trigger render={children} />
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} align={align}>
            <TooltipPrimitive.Popup
              className={cn(
                'bg-card text-muted-foreground rounded-sm px-2 py-1.5 text-xs shadow-lg border border-card-border z-50',
                className,
              )}
            >
              {content}
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
