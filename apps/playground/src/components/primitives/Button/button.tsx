import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button as BaseButton } from '@base-ui-components/react/button'
import { cva } from 'class-variance-authority'
import React from 'react'

import './button.css'

export const buttonVariants = cva('button', {
  variants: {
    variant: {
      default: 'button-default',
      destructive: 'button-destructive',
      outline: 'button-outline',
      secondary: 'button-secondary',
      ghost: 'button-ghost',
      link: 'button-link',
      colorPicker: 'button-color-picker',
      elementPreview: 'element-preview',
    },
    size: {
      default: 'button-size-default',
      sm: 'button-size-sm',
      lg: 'button-size-lg',
      icon: 'size-9',
      'icon-sm': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
      'icon-lg': 'size-10',
    },
    rounded: {
      true: 'button-rounded',
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: false,
  },
})

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
