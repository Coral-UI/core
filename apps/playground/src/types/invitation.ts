import type { OrgRole } from '@/lib/supabase/types'

export interface OrganizationInvitation {
  id: string
  organizationId: string
  email: string
  role: OrgRole
  invitedBy: string
  token: string
  expiresAt: string
  acceptedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateInvitationInput {
  organizationId: string
  email: string
  role: OrgRole
}

export interface AcceptInvitationInput {
  token: string
}
