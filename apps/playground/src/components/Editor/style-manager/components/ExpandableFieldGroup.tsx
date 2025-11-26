import { useFormContext } from '@/components/Editor/style-manager/formContext'
import { Button } from '@/components/primitives/Button/button'
import { Popover } from '@/components/primitives/Popover/popover'
import { cn } from '@/lib/utils'
import { IconDots } from '@tabler/icons-react'
import { useStore } from '@tanstack/react-form'
import React, { useEffect, useState } from 'react'

type ExpandableFieldOption = {
  /**
   * The field name for this option (e.g., "minWidth", "maxWidth")
   */
  fieldName: string
  /**
   * The unit field name (e.g., "minWidthUnit", "maxWidthUnit")
   */
  unitFieldName?: string
  /**
   * The label to display in the popover
   */
  label: string
  /**
   * Optional icon for the option
   */
  icon?: React.ReactNode
}

type ExpandableFieldGroupProps = {
  /**
   * The main field name (e.g., "width", "height")
   */
  mainFieldName: string
  /**
   * The options for expandable fields (min/max variants)
   */
  options: ExpandableFieldOption[]
  /**
   * The main field component to render
   */
  children: React.ReactNode
  /**
   * Map of field names to their React components
   * The component will render these when the fields are enabled
   */
  fields: Record<string, React.ReactNode>
  /**
   * Optional className for the container
   */
  className?: string
}

/**
 * ExpandableFieldGroup - A reusable component that shows a main field with a popover button
 * to add/remove related fields (like min/max variants). When fields are removed, their form
 * state is cleared.
 *
 * @example
 * ```tsx
 * <ExpandableFieldGroup
 *   mainFieldName="width"
 *   options={[
 *     { fieldName: "minWidth", unitFieldName: "minWidthUnit", label: "Add Min Width" },
 *     { fieldName: "maxWidth", unitFieldName: "maxWidthUnit", label: "Add Max Width" },
 *   ]}
 * >
 *   <form.AppField name="width" ... />
 * </ExpandableFieldGroup>
 * ```
 */
export const ExpandableFieldGroup: React.FC<ExpandableFieldGroupProps> = ({ options, children, fields, className }) => {
  const form = useFormContext()
  const [enabledFields, setEnabledFields] = useState<Set<string>>(new Set())

  // Subscribe to form values for all options to detect changes
  const formValues = useStore(form.store, (state) => {
    const values: Record<string, unknown> = {}
    options.forEach((option) => {
      values[option.fieldName] = state.values[option.fieldName]
    })
    return values
  })

  // Update enabled fields when form values change
  useEffect(() => {
    const enabled = new Set<string>()
    options.forEach((option) => {
      const value = formValues[option.fieldName]
      // Consider field enabled if it exists in form state (not undefined)
      // This includes 0 as a valid value
      if (value !== undefined) {
        enabled.add(option.fieldName)
      }
    })
    setEnabledFields(enabled)
  }, [formValues, options])

  const toggleField = (option: ExpandableFieldOption) => {
    const isEnabled = enabledFields.has(option.fieldName)
    const newEnabledFields = new Set(enabledFields)

    if (isEnabled) {
      // Remove field - clear form values
      newEnabledFields.delete(option.fieldName)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(option.fieldName, undefined)
      if (option.unitFieldName) {
        // @ts-expect-error - Dynamic field names, TypeScript can't infer types
        form.setFieldValue(option.unitFieldName, undefined)
      }
    } else {
      // Add field - set default values
      newEnabledFields.add(option.fieldName)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(option.fieldName, 0)
      if (option.unitFieldName) {
        // @ts-expect-error - Dynamic field names, TypeScript can't infer types
        form.setFieldValue(option.unitFieldName, 'px')
      }
    }

    setEnabledFields(newEnabledFields)
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-end gap-2">
        <div className="flex-1">{children}</div>
        <Popover
          trigger={
            <Button variant="ghost" size="icon-sm" className="-translate-y-1" aria-label="Toggle fields">
              <IconDots />
            </Button>
          }
        >
          <span className="flex flex-col gap-1">
            {options.map((option) => {
              const isEnabled = enabledFields.has(option.fieldName)
              return (
                <Button key={option.fieldName} variant="ghost" size="sm" onClick={() => toggleField(option)}>
                  {isEnabled ? option.label.replace('Add ', 'Remove ') : option.label}
                </Button>
              )
            })}
          </span>
        </Popover>
      </div>
      {enabledFields.size > 0 && (
        <div className="flex gap-2 mt-2">
          {options
            .filter((option) => enabledFields.has(option.fieldName))
            .map((option) => (
              <div key={option.fieldName}>{fields[option.fieldName]}</div>
            ))}
        </div>
      )}
    </div>
  )
}
