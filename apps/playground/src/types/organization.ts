export interface Organization {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationInput {
  name: string
}

export interface UpdateOrganizationInput {
  name?: string
}
