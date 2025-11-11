import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React from 'react'

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-normal rounded-button border border-transparent transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 gap-2 text-sm text-text-primary",
  {
    variants: {
      variant: {
        default: 'bg-interactive-bg-primary hover:bg-interactive-bg-primary/60 interactive-focus',
        outline:
          'bg-transparent border-interactive-border hover:bg-interactive-bg-primary/60 shadow-xs interactive-focus',
        ghost: 'bg-transparent border-transparent hover:bg-interactive-bg-primary/60 shadow-xs interactive-focus',
        secondary:
          'bg-interactive-bg-secondary hover:bg-interactive-bg-primary/60 border-interactive-border interactive-focus',
        link: 'text-text-primary underline-offset-4 hover:underline interactive-focus',
        destructive:
          'bg-destructive-bg text-destructive-fg hover:bg-destructive-fg/20 focus-visible:ring-destructive-fg focus-visible:border-destructive-fg focus-visible:ring-1 border-destructive-fg/30',
        colorPicker:
          'bg-transparent border-transparent hover:bg-interactive-bg-primary/60 shadow-xs interactive-focus justify-start !pl-0 !h-7 text-xs tracking-wider',
      },
      size: {
        default: 'h-9  px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 has-[>svg]:px-2.5 gap-1.5',
        lg: 'h-12 px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  (React.ComponentProps<'button'> | React.ComponentProps<'a'>) & VariantProps<typeof buttonVariants> & { href?: string }
>(({ variant, size, href, className, ...props }, ref) => {
  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...(props as React.ComponentProps<'a'>)}
        className={cn(className, buttonVariants({ variant, size }))}
      />
    )
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      {...(props as React.ComponentProps<'button'>)}
      className={cn(className, buttonVariants({ variant, size }))}
    />
  )
})

Button.displayName = 'Button'

export { Button }
