import { Breakpoint } from '@/components/Editor/BreakpointManager/BreakpointManager'
import { UpdatePropertyFn } from '@/components/Editor/Configuration/types/elementProperties'
import {
  createBreakpointId,
  parseBreakpointIndex,
  transformResponsiveStylesToBreakpoints,
} from '@/components/Editor/Configuration/utils/breakpointHelpers'
import { ElementTreeNode, ResponsiveStyle } from '@/hooks/useElementTree'
import { useState } from 'react'

/**
 * Hook for managing responsive breakpoints on an element
 * Handles adding, removing, selecting breakpoints and transforming data for UI
 */
export const useBreakpointManager = (element: ElementTreeNode | null, updateProperty: UpdatePropertyFn) => {
  const [activeBreakpointId, setActiveBreakpointId] = useState<string | null>(null)

  const handleAddBreakpoint = (breakpoint: Omit<Breakpoint, 'id'>) => {
    if (!element) return

    // Create responsive style using core schema structure
    const newBreakpoint: ResponsiveStyle = {
      breakpoint: {
        type: breakpoint.type,
        value: breakpoint.value,
      },
      label: breakpoint.label,
      styles: {},
    }

    const updatedResponsiveStyles = [...(element.responsiveStyles || []), newBreakpoint]
    updateProperty('responsiveStyles', updatedResponsiveStyles)

    // Auto-select the newly created breakpoint using index-based ID
    const newBreakpointId = createBreakpointId(updatedResponsiveStyles.length - 1)
    setActiveBreakpointId(newBreakpointId)
  }

  const handleRemoveBreakpoint = (breakpointId: string) => {
    if (!element) return

    const breakpointIndex = parseBreakpointIndex(breakpointId)
    const updatedResponsiveStyles = (element.responsiveStyles || []).filter((_, index) => index !== breakpointIndex)
    updateProperty('responsiveStyles', updatedResponsiveStyles.length > 0 ? updatedResponsiveStyles : undefined)

    // Clear selection if the active breakpoint was removed
    if (activeBreakpointId === breakpointId) {
      setActiveBreakpointId(null)
    }
  }

  const handleSelectBreakpoint = (breakpointId: string | null) => {
    setActiveBreakpointId(breakpointId)
  }

  // Transform responsive styles to breakpoint format for UI
  const breakpoints = transformResponsiveStylesToBreakpoints(element?.responsiveStyles)

  return {
    activeBreakpointId,
    breakpoints,
    handleAddBreakpoint,
    handleRemoveBreakpoint,
    handleSelectBreakpoint,
  }
}
