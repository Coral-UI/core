import type { CreateOrganizationInput, UpdateOrganizationInput } from '@/types'
import * as organizationsApi from '@/lib/api/organizations'
import { organizationQueryOptions, organizationsQueryOptions } from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

const QUERY_KEY = ['organizations'] as const

/**
 * Query hook for fetching all organizations
 */
export function useOrganizations() {
  return useQuery(organizationsQueryOptions())
}

/**
 * Query hook for fetching a single organization (with Suspense)
 */
export function useOrganization(id: string) {
  return useSuspenseQuery(organizationQueryOptions(id))
}

/**
 * Mutation hook for creating an organization
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => organizationsApi.createOrganization(input),
    onSuccess: (organization) => {
      if (!organization?.id) {
        toast.error('Failed to create organization: Missing organization ID')
        return
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Organization created successfully')
      // Navigate to the new organization page
      navigate({ to: '/orgs/$orgId', params: { orgId: organization.id } })
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
