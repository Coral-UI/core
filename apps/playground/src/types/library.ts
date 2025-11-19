export interface Library {
  id: string
  organizationId: string
  name: string
  description?: string
  cssReset?: string // Compressed CSS reset (base64-encoded gzip)
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
  cssReset?: string // Compressed CSS reset (base64-encoded gzip)
}
