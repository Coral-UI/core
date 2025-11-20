'use client'

import type { OrganizationInvitation } from '@/types/invitation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAcceptInvitation } from '@/hooks/queries/useInvitations'
import { getInvitationByToken } from '@/lib/api/invitations'
import { useAuthContext } from '@/lib/auth/auth-context'
import { AuthGuard } from '@/lib/auth/auth-guard'
import { getOrganizationServer } from '@/lib/queries/server-query-functions'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AcceptInvitationPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const acceptInvitation = useAcceptInvitation()
  const [invitation, setInvitation] = useState<OrganizationInvitation | null>(null)
  const [organizationName, setOrganizationName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Token is required')
      setLoading(false)
      return
    }

    async function loadInvitation() {
      try {
        const inv = await getInvitationByToken(token!)
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
        const org = await getOrganizationServer(inv.organizationId)
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
  }, [token])

  const handleAccept = async () => {
    if (!invitation || !user || !token) return

    try {
      await acceptInvitation.mutateAsync({ token })
      // Navigate to organization page
      router.push(`/orgs/${invitation.organizationId}`)
    } catch (_err) {
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
            <Button onClick={() => router.push('/')}>Go to Dashboard</Button>
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
              <Button variant="outline" onClick={() => router.push('/')}>
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
