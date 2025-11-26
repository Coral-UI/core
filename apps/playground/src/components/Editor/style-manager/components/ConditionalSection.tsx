import { useFormContext } from '@/components/Editor/style-manager/formContext'
import { ConditionalSection as ConditionalSectionPrimitive } from '@/components/primitives/ConditionalSection/conditional-section'
import { useStore } from '@tanstack/react-form'
import React from 'react'

type ConditionalSectionProps = {
  /**
   * The name of the form field to watch for the condition
   */
  watch: string
  /**
   * The value(s) that should trigger showing the content
   * Can be a single value or an array of values
   */
  when: string | number | boolean | (string | number | boolean)[]
  /**
   * The content to render when condition is met
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
 * ConditionalSection - A reusable component that shows/hides content based on form field values
 * This is a wrapper around the primitive ConditionalSection that integrates with TanStack Form
 *
 * @example
 * ```tsx
 * <ConditionalSection watch="display" when="flex">
 *   <Card>
 *     <form.AppField name="flexDirection" ... />
 *   </Card>
 * </ConditionalSection>
 * ```
 */
export const ConditionalSection: React.FC<ConditionalSectionProps> = ({ watch, when, children, className, legend }) => {
  const form = useFormContext()

  // Subscribe to the watched field value
  const watchedValue = useStore(form.store, (state) => {
    return state.values[watch]
  })

  // Check if condition is met
  const shouldShow =
    watchedValue !== undefined &&
    (Array.isArray(when) ? when.includes(watchedValue as string | number | boolean) : watchedValue === when)

  return (
    <ConditionalSectionPrimitive
      show={shouldShow}
      {...(className !== undefined && { className })}
      {...(legend !== undefined && { legend })}
    >
      {children}
    </ConditionalSectionPrimitive>
  )
}
