import type { Component, CreateComponentInput, UpdateComponentInput } from '@/types'

import { readMockData, writeMockData } from './data-store'

/**
 * Generate a unique ID for a component
 */
function generateId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all components for a library
 */
export async function getComponents(libraryId: string): Promise<Component[]> {
  const data = await readMockData()
  return data.components.filter((comp) => comp.libraryId === libraryId)
}

/**
 * Get a single component by ID
 */
export async function getComponent(id: string): Promise<Component | null> {
  const data = await readMockData()
  return data.components.find((comp) => comp.id === id) || null
}

/**
 * Create a new component
 */
export async function createComponent(input: CreateComponentInput): Promise<Component> {
  const data = await readMockData()

  // Verify library exists
  const library = data.libraries.find((lib) => lib.id === input.libraryId)
  if (!library) {
    throw new Error(`Library with id ${input.libraryId} not found`)
  }

  const now = new Date().toISOString()

  const component: Component = {
    id: generateId(),
    libraryId: input.libraryId,
    name: input.name,
    ...(input.description && { description: input.description }),
    spec: input.spec,
    createdAt: now,
    updatedAt: now,
  }

  data.components.push(component)
  await writeMockData(data)

  return component
}

/**
 * Update a component
 */
export async function updateComponent(id: string, input: UpdateComponentInput): Promise<Component> {
  const data = await readMockData()
  const component = data.components.find((comp) => comp.id === id)

  if (!component) {
    throw new Error(`Component with id ${id} not found`)
  }

  if (input.name !== undefined) {
    component.name = input.name
  }

  if (input.description !== undefined) {
    component.description = input.description
  }

  if (input.spec !== undefined) {
    component.spec = input.spec
  }

  if (input.accessibility !== undefined) {
    component.accessibility = input.accessibility
  }

  component.updatedAt = new Date().toISOString()
  await writeMockData(data)

  return component
}

/**
 * Delete a component
 */
export async function deleteComponent(id: string): Promise<void> {
  const data = await readMockData()
  const index = data.components.findIndex((comp) => comp.id === id)

  if (index === -1) {
    throw new Error(`Component with id ${id} not found`)
  }

  data.components.splice(index, 1)
  await writeMockData(data)
}
