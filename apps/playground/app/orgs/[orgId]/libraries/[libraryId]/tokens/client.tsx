'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DesignTokensTable } from '@/components/Library/DesignTokensTable'
import { ThemesManager } from '@/components/Library/ThemesManager'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/primitives/Button/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/Tabs/Tabs'
import { libraryQueryOptions, themesQueryOptions, tokensQueryOptions } from '@/lib/queries/query-options'
import { useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'

type Props = {
  orgId: string
  libraryId: string
}

export function TokensClient({ orgId, libraryId }: Props) {
  const { data: library } = useSuspenseQuery(libraryQueryOptions(libraryId))
  const { data: tokens = [] } = useSuspenseQuery(tokensQueryOptions(libraryId))
  const { data: themes = [] } = useSuspenseQuery(themesQueryOptions(libraryId))

  if (!library) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Library not found</div>
        <Link href={`/orgs/${orgId}`}>
          <Button variant="outline" className="mt-4">
            Back to Organization
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <Breadcrumbs className="mb-4" />
      <PageHeader title="Design Tokens" description="Manage CSS variables and design tokens for this library">
        <div className="flex items-center gap-2"></div>
      </PageHeader>

      <Tabs defaultValue="tokens">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>
        <TabsContent value="tokens">
          <DesignTokensTable tokens={tokens} libraryId={libraryId} themes={themes} />
        </TabsContent>
        <TabsContent value="themes">
          <ThemesManager themes={themes} libraryId={libraryId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
