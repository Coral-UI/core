import type { VariantProps } from 'class-variance-authority'
import { Tooltip } from '@/components/Editor/style-manager/components/Tooltip'
import { cn } from '@/lib/utils'
import { Toggle as BaseToggle } from '@base-ui-components/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group'
import { cva } from 'class-variance-authority'

type ToggleItem = {
  ariaLabel: string
  value: string
  icon: React.ReactNode
  className?: string
  tooltip?: React.ReactNode
}

const toggleVariants = cva(
  "flex items-center justify-center rounded-sm text-muted-foreground select-none focus-visible:bg-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-outline active:bg-interactive-bg-primary/80  [&>svg:not([class*='size-'])]:size-4 text-xs whitespace-nowrap shrink-0 flex-1",
  {
    variants: {
      variant: {
        default:
          'data-[pressed]:bg-primary data-[pressed]:text-primary-foreground hover:bg-interactive-bg-secondary/60 data-[pressed]:inset-shadow-xs data-[pressed]:inset-shadow-shadow-input border border-input-bg data-[pressed]:border-input-border hover:border-input-border',
        active:
          'bg-accent-blue-bg text-accent-blue-fg hover:bg-accent-blue-fg/20 border border-accent-blue-fg/40 data-[pressed]:bg-card data-[pressed]:text-foreground data-[pressed]:hover:bg-interactive-bg-primary data-[pressed]:border-transparent',
      },
      size: {
        default: 'min-w-8 h-7 px-1 flex-1',
        sm: 'min-w-5 h-5 px-1',
        square: 'w-4.5 h-4.5 p-0.5 flex-1',
      },
    },
  },
)

type ToggleProps = React.ComponentProps<typeof BaseToggle> & VariantProps<typeof toggleVariants> & ToggleItem

function Toggle({
  ariaLabel,
  value,
  className,
  icon,
  variant = 'default',
  size = 'default',
  tooltip,
  ...props
}: ToggleProps) {
  const toggleElement = (
    <BaseToggle
      aria-label={ariaLabel}
      value={value}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    >
      {icon}
    </BaseToggle>
  )

  if (tooltip) {
    return <Tooltip content={tooltip}>{toggleElement}</Tooltip>
  }

  return toggleElement
}

function ToggleGroup({
  className,
  items = [],
  ...props
}: React.ComponentProps<typeof BaseToggleGroup> & {
  className?: string
  items: ToggleItem[]
}) {
  return (
    <BaseToggleGroup className={cn('flex gap-px rounded-md bg-input p-0.5 w-full flex-1', className)} {...props}>
      {items.map((item) => (
        <Toggle key={item.value} {...item} />
      ))}
    </BaseToggleGroup>
  )
}

export { ToggleGroup, Toggle }
