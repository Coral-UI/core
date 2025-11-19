import type { Component, CreateComponentInput, UpdateComponentInput } from '@/types'
import * as componentsApi from '@/lib/api/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const QUERY_KEY = ['components'] as const

/**
 * Query hook for fetching components for a library
 */
export function useComponents(libraryId: string) {
  return useQuery<Component[]>({
    queryKey: [...QUERY_KEY, libraryId],
    queryFn: () => componentsApi.getComponents(libraryId),
    enabled: !!libraryId,
  })
}

// Store stable component references per ID to prevent re-renders
const componentCache = new Map<string, Component | null>()

/**
 * Query hook for fetching a single component
 * Uses a stable cache to prevent re-renders when component data changes
 */
export function useComponent(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await componentsApi.getComponent(id)
      // Store in cache for stable reference
      if (data) {
        componentCache.set(id, data)
      }
      return data
    },
    enabled: !!id,
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
    mutationFn: (input: CreateComponentInput) => componentsApi.createComponent(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.libraryId] })
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
      componentsApi.updateComponent(id, input),
    onSuccess: (_data, variables) => {
      // Explicitly prevent any cache updates by canceling any potential refetches
      // and NOT updating the cache at all
      queryClient.cancelQueries({ queryKey: [...QUERY_KEY, variables.id] }, { silent: true })

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
    mutationFn: ({ id, libraryId: _libraryId }: { id: string; libraryId: string }) => componentsApi.deleteComponent(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.libraryId] })
      toast.success('Component deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete component: ${error.message}`)
    },
  })
}
