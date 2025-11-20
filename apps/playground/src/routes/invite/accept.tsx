import { AuthGuard } from '@/lib/auth/auth-guard'
import { useAuthContext } from '@/lib/auth/auth-context'
import { getInvitationByToken } from '@/lib/api/invitations'
import { getOrganization } from '@/lib/api/organizations'
import { useAcceptInvitation } from '@/hooks/queries/useInvitations'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { OrganizationInvitation } from '@/types/invitation'

const acceptInvitationSearchSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export const Route = createFileRoute('/invite/accept')({
  component: AcceptInvitationPage,
  validateSearch: (search: Record<string, unknown>) => {
    return acceptInvitationSearchSchema.parse(search)
  },
})

function AcceptInvitationPage() {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const search = Route.useSearch()
  const acceptInvitation = useAcceptInvitation()
  const [invitation, setInvitation] = useState<OrganizationInvitation | null>(null)
  const [organizationName, setOrganizationName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInvitation() {
      try {
        const inv = await getInvitationByToken(search.token)
        if (!inv) {
          setError('Invalid or expired invitation')
          setLoading(false)
          return
        }

        // Check if invitation has expired
        const expiresAt = new Date(inv.expiresAt)
        if (expiresAt < new Date()) {
          setError('This invitation has expired')
          setLoading(false)
          return
        }

        setInvitation(inv)

        // Get organization name
        const org = await getOrganization(inv.organizationId)
        if (org) {
          setOrganizationName(org.name)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load invitation'
        setError(errorMessage)
        toast.error('Error', { description: errorMessage })
      } finally {
        setLoading(false)
      }
    }

    loadInvitation()
  }, [search.token])

  const handleAccept = async () => {
    if (!invitation || !user) return

    try {
      await acceptInvitation.mutateAsync({ token: invitation.token })
      // Navigate to organization page
      navigate({ to: '/orgs/$orgId', params: { orgId: invitation.organizationId } })
    } catch (err) {
      // Error is handled by the mutation hook
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-2xl">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="container mx-auto p-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>{error || 'This invitation is not valid'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const roleLabel = invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)

  return (
    <AuthGuard>
      <div className="container mx-auto p-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>You've been invited!</CardTitle>
            <CardDescription>Accept this invitation to join the organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Organization</p>
              <p className="text-sm text-muted-foreground">{organizationName || 'Unknown'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Role</p>
              <p className="text-sm text-muted-foreground">{roleLabel}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{invitation.email}</p>
            </div>
            {user?.email?.toLowerCase() !== invitation.email.toLowerCase() && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                This invitation was sent to {invitation.email}, but you are signed in as {user?.email}. Please sign in
                with the correct email address.
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                Cancel
              </Button>
              <Button
                onClick={handleAccept}
                disabled={acceptInvitation.isPending || user?.email?.toLowerCase() !== invitation.email.toLowerCase()}
              >
                {acceptInvitation.isPending ? 'Accepting...' : 'Accept Invitation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
