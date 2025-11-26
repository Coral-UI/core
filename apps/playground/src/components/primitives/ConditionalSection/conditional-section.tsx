import { cn } from '@/lib/utils'
import React from 'react'

import './conditional-section.css'

type ConditionalSectionProps = {
  /**
   * Whether to show the content
   */
  show: boolean
  /**
   * The content to render when show is true
   */
  children: React.ReactNode
  /**
   * Optional className for the wrapper
   */
  className?: string
  /**
   * The legend text for the section
   */
  legend?: string
}

/**
 * ConditionalSection - A reusable component that shows/hides content based on a boolean prop
 *
 * @example
 * ```tsx
 * <ConditionalSection show={display === 'flex'}>
 *   <Card>
 *     <NumberInput label="Flex Direction" ... />
 *   </Card>
 * </ConditionalSection>
 * ```
 */
export const ConditionalSection: React.FC<ConditionalSectionProps> = ({ show, children, className, legend }) => {
  if (!show) {
    return null
  }

  return (
    <fieldset className={cn('conditional-section', className)}>
      {legend && <legend className="legend">{legend}</legend>}
      {children}
    </fieldset>
  )
}
