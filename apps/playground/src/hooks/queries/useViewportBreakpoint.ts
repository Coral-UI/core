'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'

import { viewportBreakpointQueryOptions, type ViewportBreakpointState } from '@/lib/queries/query-options'

const VIEWPORT_BREAKPOINT_QUERY_KEY = ['viewport-breakpoint'] as const

const DEFAULT_VIEWPORT_WIDTH = 1440

const INITIAL_STATE: ViewportBreakpointState = {
  viewportWidth: DEFAULT_VIEWPORT_WIDTH,
  activeBreakpointId: null,
}

/**
 * Hook for reading viewport and breakpoint state
 */
export function useViewportBreakpoint() {
  const queryClient = useQueryClient()

  // Initialize query data in cache if it doesn't exist
  useEffect(() => {
    const currentData = queryClient.getQueryData<ViewportBreakpointState>(VIEWPORT_BREAKPOINT_QUERY_KEY)
    if (!currentData) {
      queryClient.setQueryData(VIEWPORT_BREAKPOINT_QUERY_KEY, INITIAL_STATE)
    }
  }, [queryClient])

  return useQuery({
    ...viewportBreakpointQueryOptions(),
    initialData: INITIAL_STATE,
  })
}

/**
 * Mutation hook for updating viewport width
 */
export function useSetViewportWidth() {
  const queryClient = useQueryClient()

  return useMutation<ViewportBreakpointState, Error, number>({
    mutationFn: async (viewportWidth: number) => {
      const currentState =
        queryClient.getQueryData<ViewportBreakpointState>(VIEWPORT_BREAKPOINT_QUERY_KEY) || {
          viewportWidth: DEFAULT_VIEWPORT_WIDTH,
          activeBreakpointId: null,
        }

      const newState: ViewportBreakpointState = {
        ...currentState,
        viewportWidth,
      }

      // Update cache immediately
      queryClient.setQueryData(VIEWPORT_BREAKPOINT_QUERY_KEY, newState)

      return Promise.resolve(newState)
    },
  })
}

/**
 * Mutation hook for updating active breakpoint ID
 */
export function useSetActiveBreakpoint() {
  const queryClient = useQueryClient()

  return useMutation<ViewportBreakpointState, Error, string | null>({
    mutationFn: async (activeBreakpointId: string | null) => {
      const currentState =
        queryClient.getQueryData<ViewportBreakpointState>(VIEWPORT_BREAKPOINT_QUERY_KEY) || {
          viewportWidth: DEFAULT_VIEWPORT_WIDTH,
          activeBreakpointId: null,
        }

      const newState: ViewportBreakpointState = {
        ...currentState,
        activeBreakpointId,
      }

      // Update cache immediately
      queryClient.setQueryData(VIEWPORT_BREAKPOINT_QUERY_KEY, newState)

      return Promise.resolve(newState)
    },
  })
}

/**
 * Helper hook that syncs viewport width when a breakpoint is selected
 * Extracts width from breakpoint value and updates viewport accordingly
 */
export function useSyncBreakpointToViewport() {
  const setViewportWidth = useSetViewportWidth()
  const setActiveBreakpoint = useSetActiveBreakpoint()

  return useCallback(
    (breakpointId: string | null, breakpointWidth: number | null) => {
      // Update active breakpoint
      setActiveBreakpoint.mutate(breakpointId)

      // Sync viewport width if breakpoint has a width value
      if (breakpointWidth !== null) {
        setViewportWidth.mutate(breakpointWidth)
      } else {
        // Reset to default when base/default breakpoint is selected
        setViewportWidth.mutate(DEFAULT_VIEWPORT_WIDTH)
      }
    },
    [setActiveBreakpoint, setViewportWidth],
  )
}
