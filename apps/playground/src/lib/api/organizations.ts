import type { CreateOrganizationInput, Organization, UpdateOrganizationInput } from '@/types'

import { readMockData, writeMockData } from './data-store'

/**
 * Generate a unique ID for an organization
 */
function generateId(): string {
  return `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all organizations
 */
export async function getOrganizations(): Promise<Organization[]> {
  const data = await readMockData()
  return data.organizations
}

/**
 * Get a single organization by ID
 */
export async function getOrganization(id: string): Promise<Organization | null> {
  const data = await readMockData()
  return data.organizations.find((org) => org.id === id) || null
}

/**
 * Create a new organization
 */
export async function createOrganization(input: CreateOrganizationInput): Promise<Organization> {
  const data = await readMockData()
  const now = new Date().toISOString()

  const organization: Organization = {
    id: generateId(),
    name: input.name,
    createdAt: now,
    updatedAt: now,
  }

  data.organizations.push(organization)
  await writeMockData(data)

  return organization
}

/**
 * Update an organization
 */
export async function updateOrganization(id: string, input: UpdateOrganizationInput): Promise<Organization> {
  const data = await readMockData()
  const organization = data.organizations.find((org) => org.id === id)

  if (!organization) {
    throw new Error(`Organization with id ${id} not found`)
  }

  if (input.name !== undefined) {
    organization.name = input.name
  }

  organization.updatedAt = new Date().toISOString()
  await writeMockData(data)

  return organization
}

/**
 * Delete an organization
 */
export async function deleteOrganization(id: string): Promise<void> {
  const data = await readMockData()
  const index = data.organizations.findIndex((org) => org.id === id)

  if (index === -1) {
    throw new Error(`Organization with id ${id} not found`)
  }

  // Also delete all libraries and components associated with this organization
  const librariesToDelete = data.libraries.filter((lib) => lib.organizationId === id)
  const libraryIds = librariesToDelete.map((lib) => lib.id)

  // Delete components in those libraries
  data.components = data.components.filter((comp) => !libraryIds.includes(comp.libraryId))

  // Delete libraries
  data.libraries = data.libraries.filter((lib) => lib.organizationId !== id)

  // Delete organization
  data.organizations.splice(index, 1)
  await writeMockData(data)
}
