import type { CreateOrganizationInput, Organization, UpdateOrganizationInput } from '@/types'
import * as organizationsApi from '@/lib/api/organizations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const QUERY_KEY = ['organizations'] as const

/**
 * Query hook for fetching all organizations
 */
export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: QUERY_KEY,
    queryFn: () => organizationsApi.getOrganizations(),
  })
}

/**
 * Query hook for fetching a single organization
 */
export function useOrganization(id: string) {
  return useQuery<Organization | null>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => organizationsApi.getOrganization(id),
    enabled: !!id,
  })
}

/**
 * Mutation hook for creating an organization
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => organizationsApi.createOrganization(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Organization created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create organization: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for updating an organization
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrganizationInput }) =>
      organizationsApi.updateOrganization(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.id] })
      toast.success('Organization updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update organization: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting an organization
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => organizationsApi.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Organization deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete organization: ${error.message}`)
    },
  })
}
