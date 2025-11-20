/**
 * Query hooks for organization members
 */

import type { CreateOrganizationMemberInput, UpdateOrganizationMemberInput } from '@/lib/api/organization-members'
import * as organizationMembersApi from '@/lib/api/organization-members'
import { organizationMemberQueryOptions, organizationMembersQueryOptions } from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Query hook for fetching organization members
 */
export function useOrganizationMembers(organizationId: string) {
  return useQuery(organizationMembersQueryOptions(organizationId))
}

/**
 * Query hook for fetching a single organization member (with Suspense)
 */
export function useOrganizationMember(organizationId: string, userId: string) {
  return useSuspenseQuery(organizationMemberQueryOptions(organizationId, userId))
}

/**
 * Mutation hook for adding an organization member
 */
export function useCreateOrganizationMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateOrganizationMemberInput) => organizationMembersApi.createOrganizationMember(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', data.organizationId] })
      toast.success('Member added successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to add member: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for updating an organization member's role
 */
export function useUpdateOrganizationMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
      input,
    }: {
      organizationId: string
      userId: string
      input: UpdateOrganizationMemberInput
    }) => organizationMembersApi.updateOrganizationMember(organizationId, userId, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', data.organizationId] })
      queryClient.invalidateQueries({ queryKey: ['organization-members', data.organizationId, data.userId] })
      toast.success('Member role updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update member role: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for removing an organization member
 */
export function useDeleteOrganizationMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ organizationId, userId }: { organizationId: string; userId: string }) =>
      organizationMembersApi.deleteOrganizationMember(organizationId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', variables.organizationId] })
      toast.success('Member removed successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove member: ${error.message}`)
    },
  })
}
