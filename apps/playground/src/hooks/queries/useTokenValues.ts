import type { CreateTokenValueInput, UpdateTokenValueInput } from '@/types'
import * as tokenValuesApi from '@/lib/api/token-values'
import {
  tokenValueQueryOptions,
  tokenValuesForLibraryQueryOptions,
  tokenValuesQueryOptions,
} from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Query hook for fetching token values for a token
 */
export function useTokenValues(tokenId: string) {
  return useQuery(tokenValuesQueryOptions(tokenId))
}

/**
 * Query hook for fetching token value for a specific token and theme option
 */
export function useTokenValue(tokenId: string, themeOptionId: string) {
  return useQuery(tokenValueQueryOptions(tokenId, themeOptionId))
}

/**
 * Query hook for fetching all token values for a library
 */
export function useTokenValuesForLibrary(libraryId: string) {
  return useQuery(tokenValuesForLibraryQueryOptions(libraryId))
}

/**
 * Mutation hook for setting/updating a token value
 */
export function useSetTokenValue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTokenValueInput) => tokenValuesApi.setTokenValue(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tokenValues', data.tokenId] })
      queryClient.invalidateQueries({ queryKey: ['tokenValues', data.tokenId, data.themeOptionId] })
      toast.success('Token value saved successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to save token value: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for updating a token value
 */
export function useUpdateTokenValue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTokenValueInput }) =>
      tokenValuesApi.updateTokenValue(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tokenValues', data.tokenId] })
      queryClient.invalidateQueries({ queryKey: ['tokenValues', data.tokenId, data.themeOptionId] })
      toast.success('Token value updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update token value: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting a token value
 */
export function useDeleteTokenValue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; tokenId: string }) => tokenValuesApi.deleteTokenValue(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tokenValues', variables.tokenId] })
      toast.success('Token value deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete token value: ${error.message}`)
    },
  })
}
