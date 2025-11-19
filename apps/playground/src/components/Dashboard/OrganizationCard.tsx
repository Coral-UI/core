import type { Organization } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeleteOrganization } from '@/hooks/queries/useOrganizations'
import { Link } from '@tanstack/react-router'
import { Trash2Icon } from 'lucide-react'

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const deleteOrganization = useDeleteOrganization()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (
      confirm(`Are you sure you want to delete "${organization.name}"? This will delete all libraries and components.`)
    ) {
      deleteOrganization.mutate(organization.id)
    }
  }

  return (
    <Link to="/orgs/$orgId" params={{ orgId: organization.id }}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>Created {new Date(organization.createdAt).toLocaleDateString()}</CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={handleDelete} className="shrink-0">
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Click to view libraries</p>
        </CardContent>
      </Card>
    </Link>
  )
}
