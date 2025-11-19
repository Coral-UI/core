import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button as BaseButton } from '@base-ui-components/react/button'
import { cva } from 'class-variance-authority'
import React from 'react'

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-normal rounded-md border border-transparent transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 gap-2 text-sm font-medium",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 interactive-focus',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        colorPicker:
          'bg-transparent border-transparent hover:bg-interactive-bg-primary/60 shadow-xs interactive-focus justify-start !pl-0 !h-8 text-sm font-medium tracking-tight',
        elementPreview: 'bg-blue-800 border-blue-600 hover:bg-blue-700  shadow-xs interactive-focus rounded-full',
      },
      size: {
        default: 'h-9  px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 has-[>svg]:px-2.5 gap-1.5 text-xs',
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

type ButtonProps = (React.ComponentPropsWithoutRef<typeof BaseButton> | React.ComponentPropsWithoutRef<'a'>) &
  VariantProps<typeof buttonVariants> & { href?: string }

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant, size, href, className, ...props }, ref) => {
    // Filter out undefined values to satisfy exactOptionalPropertyTypes
    const cleanProps = Object.fromEntries(Object.entries(props).filter(([_, value]) => value !== undefined)) as Omit<
      React.ComponentPropsWithoutRef<typeof BaseButton>,
      'ref'
    >

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          {...(cleanProps as Omit<React.ComponentProps<'a'>, 'ref'>)}
          className={cn(className, buttonVariants({ variant, size }))}
        />
      )
    }
    return (
      <BaseButton
        ref={ref as React.Ref<HTMLButtonElement>}
        {...cleanProps}
        className={cn(className, buttonVariants({ variant, size }))}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
