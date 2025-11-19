import { Card } from '@/components/Editor/style-manager/components/Card'
import { cn } from '@/lib/utils'
import React from 'react'

type CardSectionProps = {
  /**
   * The legend text for the section
   */
  legend?: string
  /**
   * The content to render inside the card
   */
  children: React.ReactNode
  /**
   * Optional className for the fieldset wrapper
   */
  className?: string
  /**
   * Optional className for the Card component
   */
  cardClassName?: string
  /**
   * Card variant (defaults to "default")
   */
  variant?: 'default' | 'inner'
}

/**
 * CardSection - A reusable component that wraps a Card in a fieldset with an optional legend.
 * This provides semantic structure and consistent styling for form sections.
 *
 * @example
 * ```tsx
 * <CardSection legend="Display Options">
 *   <form.AppField name="display" ... />
 * </CardSection>
 * ```
 */
export const CardSection: React.FC<CardSectionProps> = ({
  legend,
  children,
  className,
  cardClassName,
  variant = 'default',
}) => {
  if (legend) {
    return (
      <fieldset className={cn('card', className)}>
        <label className="legend">{legend}</label>
        <div className={cn('flex flex-col gap-2.5', cardClassName)}>{children}</div>
      </fieldset>
    )
  }

  return (
    <Card className={cardClassName} variant={variant}>
      {children}
    </Card>
  )
}
