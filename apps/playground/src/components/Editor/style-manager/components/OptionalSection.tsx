import { useFormContext } from '@/components/Editor/style-manager/formContext'
import { Button } from '@/components/primitives/Button/button'
import { cn } from '@/lib/utils'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useStore } from '@tanstack/react-form'
import React, { useEffect, useState } from 'react'

type OptionalSectionProps = {
  /**
   * The name of the form field that tracks whether this section is enabled
   */
  enabledField: string
  /**
   * The legend/label for the fieldset
   */
  legend: string
  /**
   * The content to render when section is enabled
   */
  children: React.ReactNode
  /**
   * Optional className for the fieldset
   */
  className?: string
  /**
   * Optional icon for the enable button
   */
  enableIcon?: React.ReactNode
  /**
   * Optional icon for the disable button
   */
  disableIcon?: React.ReactNode
  /**
   * Default enabled state (defaults to false)
   */
  defaultEnabled?: boolean
}

/**
 * OptionalSection - A reusable component that wraps a fieldset with a toggle button
 * to enable/disable the section. When disabled, fields are hidden but values are preserved.
 *
 * @example
 * ```tsx
 * <OptionalSection enabledField="typographyEnabled" legend="Typography">
 *   <form.AppField name="fontSize" ... />
 *   <form.AppField name="fontWeight" ... />
 * </OptionalSection>
 * ```
 */
export const OptionalSection: React.FC<OptionalSectionProps> = ({
  enabledField,
  legend,
  children,
  className,
  enableIcon = <IconPlus className="size-4" />,
  disableIcon = <IconMinus className="size-4" />,
  defaultEnabled = false,
}) => {
  const form = useFormContext()

  // Subscribe to the enabled field value
  const isEnabled = useStore(form.store, (state) => {
    const value = state.values[enabledField]
    return value === true || value === 'true' || value === 1
  })

  // Initialize enabled state from form or default
  const [localEnabled, setLocalEnabled] = useState(() => {
    const formValue = form.state.values[enabledField]
    return formValue === true || formValue === 'true' || formValue === 1 || defaultEnabled
  })

  // Sync local state with form state
  useEffect(() => {
    const formValue = form.state.values[enabledField]
    const formEnabled = formValue === true || formValue === 'true' || formValue === 1
    setLocalEnabled(formEnabled)
  }, [isEnabled, enabledField, form])

  const handleToggle = () => {
    const newValue = !localEnabled
    setLocalEnabled(newValue)
    // @ts-expect-error - enabledField is a dynamic string key, but TypeScript can't infer the field type
    form.setFieldValue(enabledField, newValue)
  }

  return (
    <fieldset className={cn('card tight', className)}>
      <div className={cn('flex items-center justify-between gap-3', className)}>
        <legend className="legend">{legend}</legend>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleToggle}
          aria-label={localEnabled ? `Disable ${legend}` : `Enable ${legend}`}
          aria-pressed={localEnabled}
        >
          {localEnabled ? disableIcon : enableIcon}
        </Button>
      </div>
      {localEnabled && <div className="flex flex-col gap-2">{children}</div>}
    </fieldset>
  )
}
