import { useOrganizations } from '@/hooks/queries/useOrganizations'

import { Breadcrumbs } from '../Breadcrumbs'
import { CardGrid } from '../CardGrid'
import { LoadingContent } from '../LoadingContent'
import { PageHeader } from '../PageHeader'
import { CreateOrganizationDialog } from './CreateOrganizationDialog'
import { OrganizationCard } from './OrganizationCard'

export function Dashboard() {
  const { data: organizations = [], isLoading } = useOrganizations()

  if (isLoading) {
    return <LoadingContent type="organizations" />
  }

  return (
    <div className="container mx-auto p-8">
      <Breadcrumbs className="mb-4" />
      <PageHeader title="Organizations" description="Manage your organizations and their component libraries">
        <CreateOrganizationDialog />
      </PageHeader>

      <CardGrid
        itemList={organizations}
        type="organizations"
        itemComponent={(organization) => <OrganizationCard organization={organization} />}
      >
        <CreateOrganizationDialog />
      </CardGrid>
    </div>
  )
}
