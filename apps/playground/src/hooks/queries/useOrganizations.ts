'use client'

import type { CreateOrganizationInput, UpdateOrganizationInput } from '@/types'
import {
  createOrganizationAction,
  deleteOrganizationAction,
  updateOrganizationAction,
} from '@/app/actions/organizations'
// Stub server actions for standalone/Vite mode - these are not used in standalone mode
import { organizationQueryOptions, organizationsQueryOptions } from '@/lib/queries/query-options'
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
  const router = useRouter()

  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => createOrganizationAction(input),
    onSuccess: (organization) => {
      if (!organization?.id) {
        toast.error('Failed to create organization: Missing organization ID')
        return
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Organization created successfully')
      // Navigate to the new organization page
      router.push(`/orgs/${organization.id}`)
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
    mutationFn: ({ id, input }: { id: string; input: UpdateOrganizationInput }) => updateOrganizationAction(id, input),
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
    mutationFn: (id: string) => deleteOrganizationAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Organization deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete organization: ${error.message}`)
    },
  })
}
