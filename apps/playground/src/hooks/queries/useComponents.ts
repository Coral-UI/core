'use client'

import type { Component, CreateComponentInput, UpdateComponentInput } from '@/types'
// Stub server actions for standalone/Vite mode
const createComponentAction = async (_input: CreateComponentInput) => {
  throw new Error('Server actions not available in standalone mode')
}
const updateComponentAction = async (_id: string, _input: UpdateComponentInput) => {
  throw new Error('Server actions not available in standalone mode')
}
const deleteComponentAction = async (_id: string) => {
  throw new Error('Server actions not available in standalone mode')
}
import { componentQueryOptions, componentsQueryOptions } from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Query hook for fetching components for a library
 */
export function useComponents(libraryId: string) {
  return useQuery(componentsQueryOptions(libraryId))
}

// Store stable component references per ID to prevent re-renders
const componentCache = new Map<string, Component | null>()

/**
 * Query hook for fetching a single component (with Suspense)
 * Uses a stable cache to prevent re-renders when component data changes
 */
export function useComponent(id: string) {
  // Use regular useQuery for standalone mode to avoid Suspense errors
  const isStandalone = id === 'standalone-mode'

  if (isStandalone) {
    return useQuery({
      ...componentQueryOptions(id),
      enabled: false, // Disable query
    })
  }

  return useSuspenseQuery({
    ...componentQueryOptions(id),
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    staleTime: Infinity, // Never consider data stale, preventing all automatic refetches
    gcTime: Infinity, // Keep data in cache forever
    // Use select to return a stable cached reference
    select: (data: Component | null) => {
      if (!data) return null
      // Return cached version if available to prevent object reference changes
      const cached = componentCache.get(id)
      if (cached && cached.id === data.id) {
        return cached
      }
      // Update cache with new data
      componentCache.set(id, data)
      return data
    },
    // CRITICAL: Only notify on loading/error, NEVER on data changes after initial load
    // This prevents re-renders when the component is saved
    notifyOnChangeProps: ['isLoading', 'isError', 'error'],
  })
}

/**
 * Mutation hook for creating a component
 */
export function useCreateComponent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateComponentInput) => createComponentAction(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['components', data.libraryId] })
      toast.success('Component created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create component: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for updating a component
 * IMPORTANT: This mutation does NOT update the React Query cache to prevent re-renders/flashing
 */
export function useUpdateComponent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateComponentInput }) =>
      updateComponentAction(id, input),
    onSuccess: (_data, variables) => {
      // Explicitly prevent any cache updates by canceling any potential refetches
      // and NOT updating the cache at all
      queryClient.cancelQueries({ queryKey: ['components', variables.id] }, { silent: true })

      // Don't invalidate or update anything to prevent re-renders/flashing
      // The component query will stay as-is, and the list query doesn't need to update
      // since we're not changing the component's metadata (name, description, etc.)
      // Only the spec changes, which is internal to the editor
      // Don't show toast for auto-saves, only for explicit saves
    },
    onError: (error: Error) => {
      toast.error(`Failed to update component: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting a component
 */
export function useDeleteComponent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, libraryId: _libraryId }: { id: string; libraryId: string }) => deleteComponentAction(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['components', variables.libraryId] })
      toast.success('Component deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete component: ${error.message}`)
    },
  })
}
