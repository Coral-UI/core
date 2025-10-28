import { UpdatePropertyFn } from '@/components/Editor/Configuration/types/elementProperties'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { useState } from 'react'

/**
 * Hook for managing element HTML attributes
 * Handles adding, removing, and updating custom HTML attributes on elements
 */
export const useElementAttributes = (element: ElementTreeNode | null, updateProperty: UpdatePropertyFn) => {
  const [newAttrKey, setNewAttrKey] = useState('')
  const [newAttrValue, setNewAttrValue] = useState('')

  const handleAddAttribute = () => {
    if (!element || !newAttrKey.trim()) return

    const currentAttributes = element.elementAttributes || {}
    const updatedAttributes = {
      ...currentAttributes,
      [newAttrKey]: newAttrValue,
    }

    updateProperty('elementAttributes', updatedAttributes)
    setNewAttrKey('')
    setNewAttrValue('')
  }

  const handleRemoveAttribute = (key: string) => {
    if (!element) return

    const currentAttributes = element.elementAttributes || {}
    const { [key]: _removed, ...remaining } = currentAttributes
    updateProperty('elementAttributes', remaining)
  }

  const handleUpdateAttribute = (key: string, value: string) => {
    if (!element) return

    const currentAttributes = element.elementAttributes || {}
    const updatedAttributes = {
      ...currentAttributes,
      [key]: value,
    }
    updateProperty('elementAttributes', updatedAttributes)
  }

  const handleRenameAttribute = (oldKey: string, newKey: string) => {
    if (!element) return

    const currentAttributes = element.elementAttributes || {}
    const value = currentAttributes[oldKey]
    const { [oldKey]: _removed, ...remaining } = currentAttributes
    const updatedAttributes = {
      ...remaining,
      [newKey]: value,
    }
    updateProperty('elementAttributes', updatedAttributes)
  }

  return {
    newAttrKey,
    setNewAttrKey,
    newAttrValue,
    setNewAttrValue,
    handleAddAttribute,
    handleRemoveAttribute,
    handleUpdateAttribute,
    handleRenameAttribute,
  }
}
