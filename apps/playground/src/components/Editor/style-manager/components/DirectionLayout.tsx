import type { FieldMapping, InputTypeMapping } from '@/components/primitives/DirectionLayout/direction-layout'
import { DirectionLayout as DirectionLayoutPrimitive } from '@/components/primitives/DirectionLayout/direction-layout'
import { useStore } from '@tanstack/react-form'
import React, { useEffect, useState } from 'react'

import { useFormContext } from '../formContext'

export type { FieldMapping, InputTypeMapping }

export const DirectionLayoutField = ({
  label,
  layout = 'cardinal',
  fields,
  unitFields,
  fieldLabels,
  inputTypes,
  canGoBelowZero = false,
  hideFieldLabels = false,
  hideUnitSelects = false,
  icons,
  toggleIcon,
  uniformFieldIcon,
  disableDirectionalIcons = false,
}: {
  label: string
  layout?: 'cardinal' | 'corner'
  fields: FieldMapping
  unitFields?: FieldMapping
  fieldLabels?: FieldMapping
  inputTypes?: InputTypeMapping
  canGoBelowZero?: boolean
  hideFieldLabels?: boolean
  hideUnitSelects?: boolean
  icons?: Partial<{
    blockStart: React.ComponentType
    inlineStart: React.ComponentType
    inlineEnd: React.ComponentType
    blockEnd: React.ComponentType
  }>
  toggleIcon?: React.ReactNode
  uniformFieldIcon?: React.ReactNode
  disableDirectionalIcons?: boolean
}) => {
  // Default to number inputs if inputTypes not provided (backward compatibility)
  const defaultInputTypes: InputTypeMapping = {
    blockStart: { type: 'number' },
    inlineStart: { type: 'number' },
    inlineEnd: { type: 'number' },
    blockEnd: { type: 'number' },
  }

  const finalInputTypes = inputTypes ?? defaultInputTypes
  // Default labels based on layout
  const defaultLabels: Record<'cardinal' | 'corner', FieldMapping> = {
    cardinal: {
      blockStart: 'Block Start',
      inlineStart: 'Inline Start',
      inlineEnd: 'Inline End',
      blockEnd: 'Block End',
    },
    corner: {
      blockStart: 'Top Left',
      inlineStart: 'Top Right',
      inlineEnd: 'Bottom Left',
      blockEnd: 'Bottom Right',
    },
  }

  const labels = fieldLabels ?? defaultLabels[layout]
  const form = useFormContext()
  const [isUniform, setIsUniform] = useState(true)

  // Subscribe to form state changes reactively
  // Values can be string or number depending on input type
  const inlineStartValue = useStore(form.store, (state) => {
    const val = state.values[fields.inlineStart]
    if (finalInputTypes.inlineStart.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })
  const inlineEndValue = useStore(form.store, (state) => {
    const val = state.values[fields.inlineEnd]
    if (finalInputTypes.inlineEnd.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })
  const blockStartValue = useStore(form.store, (state) => {
    const val = state.values[fields.blockStart]
    if (finalInputTypes.blockStart.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })
  const blockEndValue = useStore(form.store, (state) => {
    const val = state.values[fields.blockEnd]
    if (finalInputTypes.blockEnd.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })

  // Subscribe to unit values (only if unitFields provided)
  const inlineStartUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.inlineStart]
    return val !== undefined ? (val as string) : 'px'
  })
  const inlineEndUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.inlineEnd]
    return val !== undefined ? (val as string) : 'px'
  })
  const blockStartUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.blockStart]
    return val !== undefined ? (val as string) : 'px'
  })
  const blockEndUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.blockEnd]
    return val !== undefined ? (val as string) : 'px'
  })

  // Initialize uniformValue and uniformUnit from form state
  const [uniformValue, setUniformValue] = useState<string | number>(inlineStartValue)
  const [uniformUnit, setUniformUnit] = useState<string>(inlineStartUnit)

  // Sync uniformValue and uniformUnit whenever form values change (handles reset and mode changes)
  useEffect(() => {
    if (isUniform) {
      // Always sync uniformValue and uniformUnit to inlineStartValue/inlineStartUnit when in uniform mode
      // This ensures it resets properly when form.reset() is called
      setUniformValue(inlineStartValue)
      setUniformUnit(inlineStartUnit)
    }
  }, [
    isUniform,
    inlineStartValue,
    inlineEndValue,
    blockStartValue,
    blockEndValue,
    inlineStartUnit,
    inlineEndUnit,
    blockStartUnit,
    blockEndUnit,
  ])

  // When in uniform mode and value changes, update all fields
  const handleUniformChange = (value: string | number) => {
    setUniformValue(value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.inlineStart, value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.inlineEnd, value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.blockStart, value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.blockEnd, value)
  }

  // When in uniform mode and unit changes, update all unit fields
  const handleUniformUnitChange = (unit: string) => {
    setUniformUnit(unit)
    if (unitFields) {
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.inlineStart, unit)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.inlineEnd, unit)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.blockStart, unit)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.blockEnd, unit)
    }
  }

  // Change handlers for individual fields
  const handleChange = {
    blockStart: (value: string | number) => {
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(fields.blockStart, value)
    },
    inlineStart: (value: string | number) => {
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(fields.inlineStart, value)
    },
    inlineEnd: (value: string | number) => {
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(fields.inlineEnd, value)
    },
    blockEnd: (value: string | number) => {
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(fields.blockEnd, value)
    },
  }

  // Unit change handlers for individual fields
  const handleUnitChange = unitFields
    ? {
        blockStart: (unit: string) => {
          // @ts-expect-error - Dynamic field names, TypeScript can't infer types
          form.setFieldValue(unitFields.blockStart, unit)
        },
        inlineStart: (unit: string) => {
          // @ts-expect-error - Dynamic field names, TypeScript can't infer types
          form.setFieldValue(unitFields.inlineStart, unit)
        },
        inlineEnd: (unit: string) => {
          // @ts-expect-error - Dynamic field names, TypeScript can't infer types
          form.setFieldValue(unitFields.inlineEnd, unit)
        },
        blockEnd: (unit: string) => {
          // @ts-expect-error - Dynamic field names, TypeScript can't infer types
          form.setFieldValue(unitFields.blockEnd, unit)
        },
      }
    : undefined

  // Format change handlers for color inputs
  const handleFormatChange: {
    blockStart?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
    inlineStart?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
    inlineEnd?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
    blockEnd?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
  } = {}

  if (finalInputTypes.blockStart.type === 'color') {
    handleFormatChange.blockStart = (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => {
      const formatName = finalInputTypes.blockStart.colorFormatName || `${fields.blockStart}Format`
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(formatName, format)
    }
  }
  if (finalInputTypes.inlineStart.type === 'color') {
    handleFormatChange.inlineStart = (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => {
      const formatName = finalInputTypes.inlineStart.colorFormatName || `${fields.inlineStart}Format`
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(formatName, format)
    }
  }
  if (finalInputTypes.inlineEnd.type === 'color') {
    handleFormatChange.inlineEnd = (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => {
      const formatName = finalInputTypes.inlineEnd.colorFormatName || `${fields.inlineEnd}Format`
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(formatName, format)
    }
  }
  if (finalInputTypes.blockEnd.type === 'color') {
    handleFormatChange.blockEnd = (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => {
      const formatName = finalInputTypes.blockEnd.colorFormatName || `${fields.blockEnd}Format`
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(formatName, format)
    }
  }

  const handleToggleChange = (pressed: boolean) => {
    setIsUniform(pressed)
    if (pressed) {
      // When switching to uniform, sync all fields to the first field's value and unit
      // This ensures consistency when switching modes
      handleUniformChange(inlineStartValue)
      handleUniformUnitChange(inlineStartUnit)
    }
    // When switching to individual, no action needed - values are already in form state
  }

  return (
    <DirectionLayoutPrimitive
      label={label}
      layout={layout}
      fields={fields}
      {...(unitFields !== undefined && { unitFields })}
      fieldLabels={labels}
      inputTypes={finalInputTypes}
      {...(canGoBelowZero !== undefined && { canGoBelowZero })}
      hideFieldLabels={hideFieldLabels}
      hideUnitSelects={hideUnitSelects}
      {...(icons !== undefined && { icons })}
      {...(toggleIcon !== undefined && { toggleIcon })}
      {...(uniformFieldIcon !== undefined && { uniformFieldIcon })}
      disableDirectionalIcons={disableDirectionalIcons}
      blockStartValue={blockStartValue}
      inlineStartValue={inlineStartValue}
      inlineEndValue={inlineEndValue}
      blockEndValue={blockEndValue}
      blockStartUnit={blockStartUnit}
      inlineStartUnit={inlineStartUnit}
      inlineEndUnit={inlineEndUnit}
      blockEndUnit={blockEndUnit}
      isUniform={isUniform}
      uniformValue={uniformValue}
      uniformUnit={uniformUnit}
      onChange={handleChange}
      onUniformChange={handleUniformChange}
      {...(handleUnitChange !== undefined && { onUnitChange: handleUnitChange })}
      onUniformUnitChange={handleUniformUnitChange}
      {...(Object.keys(handleFormatChange).length > 0 && { onFormatChange: handleFormatChange })}
      onToggleChange={handleToggleChange}
    />
  )
}
