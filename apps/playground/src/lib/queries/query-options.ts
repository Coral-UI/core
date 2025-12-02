/**
 * Query options factory pattern
 *
 * Centralized query options factories for use with TanStack Router loaders
 * and TanStack Query hooks. All options are strictly typed.
 */

import { queryOptions } from '@tanstack/react-query'

// Types are inferred from API functions, no need to import them here

import * as componentsApi from '@/lib/api/components'
import * as librariesApi from '@/lib/api/libraries'
import * as organizationsApi from '@/lib/api/organizations'
import * as organizationMembersApi from '@/lib/api/organization-members'
import * as tokensApi from '@/lib/api/tokens'
import * as themesApi from '@/lib/api/themes'
import * as tokenValuesApi from '@/lib/api/token-values'
import * as invitationsApi from '@/lib/api/invitations'

// Organizations
export const organizationsQueryOptions = () =>
  queryOptions({
    queryKey: ['organizations'],
    queryFn: () => organizationsApi.getOrganizations(),
  })

export const organizationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['organizations', id],
    queryFn: () => organizationsApi.getOrganization(id),
  })

// Organization Members
export const organizationMembersQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ['organization-members', organizationId],
    queryFn: () => organizationMembersApi.getOrganizationMembers(organizationId),
  })

export const organizationMemberQueryOptions = (organizationId: string, userId: string) =>
  queryOptions({
    queryKey: ['organization-members', organizationId, userId],
    queryFn: () => organizationMembersApi.getOrganizationMember(organizationId, userId),
  })

// Libraries
export const librariesQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ['libraries', organizationId],
    queryFn: () => librariesApi.getLibraries(organizationId),
  })

export const libraryQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['libraries', id],
    queryFn: () => librariesApi.getLibrary(id),
  })

export const libraryCssResetQueryOptions = (libraryId: string) => {
  const isStandalone = !libraryId || libraryId.trim() === '' || libraryId === 'standalone-mode'
  return queryOptions({
    queryKey: ['libraries', libraryId, 'css-reset'],
    queryFn: () => librariesApi.getLibraryCssReset(libraryId),
    enabled: !isStandalone, // Disable query in standalone mode
  })
}

// Components
export const componentsQueryOptions = (libraryId: string) =>
  queryOptions({
    queryKey: ['components', libraryId],
    queryFn: () => componentsApi.getComponents(libraryId),
  })

export const componentQueryOptions = (id: string) => {
  const isStandalone = id === 'standalone-mode'
  return queryOptions({
    queryKey: ['components', id],
    queryFn: () => {
      // Skip database call in standalone mode - return null immediately
      if (isStandalone) {
        return Promise.resolve(null)
      }
      return componentsApi.getComponent(id)
    },
    enabled: !isStandalone, // Disable query for standalone mode
  })
}

// Design Tokens
export const tokensQueryOptions = (libraryId: string) =>
  queryOptions({
    queryKey: ['tokens', libraryId],
    queryFn: () => tokensApi.getTokens(libraryId),
  })

// Themes
export const themesQueryOptions = (libraryId: string) =>
  queryOptions({
    queryKey: ['themes', libraryId],
    queryFn: () => themesApi.getThemes(libraryId),
  })

export const themeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['themes', id],
    queryFn: () => themesApi.getTheme(id),
  })

// Theme Options
export const themeOptionsQueryOptions = (themeId: string) =>
  queryOptions({
    queryKey: ['themeOptions', themeId],
    queryFn: () => themesApi.getThemeOptions(themeId),
  })

// Token Values
export const tokenValuesQueryOptions = (tokenId: string) =>
  queryOptions({
    queryKey: ['tokenValues', tokenId],
    queryFn: () => tokenValuesApi.getTokenValues(tokenId),
  })

export const tokenValueQueryOptions = (tokenId: string, themeOptionId: string) =>
  queryOptions({
    queryKey: ['tokenValues', tokenId, themeOptionId],
    queryFn: () => tokenValuesApi.getTokenValue(tokenId, themeOptionId),
  })

export const tokenValuesForLibraryQueryOptions = (libraryId: string) =>
  queryOptions({
    queryKey: ['tokenValues', 'library', libraryId],
    queryFn: () => tokenValuesApi.getTokenValuesForLibrary(libraryId),
  })

// Invitations
export const invitationsQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ['invitations', organizationId],
    queryFn: () => invitationsApi.getInvitations(organizationId),
  })

// Viewport/Breakpoint State (client-side only)
export interface ViewportBreakpointState {
  viewportWidth: number
  activeBreakpointId: string | null
}

const VIEWPORT_BREAKPOINT_INITIAL_STATE: ViewportBreakpointState = {
  viewportWidth: 1440,
  activeBreakpointId: null,
}

export const viewportBreakpointQueryOptions = () =>
  queryOptions({
    queryKey: ['viewport-breakpoint'] as const,
    queryFn: async () => {
      // Client-side only state - just return initial state
      return VIEWPORT_BREAKPOINT_INITIAL_STATE
    },
    staleTime: Infinity, // Never refetch - we update via mutations only
    gcTime: Infinity,
  })
