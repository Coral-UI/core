import { useFieldContext, useFormContext } from '@/components/Editor/style-manager/formContext'
import { ColorInput } from '@/components/primitives/ColorInput/color-input'
import { useStore } from '@tanstack/react-form'
import React from 'react'

export const ColorInputField = ({
  label,
  formatName,
  defaultFormat = 'hex',
  leadingIcon,
  hideLabel = false,
  size = 'sm',
}: {
  label: string
  formatName?: string
  defaultFormat?: 'hex' | 'rgb' | 'hsl' | 'hsb'
  leadingIcon?: React.ReactNode
  hideLabel?: boolean
  size?: 'default' | 'sm'
}) => {
  const field = useFieldContext<string | undefined>()
  const form = useFormContext()

  // Get the format field value if formatName is provided
  const format = useStore(form.store, (state) => {
    if (!formatName) return undefined
    const val = state.values[formatName]
    return (val as 'hex' | 'rgb' | 'hsl' | 'hsb' | undefined) ?? defaultFormat
  })

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  // Handle color value change
  const handleValueChange = React.useCallback(
    (value: string) => {
      field.handleChange(value || undefined)
    },
    [field],
  )

  // Handle format change
  const handleFormatChange = React.useCallback(
    (newFormat: 'hex' | 'rgb' | 'hsl' | 'hsb') => {
      if (formatName) {
        // @ts-expect-error - formatName is a dynamic string key, but TypeScript can't infer the field type
        form.setFieldValue(formatName, newFormat)
      }
    },
    [formatName, form],
  )

  return (
    <ColorInput
      label={label}
      value={field.state.value}
      onValueChange={handleValueChange}
      format={format}
      defaultFormat={defaultFormat}
      onFormatChange={formatName ? handleFormatChange : undefined}
      leadingIcon={leadingIcon}
      hideLabel={hideLabel}
      invalid={isInvalid}
    />
  )
}
