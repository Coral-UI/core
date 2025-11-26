'use client'

import type { Organization } from '@/types'
import { Button } from '@/components/primitives/Button/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/Card/card'
import { useDeleteOrganization } from '@/hooks/queries/useOrganizations'
import { formatDateReadable } from '@/lib/utils/date-format'
import { Trash2Icon } from 'lucide-react'
import Link from 'next/link'

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
    <Link href={`/orgs/${organization.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>Created {formatDateReadable(organization.createdAt)}</CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={handleDelete} className="shrink-0">
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
