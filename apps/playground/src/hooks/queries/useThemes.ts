import type {
  CreateThemeInput,
  CreateThemeOptionInput,
  Theme,
  ThemeOption,
  UpdateThemeInput,
  UpdateThemeOptionInput,
} from '@/types'
import * as themesApi from '@/lib/api/themes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const QUERY_KEY = ['themes'] as const
const THEME_OPTIONS_QUERY_KEY = ['themeOptions'] as const

/**
 * Query hook for fetching themes for a library
 */
export function useThemes(libraryId: string) {
  return useQuery<Theme[]>({
    queryKey: [...QUERY_KEY, libraryId],
    queryFn: () => themesApi.getThemes(libraryId),
    enabled: !!libraryId,
  })
}

/**
 * Query hook for fetching a single theme
 */
export function useTheme(id: string) {
  return useQuery<Theme | null>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => themesApi.getTheme(id),
    enabled: !!id,
  })
}

/**
 * Mutation hook for creating a theme
 */
export function useCreateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateThemeInput) => themesApi.createTheme(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.libraryId] })
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
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.libraryId] })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.id] })
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
    mutationFn: ({ id, libraryId }: { id: string; libraryId: string }) => themesApi.deleteTheme(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.libraryId] })
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
  return useQuery<ThemeOption[]>({
    queryKey: [...THEME_OPTIONS_QUERY_KEY, themeId],
    queryFn: () => themesApi.getThemeOptions(themeId),
    enabled: !!themeId,
  })
}

/**
 * Mutation hook for creating a theme option
 */
export function useCreateThemeOption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateThemeOptionInput) => themesApi.createThemeOption(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...THEME_OPTIONS_QUERY_KEY, data.themeId] })
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
      queryClient.invalidateQueries({ queryKey: [...THEME_OPTIONS_QUERY_KEY, data.themeId] })
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
    mutationFn: ({ id, themeId }: { id: string; themeId: string }) => themesApi.deleteThemeOption(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...THEME_OPTIONS_QUERY_KEY, variables.themeId] })
      queryClient.invalidateQueries({ queryKey: ['tokenValues'] })
      toast.success('Theme option deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete theme option: ${error.message}`)
    },
  })
}
