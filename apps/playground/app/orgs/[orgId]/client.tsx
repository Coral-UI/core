'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CardGrid } from '@/components/CardGrid'
import { CreateLibraryDialog } from '@/components/Organization/CreateLibraryDialog'
import { InviteMemberDialog } from '@/components/Organization/InviteMemberDialog'
import { LibraryCard } from '@/components/Organization/LibraryCard'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { librariesQueryOptions, organizationQueryOptions } from '@/lib/queries/query-options'
import { Library } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'

type Props = {
  orgId: string
}

export function OrganizationDetailClient({ orgId }: Props) {
  const { data: organization } = useSuspenseQuery(organizationQueryOptions(orgId))
  const { data: libraries = [] } = useSuspenseQuery(librariesQueryOptions(orgId))

  if (!organization) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Organization not found</div>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <Breadcrumbs className="mb-4" />
      <PageHeader title={organization.name} description="Manage libraries and components">
        <div className="flex gap-2">
          <InviteMemberDialog organizationId={orgId} />
          <CreateLibraryDialog organizationId={orgId} />
        </div>
      </PageHeader>

      <CardGrid
        itemList={libraries}
        type="libraries"
        itemComponent={(library) => <LibraryCard library={library as Library} organizationId={orgId} />}
      >
        <CreateLibraryDialog organizationId={orgId} />
      </CardGrid>
    </div>
  )
}
