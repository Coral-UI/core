'use client'

import type { AcceptInvitationInput, CreateInvitationInput } from '@/types/invitation'
import * as invitationsApi from '@/lib/api/invitations'
import { invitationsQueryOptions } from '@/lib/queries/query-options'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Query hook for fetching invitations for an organization
 */
export function useInvitations(organizationId: string) {
  return useQuery(invitationsQueryOptions(organizationId))
}

/**
 * Mutation hook for creating an invitation
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateInvitationInput) => invitationsApi.createInvitation(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', data.organizationId] })
      toast.success('Invitation sent successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to send invitation: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for accepting an invitation
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: AcceptInvitationInput) => invitationsApi.acceptInvitation(input),
    onSuccess: async () => {
      // Invalidate all organization-related queries
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      toast.success('Invitation accepted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to accept invitation: ${error.message}`)
    },
  })
}

/**
 * Mutation hook for deleting an invitation
 */
export function useDeleteInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: string) => invitationsApi.deleteInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      toast.success('Invitation cancelled successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel invitation: ${error.message}`)
    },
  })
}
