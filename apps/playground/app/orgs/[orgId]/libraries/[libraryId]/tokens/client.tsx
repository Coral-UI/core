'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CreateThemeDialog } from '@/components/Library/CreateThemeDialog'
import { CreateTokenDialog } from '@/components/Library/CreateTokenDialog'
import { DesignTokensTable } from '@/components/Library/DesignTokensTable'
import { ThemesManager } from '@/components/Library/ThemesManager'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/primitives/Button/button'
import { libraryQueryOptions, themesQueryOptions, tokensQueryOptions } from '@/lib/queries/query-options'
import { useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

type Props = {
  orgId: string
  libraryId: string
}

export function TokensClient({ orgId, libraryId }: Props) {
  const [activeTab, setActiveTab] = useState<'tokens' | 'themes'>('tokens')
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
        <div className="flex items-center gap-2">
          {activeTab === 'tokens' ? (
            <CreateTokenDialog libraryId={libraryId} />
          ) : (
            <CreateThemeDialog libraryId={libraryId} />
          )}
        </div>
      </PageHeader>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setActiveTab('tokens')}
          className={activeTab === 'tokens' ? 'border-b-2 border-primary pb-2 px-1' : 'pb-2 px-1'}
        >
          Tokens
        </button>
        <button
          onClick={() => setActiveTab('themes')}
          className={activeTab === 'themes' ? 'border-b-2 border-primary pb-2 px-1' : 'pb-2 px-1'}
        >
          Themes
        </button>
      </div>

      {activeTab === 'tokens' ? (
        <div className="mt-6">
          <DesignTokensTable tokens={tokens} libraryId={libraryId} themes={themes} />
        </div>
      ) : (
        <div className="mt-6">
          <ThemesManager themes={themes} libraryId={libraryId} />
        </div>
      )}
    </div>
  )
}
