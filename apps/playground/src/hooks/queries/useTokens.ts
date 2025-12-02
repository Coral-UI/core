'use client'

import type { CreateDesignTokenInput } from '@/types'
// Stub server actions for standalone/Vite mode
const createTokenAction = async (_input: any) => {
  throw new Error('Server actions not available in standalone mode')
}
const deleteTokenAction = async (_id: string) => {
  throw new Error('Server actions not available in standalone mode')
}
import { tokensQueryOptions } from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Query hook for fetching tokens for a library
 */
export function useTokens(libraryId: string) {
  return useQuery(tokensQueryOptions(libraryId))
}

/**
 * Mutation hook for creating a token
 */
export function useCreateToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDesignTokenInput) => createTokenAction(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tokens', data.libraryId] })
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
    mutationFn: ({ id }: { id: string; libraryId: string }) => deleteTokenAction(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tokens', variables.libraryId] })
      queryClient.invalidateQueries({ queryKey: ['tokenValues'] })
      toast.success('Token deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete token: ${error.message}`)
    },
  })
}
