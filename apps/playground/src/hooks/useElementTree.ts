import { useState, useCallback } from 'react'
import { CoralNode, CoralElementType } from '@reallygoodwork/coral-core'

export interface ElementTreeNode extends CoralNode {
  id: string
  parentId?: string | undefined
  isExpanded?: boolean | undefined
  isSelected?: boolean | undefined
  orderIndex?: number | undefined
}

export const useElementTree = () => {
  const [elements, setElements] = useState<ElementTreeNode[]>(() => {
    // Initialize with a root element
    const rootElement: ElementTreeNode = {
      id: 'root',
      name: 'Root',
      elementType: 'div',
      type: 'NODE',
      isExpanded: true,
      isSelected: false,
      children: [],
    }
    return [rootElement]
  })
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  const createElement = useCallback((
    elementType: CoralElementType = 'div',
    parentId?: string,
    name?: string
  ): ElementTreeNode => {
    const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    const element: ElementTreeNode = {
      id,
      parentId: parentId || undefined,
      name: name || `${elementType}_${id.split('_')[1]}`,
      elementType,
      type: 'NODE',
      isExpanded: true,
      isSelected: false,
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
  }, [])

  const addElement = useCallback((elementType: CoralElementType, parentId?: string, name?: string) => {
    const newElement = createElement(elementType, parentId, name)
    
    setElements(prev => {
      // Just add the new element to the flat list
      // The tree structure will be built dynamically in getElementTree
      const updated = [...prev, newElement]
      return updated
    })
    
    return newElement.id
  }, [createElement])

  const removeElement = useCallback((elementId: string) => {
    // Don't allow removing the root element
    if (elementId === 'root') return
    
    setElements(prev => {
      const toRemove = new Set<string>()
      
      const collectChildIds = (id: string) => {
        toRemove.add(id)
        prev.filter(el => el.parentId === id).forEach(child => {
          collectChildIds(child.id)
        })
      }
      
      collectChildIds(elementId)
      
      return prev.filter(el => !toRemove.has(el.id)).map(el => ({
        ...el,
        children: el.children?.filter(child => 
          typeof child === 'object' && 'id' in child 
            ? !toRemove.has((child as ElementTreeNode).id) 
            : true
        ) || []
      }))
    })
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null)
    }
  }, [selectedElementId])

  const updateElement = useCallback((elementId: string, updates: Partial<ElementTreeNode>) => {
    console.log('updateElement called:', { elementId, updates })
    setElements(prev => {
      const updated = prev.map(el => 
        el.id === elementId 
          ? { ...el, ...updates }
          : el
      )
      console.log('Elements after update:', updated)
      return updated
    })
  }, [])

  const moveElement = useCallback((elementId: string, newParentId?: string, index?: number) => {
    console.log('moveElement called:', { elementId, newParentId, index })

    setElements(prev => {
      const element = prev.find(el => el.id === elementId)
      if (!element) {
        console.log('Element not found!')
        return prev
      }

      console.log('Element found:', element)
      console.log('Current parentId:', element.parentId)

      // Update the parent of the moved element
      let updated = prev.map(el =>
        el.id === elementId
          ? { ...el, parentId: newParentId }
          : el
      )

      // If an index is specified, we need to reorder siblings
      if (index !== undefined) {
        // Normalize parent ID
        const normalizedParentId = !newParentId || newParentId === 'root' ? 'root' : newParentId
        console.log('Normalized parent ID:', normalizedParentId)

        // Get all siblings (by ID only)
        const siblingIds = updated
          .filter(el => {
            const elParentId = !el.parentId || el.parentId === 'root' ? 'root' : el.parentId
            return elParentId === normalizedParentId
          })
          .sort((a, b) => {
            // Sort by existing orderIndex if available
            if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
              return a.orderIndex - b.orderIndex
            }
            return 0
          })
          .map(el => el.id)

        console.log('Sibling IDs before move:', siblingIds)

        // Remove the element from its current position
        const currentIndex = siblingIds.indexOf(elementId)
        console.log('Current index:', currentIndex, 'Target index:', index)

        if (currentIndex !== -1) {
          siblingIds.splice(currentIndex, 1)
        }

        // Insert at the new index
        siblingIds.splice(index, 0, elementId)
        console.log('Sibling IDs after move:', siblingIds)

        // Create a map of id -> orderIndex
        const orderMap = new Map<string, number>()
        siblingIds.forEach((id, idx) => {
          orderMap.set(id, idx)
        })

        console.log('Order map:', Array.from(orderMap.entries()))

        // Update ALL siblings with new orderIndex values
        updated = updated.map(el => {
          if (orderMap.has(el.id)) {
            return { ...el, orderIndex: orderMap.get(el.id) }
          }
          return el
        })

        console.log('Updated elements:', updated.map(e => ({ id: e.id, name: e.name, orderIndex: e.orderIndex, parentId: e.parentId })))
      }

      return updated
    })
  }, [])

  const toggleExpanded = useCallback((elementId: string) => {
    updateElement(elementId, { isExpanded: !elements.find(el => el.id === elementId)?.isExpanded })
  }, [elements, updateElement])

  const selectElement = useCallback((elementId: string | null) => {
    setElements(prev => prev.map(el => ({
      ...el,
      isSelected: el.id === elementId
    })))
    setSelectedElementId(elementId)
  }, [])

  const getElementTree = useCallback(() => {
    const buildTree = (parentId?: string): ElementTreeNode[] => {
      const filtered = elements
        .filter(el => el.parentId === parentId)
        .sort((a, b) => {
          // Sort by orderIndex if available, otherwise maintain original order
          if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
            return a.orderIndex - b.orderIndex
          }
          return 0
        })
      return filtered.map(el => ({
        ...el,
        children: buildTree(el.id) as CoralNode[]
      }))
    }

    return buildTree()
  }, [elements])

  const getSelectedElement = useCallback(() => {
    return selectedElementId ? elements.find(el => el.id === selectedElementId) : null
  }, [elements, selectedElementId])

  return {
    elements,
    selectedElementId,
    addElement,
    removeElement,
    updateElement,
    moveElement,
    toggleExpanded,
    selectElement,
    getElementTree,
    getSelectedElement,
  }
}