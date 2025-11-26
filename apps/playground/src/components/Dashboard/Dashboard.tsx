import { Container } from '@/components/primitives/Stack/stack'
import { useOrganizations } from '@/hooks/queries/useOrganizations'

import { Breadcrumbs } from '../Breadcrumbs'
import { LoadingContent } from '../LoadingContent'
import { PageHeader } from '../PageHeader'
import { CardGrid } from '../primitives/CardGrid/CardGrid'
import { CreateOrganizationDialog } from './CreateOrganizationDialog'
import { OrganizationCard } from './OrganizationCard'

export function Dashboard() {
  const { data: organizations = [], isLoading } = useOrganizations()

  if (isLoading) {
    return <LoadingContent type="organizations" />
  }

  return (
    <Container className="pt-8">
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
    </Container>
  )
}
