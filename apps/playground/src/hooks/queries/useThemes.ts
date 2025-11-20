import type { CreateThemeInput, CreateThemeOptionInput, UpdateThemeInput, UpdateThemeOptionInput } from '@/types'
import * as themesApi from '@/lib/api/themes'
import { themeOptionsQueryOptions, themeQueryOptions, themesQueryOptions } from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Query hook for fetching themes for a library
 */
export function useThemes(libraryId: string) {
  return useQuery(themesQueryOptions(libraryId))
}

/**
 * Query hook for fetching a single theme (with Suspense)
 */
export function useTheme(id: string) {
  return useSuspenseQuery(themeQueryOptions(id))
}

/**
 * Mutation hook for creating a theme
 */
export function useCreateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateThemeInput) => themesApi.createTheme(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['themes', data.libraryId] })
      toast.success('Theme created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create theme: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for updating a theme
 */
export function useUpdateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateThemeInput }) => themesApi.updateTheme(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['themes', data.libraryId] })
      queryClient.invalidateQueries({ queryKey: ['themes', data.id] })
      toast.success('Theme updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update theme: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting a theme
 */
export function useDeleteTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; libraryId: string }) => themesApi.deleteTheme(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['themes', variables.libraryId] })
      queryClient.invalidateQueries({ queryKey: ['tokenValues'] })
      toast.success('Theme deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete theme: ${error.message}`)
    },
  })
}

/**
 * Query hook for fetching theme options for a theme
 */
export function useThemeOptions(themeId: string) {
  return useQuery(themeOptionsQueryOptions(themeId))
}

/**
 * Mutation hook for creating a theme option
 */
export function useCreateThemeOption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateThemeOptionInput) => themesApi.createThemeOption(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['themeOptions', data.themeId] })
      toast.success('Theme option created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create theme option: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for updating a theme option
 */
export function useUpdateThemeOption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateThemeOptionInput }) =>
      themesApi.updateThemeOption(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['themeOptions', data.themeId] })
      toast.success('Theme option updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update theme option: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting a theme option
 */
export function useDeleteThemeOption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; themeId: string }) => themesApi.deleteThemeOption(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['themeOptions', variables.themeId] })
      queryClient.invalidateQueries({ queryKey: ['tokenValues'] })
      toast.success('Theme option deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete theme option: ${error.message}`)
    },
  })
}
