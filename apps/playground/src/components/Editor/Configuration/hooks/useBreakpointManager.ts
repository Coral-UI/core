import { Breakpoint } from '@/components/Editor/BreakpointManager/BreakpointManager'
import { UpdatePropertyFn } from '@/components/Editor/Configuration/types/elementProperties'
import {
  createBreakpointId,
  extractBreakpointWidth,
  parseBreakpointIndex,
  transformResponsiveStylesToBreakpoints,
} from '@/components/Editor/Configuration/utils/breakpointHelpers'
import { normalizeResponsiveStyles } from '@/components/Editor/Configuration/utils/styleInheritance'
import { useViewportBreakpoint, useSyncBreakpointToViewport } from '@/hooks/queries/useViewportBreakpoint'
import { ElementTreeNode, ResponsiveStyle } from '@/hooks/useElementTree'

/**
 * Hook for managing responsive breakpoints on an element
 * Handles adding, removing, selecting breakpoints and transforming data for UI
 * Uses shared react-query state for breakpoint selection and syncs viewport width
 */
export const useBreakpointManager = (element: ElementTreeNode | null, updateProperty: UpdatePropertyFn) => {
  const { data: viewportBreakpointState } = useViewportBreakpoint()
  const activeBreakpointId = viewportBreakpointState?.activeBreakpointId ?? null
  const syncBreakpointToViewport = useSyncBreakpointToViewport()

  const handleAddBreakpoint = (breakpoint: Omit<Breakpoint, 'id'>) => {
    if (!element) return

    // Create responsive style with empty styles initially
    // Styles will be added when user edits them, and only differences will be stored
    const newBreakpoint: ResponsiveStyle = {
      breakpoint: {
        type: breakpoint.type,
        value: breakpoint.value,
      },
      label: breakpoint.label,
      styles: {}, // Start with empty styles - CSS inheritance will use base styles
    }

    const updatedResponsiveStyles = [...(element.responsiveStyles || []), newBreakpoint]

    // Don't normalize when adding - keep the breakpoint even if it has no styles yet
    // Normalization will happen when styles are actually edited
    updateProperty('responsiveStyles', updatedResponsiveStyles)

    // Auto-select the newly created breakpoint using index-based ID
    const newBreakpointId = createBreakpointId(updatedResponsiveStyles.length - 1)
    const breakpointForUI: Breakpoint = {
      id: newBreakpointId,
      type: breakpoint.type,
      value: breakpoint.value,
      label: breakpoint.label,
    }
    const breakpointWidth = extractBreakpointWidth(breakpointForUI)
    syncBreakpointToViewport(newBreakpointId, breakpointWidth)
  }

  const handleRemoveBreakpoint = (breakpointId: string) => {
    if (!element) return

    const breakpointIndex = parseBreakpointIndex(breakpointId)
    const updatedResponsiveStyles = (element.responsiveStyles || []).filter((_, index) => index !== breakpointIndex)
    updateProperty('responsiveStyles', updatedResponsiveStyles.length > 0 ? updatedResponsiveStyles : undefined)

    // Clear selection if the active breakpoint was removed
    if (activeBreakpointId === breakpointId) {
      syncBreakpointToViewport(null, null)
    }
  }

  const handleSelectBreakpoint = (breakpointId: string | null) => {
    // Find the breakpoint to extract its width
    const breakpoints = transformResponsiveStylesToBreakpoints(element?.responsiveStyles)
    const selectedBreakpoint = breakpointId ? breakpoints.find((bp) => bp.id === breakpointId) : null
    const breakpointWidth = selectedBreakpoint ? extractBreakpointWidth(selectedBreakpoint) : null

    // Sync breakpoint selection and viewport width
    syncBreakpointToViewport(breakpointId, breakpointWidth)
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
