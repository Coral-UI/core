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

  // Query for the element tree
  const { data: elements = initialElements } = useQuery<ElementTreeNode[]>({
    queryKey: ELEMENT_TREE_QUERY_KEY,
    queryFn: () => initialElements,
    initialData: initialElements,
  })

  // Helper to create a new element
  const createElement = useCallback(
    (elementType: CoralElementType = 'div', parentId?: string, name?: string): ElementTreeNode => {
      const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      const element: ElementTreeNode = {
        id,
        parentId: parentId || undefined,
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
  const addElementMutation = useMutation({
    mutationFn: ({ elementType, parentId, name }: { elementType: CoralElementType; parentId?: string; name?: string }) => {
      const newElement = createElement(elementType, parentId, name)
      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements
      return [...currentElements, newElement]
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to remove an element
  const removeElementMutation = useMutation({
    mutationFn: (elementId: string) => {
      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements

      // Don't allow removing the root element
      if (elementId === 'root') return currentElements

      // Verify the element exists
      const elementToDelete = currentElements.find((el) => el.id === elementId)
      if (!elementToDelete) return currentElements

      console.log('Deleting element:', elementId)
      console.log('Element to delete:', elementToDelete)
      console.log('All elements before deletion:', currentElements.map(el => ({ id: el.id, parentId: el.parentId })))

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

        console.log('Children found for', id, ':', children.map(c => c.id))

        // Recursively collect children's IDs
        children.forEach((child) => {
          collectChildIds(child.id)
        })
      }

      // Start collecting from the element to delete
      collectChildIds(elementId)

      console.log('Elements to remove:', Array.from(toRemove))
      const result = currentElements.filter((el) => !toRemove.has(el.id))
      console.log('Elements after deletion:', result.map(el => ({ id: el.id, parentId: el.parentId })))

      // Filter out all elements that should be removed
      return result
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to update an element
  const updateElementMutation = useMutation({
    mutationFn: ({ elementId, updates }: { elementId: string; updates: Partial<ElementTreeNode> }) => {
      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements
      return currentElements.map((el) => (el.id === elementId ? { ...el, ...updates } : el))
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to move an element
  const moveElementMutation = useMutation({
    mutationFn: ({ elementId, newParentId, index }: { elementId: string; newParentId?: string; index?: number }) => {
      const currentElements = queryClient.getQueryData<ElementTreeNode[]>(ELEMENT_TREE_QUERY_KEY) || initialElements

      const element = currentElements.find((el) => el.id === elementId)
      if (!element) return currentElements

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

      return updated
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Mutation to replace all elements (for import functionality)
  const replaceAllElementsMutation = useMutation({
    mutationFn: (newElements: ElementTreeNode[]) => {
      return newElements
    },
    onSuccess: (newElements) => {
      queryClient.setQueryData(ELEMENT_TREE_QUERY_KEY, newElements)
    },
  })

  // Helper to build tree structure from flat array
  const getElementTree = useCallback(() => {
    const buildTree = (parentId?: string): ElementTreeNode[] => {
      const filtered = elements
        .filter((el) => el.parentId === parentId)
        .sort((a, b) => {
          if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
            return a.orderIndex - b.orderIndex
          }
          return 0
        })
      return filtered.map((el) => ({
        ...el,
        children: buildTree(el.id) as CoralNode[],
      }))
    }

    return buildTree()
  }, [elements])

  return {
    elements,
    addElement: (elementType: CoralElementType, parentId?: string, name?: string) => {
      addElementMutation.mutate({ elementType, parentId, name })
      return addElementMutation.data?.[addElementMutation.data.length - 1]?.id
    },
    removeElement: (elementId: string) => {
      removeElementMutation.mutate(elementId)
    },
    updateElement: (elementId: string, updates: Partial<ElementTreeNode>) => {
      updateElementMutation.mutate({ elementId, updates })
    },
    moveElement: (elementId: string, newParentId?: string, index?: number) => {
      moveElementMutation.mutate({ elementId, newParentId, index })
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
