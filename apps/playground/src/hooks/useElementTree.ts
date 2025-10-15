import { useState, useCallback } from 'react'
import { CoralNode, CoralElementType } from '@reallygoodwork/coral-core'

export interface ElementTreeNode extends CoralNode {
  id: string
  parentId?: string | undefined
  isExpanded?: boolean | undefined
  isSelected?: boolean | undefined
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

  const moveElement = useCallback((elementId: string, newParentId?: string, _index?: number) => {
    setElements(prev => {
      const element = prev.find(el => el.id === elementId)
      if (!element) return prev
      
      const updated = prev.map(el => 
        el.id === elementId 
          ? { ...el, parentId: newParentId }
          : el
      )
      
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
      const filtered = elements.filter(el => el.parentId === parentId)
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