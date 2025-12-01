import { useViewportBreakpoint, useSetActiveBreakpoint } from '@/hooks/queries/useViewportBreakpoint'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { useEffect } from 'react'
import { findMatchingBreakpoint, transformResponsiveStylesToBreakpoints } from '../utils/breakpointHelpers'

/**
 * Hook that syncs viewport width changes to active breakpoint selection
 * When viewport width changes, automatically selects the matching breakpoint
 * if one exists for the selected element
 */
export function useSyncViewportToBreakpoint(selectedElement: ElementTreeNode | null) {
  const { data: viewportBreakpointState } = useViewportBreakpoint()
  const viewportWidth = viewportBreakpointState?.viewportWidth ?? 1440
  const activeBreakpointId = viewportBreakpointState?.activeBreakpointId ?? null
  const setActiveBreakpoint = useSetActiveBreakpoint()

  useEffect(() => {
    // Only sync if we have a selected element with breakpoints
    if (!selectedElement || !selectedElement.responsiveStyles || selectedElement.responsiveStyles.length === 0) {
      // If no breakpoints exist, clear selection
      if (activeBreakpointId !== null) {
        setActiveBreakpoint.mutate(null)
      }
      return
    }

    // Transform responsive styles to breakpoints
    const breakpoints = transformResponsiveStylesToBreakpoints(selectedElement.responsiveStyles)

    // Find matching breakpoint for current viewport width
    const matchingBreakpointId = findMatchingBreakpoint(breakpoints, viewportWidth)

    // Only update if the matching breakpoint is different from current selection
    if (matchingBreakpointId !== activeBreakpointId) {
      setActiveBreakpoint.mutate(matchingBreakpointId)
    }
  }, [viewportWidth, selectedElement, activeBreakpointId, setActiveBreakpoint])
}
