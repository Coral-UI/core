import type { CreateDesignTokenInput, DesignToken } from '@/types'
import * as tokensApi from '@/lib/api/tokens'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const QUERY_KEY = ['tokens'] as const

/**
 * Query hook for fetching tokens for a library
 */
export function useTokens(libraryId: string) {
  return useQuery<DesignToken[]>({
    queryKey: [...QUERY_KEY, libraryId],
    queryFn: () => tokensApi.getTokens(libraryId),
    enabled: !!libraryId,
  })
}

/**
 * Mutation hook for creating a token
 */
export function useCreateToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDesignTokenInput) => tokensApi.createToken(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.libraryId] })
      toast.success('Token created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create token: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting a token
 */
export function useDeleteToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, libraryId }: { id: string; libraryId: string }) => tokensApi.deleteToken(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.libraryId] })
      queryClient.invalidateQueries({ queryKey: ['tokenValues'] })
      toast.success('Token deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete token: ${error.message}`)
    },
  })
}
