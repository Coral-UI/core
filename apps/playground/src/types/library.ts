export interface Library {
  id: string
  organizationId: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateLibraryInput {
  organizationId: string
  name: string
  description?: string
}

export interface UpdateLibraryInput {
  name?: string
  description?: string
}
