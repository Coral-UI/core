import type { CreateLibraryInput, Library, UpdateLibraryInput } from '@/types'
import * as librariesApi from '@/lib/api/libraries'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const QUERY_KEY = ['libraries'] as const

/**
 * Query hook for fetching libraries for an organization
 */
export function useLibraries(organizationId: string) {
  return useQuery<Library[]>({
    queryKey: [...QUERY_KEY, organizationId],
    queryFn: () => librariesApi.getLibraries(organizationId),
    enabled: !!organizationId,
  })
}

/**
 * Query hook for fetching a single library
 */
export function useLibrary(id: string) {
  return useQuery<Library | null>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => librariesApi.getLibrary(id),
    enabled: !!id,
  })
}

/**
 * Mutation hook for creating a library
 */
export function useCreateLibrary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateLibraryInput) => librariesApi.createLibrary(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.organizationId] })
      toast.success('Library created successfully')
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
    mutationFn: ({ id, input }: { id: string; input: UpdateLibraryInput }) => librariesApi.updateLibrary(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.organizationId] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.id] })
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
    mutationFn: ({ id }: { id: string; organizationId: string }) => librariesApi.deleteLibrary(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.organizationId] })
      toast.success('Library deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete library: ${error.message}`)
    },
  })
}
