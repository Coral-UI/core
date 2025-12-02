'use client'

import type { CreateLibraryInput, UpdateLibraryInput } from '@/types'
// Stub server actions for standalone/Vite mode
const createLibraryAction = async (_input: any) => {
  throw new Error('Server actions not available in standalone mode')
}
const updateLibraryAction = async (_id: string, _input: any) => {
  throw new Error('Server actions not available in standalone mode')
}
const updateLibraryCssResetAction = async (_id: string, _cssReset: string) => {
  throw new Error('Server actions not available in standalone mode')
}
const deleteLibraryAction = async (_id: string) => {
  throw new Error('Server actions not available in standalone mode')
}
import { librariesQueryOptions, libraryCssResetQueryOptions, libraryQueryOptions } from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
// Stub useRouter for standalone/Vite mode
const useRouter = () => ({
  push: (_path: string) => {},
  replace: (_path: string) => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: (_path: string) => {},
})
import { toast } from 'sonner'

/**
 * Query hook for fetching libraries for an organization
 */
export function useLibraries(organizationId: string) {
  return useQuery(librariesQueryOptions(organizationId))
}

/**
 * Query hook for fetching a single library (with Suspense)
 */
export function useLibrary(id: string) {
  return useSuspenseQuery(libraryQueryOptions(id))
}

/**
 * Mutation hook for creating a library
 */
export function useCreateLibrary() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: CreateLibraryInput) => createLibraryAction(input),
    onSuccess: (data) => {
      if (!data?.id) {
        toast.error('Failed to create library: Missing library ID')
        return
      }
      queryClient.invalidateQueries({ queryKey: ['libraries', data.organizationId] })
      toast.success('Library created successfully')
      // Navigate to the new library page
      router.push(`/orgs/${data.organizationId}/libraries/${data.id}`)
    },
    onError: (error: Error) => {
      toast.error(`Failed to create library: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for updating a library
 */
export function useUpdateLibrary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLibraryInput }) => updateLibraryAction(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['libraries', data.organizationId] })
      queryClient.invalidateQueries({ queryKey: ['libraries', data.id] })
      toast.success('Library updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update library: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting a library
 */
export function useDeleteLibrary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; organizationId: string }) => deleteLibraryAction(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['libraries', variables.organizationId] })
      toast.success('Library deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete library: ${error.message}`)
    },
  })
}

/**
 * Query hook for fetching CSS reset for a library (with Suspense)
 */
export function useLibraryCssReset(libraryId: string) {
  // Use regular useQuery for standalone mode to avoid Suspense errors
  const isStandalone = !libraryId || libraryId.trim() === '' || libraryId === 'standalone-mode'

  if (isStandalone) {
    return useQuery({
      ...libraryCssResetQueryOptions(libraryId),
      enabled: false,
    })
  }

  return useSuspenseQuery(libraryCssResetQueryOptions(libraryId))
}

/**
 * Mutation hook for updating CSS reset for a library
 */
export function useUpdateLibraryCssReset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ libraryId, css }: { libraryId: string; css: string }) =>
      updateLibraryCssResetAction(libraryId, css),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['libraries', data.id] })
      queryClient.invalidateQueries({ queryKey: ['libraries', data.id, 'css-reset'] })
      queryClient.invalidateQueries({ queryKey: ['libraries', data.organizationId] })
      toast.success('CSS reset saved successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to save CSS reset: ${error.message}`)
    },
  })
}
