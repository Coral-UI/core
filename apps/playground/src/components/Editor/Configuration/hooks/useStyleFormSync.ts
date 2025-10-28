import { DIMENSION_PROPERTIES } from '@/components/Editor/Configuration/constants/elementProperties'
import { StyleFormDefaultValues, StyleFormSchema } from '@/components/Editor/Configuration/EditorStyleFormStructure'
import { FieldStateHelpers, UpdatePropertyFn } from '@/components/Editor/Configuration/types/elementProperties'
import { parseBreakpointIndex } from '@/components/Editor/Configuration/utils/breakpointHelpers'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { convertCoralStylesToFormValues, convertFormValuesToCoralStyles } from '@/utils/convertFormToCoralStyles'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Hook for synchronizing style form with element styles
 * Handles bidirectional sync between form state and element styles,
 * including breakpoint-specific styles and field inheritance
 */
export const useStyleFormSync = (
  element: ElementTreeNode | null,
  activeBreakpointId: string | null,
  styleForm: UseFormReturn<StyleFormSchema>,
  updateProperty: UpdatePropertyFn,
): FieldStateHelpers => {
  const [isUpdatingFromForm, setIsUpdatingFromForm] = useState(false)

  // Helper to get current styles based on active breakpoint
  const getCurrentStyles = (): Record<string, unknown> | undefined => {
    if (!element) return undefined
    if (activeBreakpointId) {
      const breakpointIndex = parseBreakpointIndex(activeBreakpointId)
      const responsiveStyle = element.responsiveStyles?.[breakpointIndex]
      return responsiveStyle?.styles
    }
    return element.styles
  }

  // Helper to check if a field is explicitly set
  const isFieldSet = (fieldName: string): boolean => {
    const currentStyles = getCurrentStyles()
    return currentStyles?.[fieldName] !== undefined
  }

  // Helper to get inherited value info
  const getInheritedFrom = (fieldName: string): string | undefined => {
    if (!activeBreakpointId || !element) return undefined

    // Check if it exists in base styles
    if (element.styles?.[fieldName] !== undefined) {
      return 'base styles'
    }

    // Check previous breakpoints
    const currentIndex = parseBreakpointIndex(activeBreakpointId)
    for (let i = currentIndex - 1; i >= 0; i--) {
      const rs = element.responsiveStyles?.[i]
      if (rs?.styles?.[fieldName] !== undefined) {
        return rs.label || `breakpoint ${i}`
      }
    }

    return undefined
  }

  // Handler to clear a field
  const handleClearField = (fieldName: string) => {
    if (!element) return

    const currentStyles = getCurrentStyles()
    if (!currentStyles) return

    // Remove the field from styles
    const newStyles = { ...currentStyles }
    delete newStyles[fieldName]

    const unitFieldName = DIMENSION_PROPERTIES[fieldName]

    // Temporarily block form updates while clearing
    setIsUpdatingFromForm(true)

    // Update element
    if (activeBreakpointId) {
      const breakpointIndex = parseBreakpointIndex(activeBreakpointId)
      const updatedResponsiveStyles = (element.responsiveStyles || []).map((rs, index) =>
        index === breakpointIndex ? { ...rs, styles: Object.keys(newStyles).length > 0 ? newStyles : undefined } : rs,
      )
      updateProperty('responsiveStyles', updatedResponsiveStyles)
    } else {
      updateProperty('styles', Object.keys(newStyles).length > 0 ? newStyles : undefined)
    }

    // Reset form fields after element update
    setTimeout(() => {
      if (fieldName in StyleFormDefaultValues) {
        styleForm.setValue(
          fieldName as keyof StyleFormSchema,
          StyleFormDefaultValues[fieldName as keyof StyleFormSchema],
          {
            shouldValidate: false,
          },
        )
      }

      // Also reset unit field if it exists
      if (unitFieldName && unitFieldName in StyleFormDefaultValues) {
        styleForm.setValue(
          unitFieldName as keyof StyleFormSchema,
          StyleFormDefaultValues[unitFieldName as keyof StyleFormSchema],
          {
            shouldValidate: false,
          },
        )
      }

      // Re-enable form updates
      setTimeout(() => setIsUpdatingFromForm(false), 0)
    }, 0)
  }

  // Update form when element or active breakpoint changes
  // Derive state from the element (source of truth)
  useEffect(() => {
    if (!element || isUpdatingFromForm) return

    const formValues = { ...StyleFormDefaultValues }

    // Load styles from the active breakpoint or base styles
    let stylesToLoad: Record<string, unknown> | undefined

    if (activeBreakpointId) {
      // Find the responsive style by index-based ID
      const breakpointIndex = parseBreakpointIndex(activeBreakpointId)
      const responsiveStyle = element.responsiveStyles?.[breakpointIndex]
      stylesToLoad = responsiveStyle?.styles
    } else {
      // Load base styles
      stylesToLoad = element.styles
    }

    if (stylesToLoad) {
      // Convert Coral styles (with dimension objects) to form values (with separate unit fields)
      const convertedFormValues = convertCoralStylesToFormValues(stylesToLoad)
      for (const [key, value] of Object.entries(convertedFormValues)) {
        if (key in formValues && value !== undefined) {
          // Type assertion is safe here because convertCoralStylesToFormValues returns values compatible with StyleFormSchema
          ;(formValues as Record<string, unknown>)[key] = value
        }
      }
    }

    styleForm.reset(formValues)
  }, [element, element?.styles, element?.responsiveStyles, activeBreakpointId, isUpdatingFromForm])

  // Auto-apply styles on form change
  useEffect(() => {
    const subscription = styleForm.watch((values) => {
      if (!element) return

      // Set flag to prevent form reset while updating
      setIsUpdatingFromForm(true)

      // Get current styles based on active breakpoint
      let currentStyles: Record<string, unknown> | undefined
      if (activeBreakpointId) {
        const breakpointIndex = parseBreakpointIndex(activeBreakpointId)
        const responsiveStyle = element.responsiveStyles?.[breakpointIndex]
        currentStyles = responsiveStyle?.styles
      } else {
        currentStyles = element.styles
      }

      // Convert form values (with separate unit fields) to Coral styles (with dimension objects)
      // Pass current styles to avoid adding default values unnecessarily
      const coralStyles = convertFormValuesToCoralStyles(
        values as Record<string, unknown>,
        StyleFormDefaultValues,
        currentStyles,
      )

      // Update either the breakpoint styles or base styles
      if (activeBreakpointId) {
        // Update the specific breakpoint's styles by index
        const breakpointIndex = parseBreakpointIndex(activeBreakpointId)
        const updatedResponsiveStyles = (element.responsiveStyles || []).map((rs, index) =>
          index === breakpointIndex
            ? { ...rs, styles: Object.keys(coralStyles).length > 0 ? { ...rs.styles, ...coralStyles } : undefined }
            : rs,
        )
        updateProperty('responsiveStyles', updatedResponsiveStyles)
      } else {
        // Update base styles - merge with existing styles
        updateProperty(
          'styles',
          Object.keys(coralStyles).length > 0 ? { ...element.styles, ...coralStyles } : undefined,
        )
      }

      // Clear flag after a short delay to allow updates to propagate
      setTimeout(() => setIsUpdatingFromForm(false), 0)
    })

    return () => subscription.unsubscribe()
  }, [element, activeBreakpointId])

  return {
    isFieldSet,
    getInheritedFrom,
    onClearField: handleClearField,
  }
}
