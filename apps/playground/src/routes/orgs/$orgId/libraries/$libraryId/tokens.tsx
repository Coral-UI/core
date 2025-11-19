import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CreateThemeDialog } from '@/components/Library/CreateThemeDialog'
import { CreateTokenDialog } from '@/components/Library/CreateTokenDialog'
import { DesignTokensTable } from '@/components/Library/DesignTokensTable'
import { ThemesManager } from '@/components/Library/ThemesManager'
import { LoadingContent } from '@/components/LoadingContent'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useLibrary } from '@/hooks/queries/useLibraries'
import { useTokens } from '@/hooks/queries/useTokens'
import { useThemes } from '@/hooks/queries/useThemes'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/orgs/$orgId/libraries/$libraryId/tokens')({
  component: TokensRoute,
})

function TokensRoute() {
  const { orgId, libraryId } = Route.useParams()
  const [activeTab, setActiveTab] = useState<'tokens' | 'themes'>('tokens')
  const { data: library, isLoading: libLoading } = useLibrary(libraryId)
  const { data: tokens = [], isLoading: tokensLoading } = useTokens(libraryId)
  const { data: themes = [], isLoading: themesLoading } = useThemes(libraryId)

  if (libLoading || tokensLoading || themesLoading) {
    return <LoadingContent type="libraries" />
  }

  if (!library) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Library not found</div>
        <Link to="/orgs/$orgId" params={{ orgId }}>
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
      <PageHeader
        title="Design Tokens"
        description="Manage CSS variables and design tokens for this library"
      >
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
