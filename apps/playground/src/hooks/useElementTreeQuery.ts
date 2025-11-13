import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { CoralElementType, CoralNode } from '@reallygoodwork/coral-core'

import { ElementTreeNode } from './useElementTree'

const ELEMENT_TREE_QUERY_KEY = ['elementTree'] as const

// Initialize with a root element
const initialElements: ElementTreeNode[] = [
  {
    id: 'root',
    name: 'Root',
    elementType: 'div',
    type: 'NODE',
    isExpanded: true,
    children: [],
  },
]

export const useElementTreeQuery = () => {
  const queryClient = useQueryClient()

  // Simple query - just read the data
  const { data: elements = initialElements } = useQuery<ElementTreeNode[]>({
    queryKey: ELEMENT_TREE_QUERY_KEY,
    queryFn: async () => {
      // Just return initialElements - mutations will update via setQueryData
      return initialElements
    },
    staleTime: Infinity, // Never refetch - we update via mutations only
    gcTime: Infinity,
  })

  // Helper to create a new element
  const createElement = useCallback(
    (elementType: CoralElementType = 'div', parentId?: string, name?: string): ElementTreeNode => {
      const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      // Normalize parentId: treat 'root' as undefined for consistency
      const normalizedParentId = parentId === 'root' || parentId === undefined ? undefined : parentId

      const element: ElementTreeNode = {
        id,
        parentId: normalizedParentId,
        name: name || `${elementType}_${id.split('_')[1]}`,
        elementType,
        type: 'NODE',
        isExpanded: true,
        children: [],
      }

      if (elementType === 'text') {
        element.textContent = 'Click to edit this text content'
      } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(elementType)) {
        element.textContent = `Heading ${elementType.slice(1)}`
      } else if (elementType === 'p') {
        element.textContent = 'Paragraph text content'
      } else if (elementType === 'button') {
        element.textContent = 'Button Text'
      } else if (['span'].includes(elementType)) {
        element.textContent = 'Span text'
      }

      return element
    },
    [],
  )

  // Mutation to add an element
  const addElementMutation = useMutation<
    ElementTreeNode[],
    Error,
    { elementType: CoralElementType; parentId?: string; name?: string; elementId?: string; element?: ElementTreeNode }
  >({
    mutationFn: ({ elementType, parentId, name, elementId, element }) => {
      // If element is provided, use it directly (avoids creating duplicate)
      // Otherwise, create a new element
      const newElement = element || createElement(elementType, parentId, name)

      // If elementId is provided, ensure it matches
      if (elementId && newElement.id !== elementId) {
        newElement.id = elementId
      }

      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements

      // Check if element already exists (prevent duplicates)
      if (currentElements.some((el) => el.id === newElement.id)) {
        return Promise.resolve(currentElements)
      }

      const newElements = [...currentElements, newElement]
      return Promise.resolve(newElements)
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to remove an element
  const removeElementMutation = useMutation<ElementTreeNode[], Error, string>({
    mutationFn: (elementId: string) => {
      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements

      // Don't allow removing the root element
      if (elementId === 'root') return Promise.resolve(currentElements)

      // Verify the element exists
      const elementToDelete = currentElements.find((el) => el.id === elementId)
      if (!elementToDelete) return Promise.resolve(currentElements)

      console.log('Deleting element:', elementId)
      console.log('Element to delete:', elementToDelete)
      console.log(
        'All elements before deletion:',
        currentElements.map((el) => ({ id: el.id, parentId: el.parentId })),
      )

      const toRemove = new Set<string>()

      // Recursively collect all child IDs to remove
      const collectChildIds = (id: string) => {
        // Only add to remove set if it's not already there (prevent infinite loops)
        if (toRemove.has(id)) {
          console.log('Skipping already processed:', id)
          return
        }

        console.log('Collecting children for:', id)
        toRemove.add(id)

        // Find all direct children of this element
        const children = currentElements.filter((el) => {
          // Skip the element itself
          if (el.id === id) {
            console.log('Skipping self:', el.id)
            return false
          }

          // For root, treat both undefined and 'root' as root
          if (id === 'root') {
            const isChild = !el.parentId || el.parentId === 'root'
            if (isChild) console.log('Found root child:', el.id, 'parentId:', el.parentId)
            return isChild
          }

          // For non-root elements, do exact match
          const isChild = el.parentId === id
          if (isChild) console.log('Found child:', el.id, 'parentId:', el.parentId, 'matches:', id)
          return isChild
        })

        console.log(
          'Children found for',
          id,
          ':',
          children.map((c) => c.id),
        )

        // Recursively collect children's IDs
        children.forEach((child) => {
          collectChildIds(child.id)
        })
      }

      // Start collecting from the element to delete
      collectChildIds(elementId)

      console.log('Elements to remove:', Array.from(toRemove))
      const result = currentElements.filter((el) => !toRemove.has(el.id))
      console.log(
        'Elements after deletion:',
        result.map((el) => ({ id: el.id, parentId: el.parentId })),
      )

      // Filter out all elements that should be removed
      return Promise.resolve(result)
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to update an element
  const updateElementMutation = useMutation<
    ElementTreeNode[],
    Error,
    { elementId: string; updates: Partial<ElementTreeNode> }
  >({
    mutationFn: ({ elementId, updates }) => {
      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements
      return Promise.resolve(currentElements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)))
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to move an element
  const moveElementMutation = useMutation<
    ElementTreeNode[],
    Error,
    { elementId: string; newParentId?: string; index?: number }
  >({
    mutationFn: ({ elementId, newParentId, index }) => {
      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements

      const element = currentElements.find((el) => el.id === elementId)
      if (!element) return Promise.resolve(currentElements)

      // Update the parent of the moved element
      let updated = currentElements.map((el) => (el.id === elementId ? { ...el, parentId: newParentId } : el))

      // If an index is specified, we need to reorder siblings
      if (index !== undefined) {
        const normalizedParentId = !newParentId || newParentId === 'root' ? 'root' : newParentId

        // Get all siblings sorted by orderIndex
        const siblingIds = updated
          .filter((el) => {
            const elParentId = !el.parentId || el.parentId === 'root' ? 'root' : el.parentId
            return elParentId === normalizedParentId
          })
          .sort((a, b) => {
            if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
              return a.orderIndex - b.orderIndex
            }
            return 0
          })
          .map((el) => el.id)

        // Remove the element from its current position
        const currentIndex = siblingIds.indexOf(elementId)
        if (currentIndex !== -1) {
          siblingIds.splice(currentIndex, 1)
        }

        // Insert at the new index
        siblingIds.splice(index, 0, elementId)

        // Create a map of id -> orderIndex
        const orderMap = new Map<string, number>()
        siblingIds.forEach((id, idx) => {
          orderMap.set(id, idx)
        })

        // Update ALL siblings with new orderIndex values
        updated = updated.map((el) => {
          if (orderMap.has(el.id)) {
            return { ...el, orderIndex: orderMap.get(el.id) }
          }
          return el
        })
      }

      return Promise.resolve(updated)
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to replace all elements (for import functionality)
  const replaceAllElementsMutation = useMutation<ElementTreeNode[], Error, ElementTreeNode[]>({
    mutationFn: (newElements) => {
      return Promise.resolve(newElements)
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Helper to build tree structure from flat array
  const getElementTree = useCallback(() => {
    const visitedIds = new Set<string>()

    const buildTree = (parentId: string | undefined): ElementTreeNode[] => {
      // Normalize parentId: treat undefined and 'root' as root level
      const normalizedParentId = parentId === undefined || parentId === 'root' ? undefined : parentId

      const filtered = elements
        .filter((el) => {
          // Prevent circular references - don't process elements we've already visited
          if (visitedIds.has(el.id)) return false

          // Normalize element's parentId: treat undefined and 'root' as root level
          const elParentId = el.parentId === undefined || el.parentId === 'root' ? undefined : el.parentId
          return elParentId === normalizedParentId
        })
        .sort((a, b) => {
          if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
            return a.orderIndex - b.orderIndex
          }
          return 0
        })

      return filtered.map((el) => {
        // Mark this element as visited to prevent circular references
        visitedIds.add(el.id)
        return {
          ...el,
          children: buildTree(el.id) as CoralNode[],
        }
      })
    }

    // Find the root element and build its tree
    const rootElement = elements.find((el) => el.id === 'root')
    if (!rootElement) {
      // If no root element exists, return empty array
      return []
    }

    // Mark root as visited and build its children
    visitedIds.add('root')
    return [
      {
        ...rootElement,
        children: buildTree('root') as CoralNode[],
      },
    ]
  }, [elements])

  return {
    elements,
    addElement: async (elementType: CoralElementType, parentId?: string, name?: string) => {
      // Create the element synchronously to get its ID immediately
      const newElement = createElement(elementType, parentId, name)

      // Trigger the mutation to add it to the query cache, passing the element directly
      // This avoids creating a duplicate element in the mutation
      await addElementMutation.mutateAsync({
        element: newElement,
        elementType,
        ...(parentId !== undefined && { parentId }),
        ...(name !== undefined && { name }),
        elementId: newElement.id,
      })

      // Return the new element ID after mutation completes
      return newElement.id
    },
    removeElement: (elementId: string) => {
      removeElementMutation.mutate(elementId)
    },
    updateElement: (elementId: string, updates: Partial<ElementTreeNode>) => {
      updateElementMutation.mutate({ elementId, updates })
    },
    moveElement: (elementId: string, newParentId?: string, index?: number) => {
      // Only pass optional properties if they're defined to avoid exactOptionalPropertyTypes issues
      moveElementMutation.mutate({
        elementId,
        ...(newParentId !== undefined && { newParentId }),
        ...(index !== undefined && { index }),
      })
    },
    toggleExpanded: (elementId: string) => {
      const element = elements.find((el) => el.id === elementId)
      if (element) {
        updateElementMutation.mutate({ elementId, updates: { isExpanded: !element.isExpanded } })
      }
    },
    replaceAllElements: (newElements: ElementTreeNode[]) => {
      replaceAllElementsMutation.mutate(newElements)
    },
    getElementTree,
  }
}
