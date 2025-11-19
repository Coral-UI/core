import type { CreateTokenValueInput, TokenValue, UpdateTokenValueInput } from '@/types'
import * as tokenValuesApi from '@/lib/api/token-values'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const QUERY_KEY = ['tokenValues'] as const

/**
 * Query hook for fetching token values for a token
 */
export function useTokenValues(tokenId: string) {
  return useQuery<TokenValue[]>({
    queryKey: [...QUERY_KEY, tokenId],
    queryFn: () => tokenValuesApi.getTokenValues(tokenId),
    enabled: !!tokenId,
  })
}

/**
 * Query hook for fetching token value for a specific token and theme option
 */
export function useTokenValue(tokenId: string, themeOptionId: string) {
  return useQuery<TokenValue | null>({
    queryKey: [...QUERY_KEY, tokenId, themeOptionId],
    queryFn: () => tokenValuesApi.getTokenValue(tokenId, themeOptionId),
    enabled: !!tokenId && !!themeOptionId,
  })
}

/**
 * Query hook for fetching all token values for a library
 */
export function useTokenValuesForLibrary(libraryId: string) {
  return useQuery<TokenValue[]>({
    queryKey: [...QUERY_KEY, 'library', libraryId],
    queryFn: () => tokenValuesApi.getTokenValuesForLibrary(libraryId),
    enabled: !!libraryId,
  })
}

/**
 * Mutation hook for setting/updating a token value
 */
export function useSetTokenValue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTokenValueInput) => tokenValuesApi.setTokenValue(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.tokenId] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.tokenId, data.themeOptionId] })
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
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.tokenId] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.tokenId, data.themeOptionId] })
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
    mutationFn: ({ id, tokenId }: { id: string; tokenId: string }) => tokenValuesApi.deleteTokenValue(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tokenId] })
      toast.success('Token value deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete token value: ${error.message}`)
    },
  })
}
