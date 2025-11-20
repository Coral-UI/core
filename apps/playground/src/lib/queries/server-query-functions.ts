/**
 * Server-side query functions for use in Server Components
 * These use the server Supabase client and work during SSR prefetching
 */

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'
import type { Organization, Library, Component, DesignToken, Theme } from '@/types'
import { extractArray } from '@/lib/supabase/helpers'
import { decompressCss } from '@/lib/utils/css-compression'
import type { CoralRootNode } from '@reallygoodwork/coral-core'

type OrganizationRow = Database['public']['Tables']['organizations']['Row']
type OrganizationMemberRow = Database['public']['Tables']['organization_members']['Row']
type LibraryRow = Database['public']['Tables']['libraries']['Row']
type ComponentRow = Database['public']['Tables']['components']['Row']
type DesignTokenRow = Database['public']['Tables']['design_tokens']['Row']
type ThemeRow = Database['public']['Tables']['themes']['Row']

/**
 * Get all organizations for the current user (server-side)
 */
export async function getOrganizationsServer(): Promise<Organization[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) {
    throw new Error('User not authenticated')
  }

  const userId = user.id

  // Get organizations where user is creator
  const { data: createdOrgs, error: createdError } = await supabase
    .from('organizations')
    .select('*')
    .eq('created_by', userId)

  if (createdError) {
    throw new Error(`Failed to fetch organizations: ${createdError.message}`)
  }

  // Get organization IDs where user is a member
  const { data: memberRows, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)

  if (memberError) {
    throw new Error(`Failed to fetch organization members: ${memberError.message}`)
  }

  const memberRowsArray = extractArray(memberRows, null) as OrganizationMemberRow[]
  const memberOrgIds = memberRowsArray.map((row) => row.organization_id)

  // Get member organizations
  let memberOrgs: Organization[] = []
  if (memberOrgIds.length > 0) {
    const { data: memberOrgsData, error: memberOrgsError } = await supabase
      .from('organizations')
      .select('*')
      .in('id', memberOrgIds)

    if (memberOrgsError) {
      throw new Error(`Failed to fetch member organizations: ${memberOrgsError.message}`)
    }

    const memberOrgsRows = extractArray(memberOrgsData, null) as OrganizationRow[]
    memberOrgs = memberOrgsRows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  }

  // Combine both lists, deduplicate by id
  const orgMap = new Map<string, Organization>()

  // Add created organizations
  const createdOrgsRows = extractArray(createdOrgs, null) as OrganizationRow[]
  createdOrgsRows.forEach((row) => {
    orgMap.set(row.id, {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
  })

  // Add member organizations
  memberOrgs.forEach((org) => {
    if (!orgMap.has(org.id)) {
      orgMap.set(org.id, org)
    }
  })

  return Array.from(orgMap.values())
}

/**
 * Get a single organization by ID (server-side)
 */
export async function getOrganizationServer(id: string): Promise<Organization | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) {
    throw new Error('User not authenticated')
  }

  // Get organization
  const { data, error } = await supabase.from('organizations').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch organization: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as OrganizationRow

  // Check if user has access (created by or member)
  const userId = user.id
  const isCreator = row.created_by === userId

  if (!isCreator) {
    // Check if user is a member
    const { data: member } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (!member) {
      // User doesn't have access
      return null
    }
  }

  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Get all libraries for an organization (server-side)
 */
export async function getLibrariesServer(organizationId: string): Promise<Library[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('libraries')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch libraries: ${error.message}`)
  }

  const rows = extractArray(data, error) as LibraryRow[]
  return rows.map((row) => {
    const library: Library = {
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row.description !== null) {
      library.description = row.description
    }

    if (row.css_reset !== null) {
      library.cssReset = row.css_reset
    }

    return library
  })
}

/**
 * Get a single library by ID (server-side)
 */
export async function getLibraryServer(id: string): Promise<Library | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('libraries').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch library: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as LibraryRow
  const library: Library = {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.description !== null) {
    library.description = row.description
  }

  if (row.css_reset !== null) {
    library.cssReset = row.css_reset
  }

  return library
}

/**
 * Get all components for a library (server-side)
 */
export async function getComponentsServer(libraryId: string): Promise<Component[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch components: ${error.message}`)
  }

  const rows = extractArray(data, error) as ComponentRow[]
  return rows.map((row) => {
    const comp: Component = {
      id: row.id,
      libraryId: row.library_id,
      name: row.name,
      spec: row.spec as CoralRootNode,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row.description !== null) {
      comp.description = row.description
    }

    if (row.accessibility !== null) {
      comp.accessibility = row.accessibility as unknown as NonNullable<Component['accessibility']>
    }

    return comp
  })
}

/**
 * Get all tokens for a library (server-side)
 */
export async function getTokensServer(libraryId: string): Promise<DesignToken[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('design_tokens')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch tokens: ${error.message}`)
  }

  const rows = extractArray(data, error) as DesignTokenRow[]
  return rows.map((row) => {
    const token: DesignToken = {
      id: row.id,
      libraryId: row.library_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row.$type !== null) {
      token.$type = row.$type as NonNullable<DesignToken['$type']>
    }

    if (row.$description !== null) {
      token.$description = row.$description
    }

    return token
  })
}

/**
 * Get all themes for a library (server-side)
 */
export async function getThemesServer(libraryId: string): Promise<Theme[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch themes: ${error.message}`)
  }

  const rows = extractArray(data, error) as ThemeRow[]
  return rows.map((row) => {
    const theme: Theme = {
      id: row.id,
      libraryId: row.library_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row.description !== null) {
      theme.description = row.description
    }

    return theme
  })
}

/**
 * Get CSS reset for a library (server-side, decompressed)
 */
export async function getLibraryCssResetServer(libraryId: string): Promise<string> {
  const library = await getLibraryServer(libraryId)
  if (!library || !library.cssReset) {
    return ''
  }
  return decompressCss(library.cssReset)
}
