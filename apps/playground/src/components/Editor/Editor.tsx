'use client'

import { AccessibilityPanel } from '@/components/Editor/AccessibilityPanel'
import { EditorSidebar } from '@/components/Editor/ElementTree/EditorSidebar'
import { ImportCodeDialog } from '@/components/Editor/ImportCodeDialog'
import { EditorPreviewPane } from '@/components/Editor/Preview/EditorPreviewPane'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/primitives/Empty/Empty'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/Tabs/Tabs'
import { useComponent } from '@/hooks/queries/useComponents'
import { useViewportBreakpoint } from '@/hooks/queries/useViewportBreakpoint'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { useElementTreeQuery } from '@/hooks/useElementTreeQuery'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { checkAccessibility } from '@/lib/accessibility/checkAccessibility'
import * as componentsApi from '@/lib/api/components'
import { useElementSelectionStore } from '@/stores/useElementSelectionStore'
import { convertCoralStylesToFormValues, convertFormValuesToCoralStyles } from '@/utils/convertFormToCoralStyles'
import { getDefaultDisplayValue } from '@/utils/elementDisplay'
import { IconFolderCode } from '@tabler/icons-react'
import { memo, startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { CoralRootNode, CoralStyleType, transformHTMLToSpec } from '@reallygoodwork/coral-core'

import type { FormValues as ComponentFormValues } from './component-manager/formSchema'
import type { StyleFormValues } from './style-manager/formSchema'
import { ScrollArea } from '../primitives/ScrollArea/ScrollArea'
import { BreakpointManager } from './BreakpointManager/BreakpointManager'
import { ComponentForm } from './component-manager/componentForm'
import { useSyncViewportToBreakpoint } from './Configuration/hooks/useSyncViewportToBreakpoint'
import { StyleForm } from './style-manager/styleForm'

interface EditorProps {
  componentId: string
}

export const Editor = memo(({ componentId }: EditorProps) => {
  // Use select to only subscribe to the data we need, preventing re-renders on other changes
  const { data: component, isLoading: componentLoading } = useComponent(componentId)
  // Don't use the mutation hook - it causes re-renders. Call API directly instead.
  // const updateComponent = useUpdateComponent()
  const selectedElementId = useElementSelectionStore((state) => state.selectedElementId)
  const setSelectedElementId = useElementSelectionStore((state) => state.setSelectedElementId)
  const { data: viewportBreakpointState } = useViewportBreakpoint()
  const activeBreakpointId = viewportBreakpointState?.activeBreakpointId ?? null
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [lastSavedSpec, setLastSavedSpec] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingFromDb, setIsLoadingFromDb] = useState(false)
  const [isCheckingAccessibility, setIsCheckingAccessibility] = useState(false)
  const loadedComponentIdRef = useRef<string | null>(null)
  const justSavedRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastElementsHashRef = useRef<string | null>(null)
  const isSavingRef = useRef(false)
  const isLoadingFromDbRef = useRef(false)
  const componentRef = useRef(component)
  const componentSpecRef = useRef<CoralRootNode | null>(null)
  const lastSavedSpecRef = useRef<string | null>(null)
  const elementTreeHook = useElementTreeQuery()
  const { elements, getElementTree, replaceAllElements, updateElement, removeElement } = elementTreeHook

  // Keep refs in sync with state
  useEffect(() => {
    isSavingRef.current = isSaving
  }, [isSaving])
  useEffect(() => {
    isLoadingFromDbRef.current = isLoadingFromDb
  }, [isLoadingFromDb])
  useEffect(() => {
    componentRef.current = component
    if (component?.spec) {
      componentSpecRef.current = component.spec
    }
  }, [component])
  useEffect(() => {
    lastSavedSpecRef.current = lastSavedSpec
  }, [lastSavedSpec])

  // Get the selected element
  const selectedElement = useMemo(() => {
    return selectedElementId ? elements.find((el) => el.id === selectedElementId) : null
  }, [elements, selectedElementId])

  // Sync viewport width changes to breakpoint selection
  useSyncViewportToBreakpoint(selectedElement ?? null)

  // Convert element styles to form values for initial values
  // If a breakpoint is selected, use that breakpoint's styles; otherwise use base styles
  const formInitialValues = useMemo(() => {
    if (!selectedElement) {
      return undefined
    }

    // Determine which styles to use based on active breakpoint
    let stylesToUse: Record<string, unknown> | undefined

    if (activeBreakpointId) {
      // Find the selected breakpoint and use its styles
      const breakpointIndex = parseInt(activeBreakpointId.replace('breakpoint_', ''), 10)
      const responsiveStyles = selectedElement.responsiveStyles || []
      const selectedBreakpoint = responsiveStyles[breakpointIndex]
      if (selectedBreakpoint?.styles) {
        stylesToUse = selectedBreakpoint.styles as Record<string, unknown>
      }
    }

    // Fall back to base styles if no breakpoint selected or breakpoint has no styles
    if (!stylesToUse) {
      stylesToUse = selectedElement.styles as Record<string, unknown> | undefined
    }

    const baseFormValues = stylesToUse ? (convertCoralStylesToFormValues(stylesToUse) as Partial<StyleFormValues>) : {}

    // Set default display value for inline elements if not already set in styles
    // This only affects the UI - showing 'inline' for elements like span, a, strong, etc.
    // The value won't be persisted to the element's styles until the user explicitly changes it
    // because handleStyleChange only persists fields that are in changedFields
    if (!baseFormValues.display && selectedElement.elementType) {
      const defaultDisplay = getDefaultDisplayValue(selectedElement.elementType)
      if (defaultDisplay === 'inline') {
        baseFormValues.display = 'inline'
      }
    }

    return baseFormValues
  }, [selectedElement, activeBreakpointId])

  // Convert element properties to component form initial values
  const componentFormInitialValues = useMemo(() => {
    if (!selectedElement) {
      return undefined
    }
    return {
      name: selectedElement.name || '',
      description: selectedElement.description || undefined,
      type: selectedElement.elementType || 'div',
      textContent: selectedElement.textContent || undefined,
    } as Partial<ComponentFormValues>
  }, [selectedElement])

  // Create a stable key for the form based on element ID and active breakpoint
  // This ensures the form remounts when switching elements or breakpoints
  const formKey = `${selectedElementId}-${activeBreakpointId || 'base'}`

  // Handle style form changes - only merge the changed style
  const handleStyleChange = useCallback(
    (formValues: StyleFormValues, changedFields?: Record<string, unknown>) => {
      if (!selectedElementId || !selectedElement) return

      // Only convert the fields that were actually changed
      // Include related unit fields for dimension properties
      const fieldsToConvert: Record<string, unknown> = {}

      if (changedFields && Object.keys(changedFields).length > 0) {
        // Add changed fields
        Object.keys(changedFields).forEach((key) => {
          fieldsToConvert[key] = changedFields[key]

          // If this is a dimension value field, also include its unit field
          // Check if this key has a corresponding unit field
          const unitKey = `${key}Unit`
          if (unitKey in formValues) {
            fieldsToConvert[unitKey] = formValues[unitKey as keyof StyleFormValues]
          }

          // If this is a unit field, also include its value field
          // Check if this is a unit field (ends with Unit)
          if (key.endsWith('Unit')) {
            const valueKey = key.replace('Unit', '')
            if (valueKey in formValues) {
              fieldsToConvert[valueKey] = formValues[valueKey as keyof StyleFormValues]
            }
          }
        })
      } else {
        // Fallback: if no changedFields provided, use all form values
        // But this shouldn't happen in normal operation
        Object.assign(fieldsToConvert, formValues)
      }

      // Convert only the changed fields to Coral styles
      const coralStyles = convertFormValuesToCoralStyles(
        fieldsToConvert as Record<string, unknown>,
        // styleFormDefaultValues,
        // selectedElement.styles as Record<string, unknown> | undefined,
      )

      // Check if we're editing a breakpoint or base styles
      if (activeBreakpointId) {
        // Update the selected breakpoint's styles
        const breakpointIndex = parseInt(activeBreakpointId.replace('breakpoint_', ''), 10)
        const responsiveStyles = [...(selectedElement.responsiveStyles || [])]
        const selectedBreakpoint = responsiveStyles[breakpointIndex]

        if (selectedBreakpoint) {
          // Merge the changed styles into the breakpoint's existing styles
          const mergedBreakpointStyles = {
            ...(selectedBreakpoint.styles || {}),
            ...coralStyles,
          }

          // Update the breakpoint with merged styles
          responsiveStyles[breakpointIndex] = {
            ...selectedBreakpoint,
            styles: mergedBreakpointStyles as CoralStyleType,
          }

          // Update the element with the modified responsive styles
          updateElement(selectedElementId, { responsiveStyles })
        }
      } else {
        // Update base styles
        const mergedStyles = {
          ...(selectedElement.styles || {}),
          ...coralStyles,
        }

        // Update the element with merged styles
        updateElement(selectedElementId, { styles: mergedStyles as CoralStyleType })
      }
    },
    [selectedElementId, selectedElement, updateElement, activeBreakpointId],
  )

  // Handle component form changes
  const handleComponentChange = useCallback(
    (formValues: ComponentFormValues, changedFields?: Record<string, unknown>) => {
      if (!selectedElementId || !selectedElement) return

      const updates: Record<string, unknown> = {}

      // Update name if changed
      if (changedFields && 'name' in changedFields) {
        updates['name'] = formValues['name']
      }

      // Update description - remove if empty/undefined, otherwise set it
      if (changedFields && 'description' in changedFields) {
        const descriptionValue = formValues['description']
        if (descriptionValue && descriptionValue.trim() !== '') {
          updates['description'] = descriptionValue.trim()
        } else {
          // Remove description by setting it to undefined
          // This will be filtered out in convertToCoralSpec
          updates['description'] = undefined
        }
      }

      // Update elementType if changed
      if (changedFields && 'type' in changedFields) {
        updates['elementType'] = formValues['type']
      }

      // Update textContent if changed
      if (changedFields && 'textContent' in changedFields) {
        const textContentValue = formValues['textContent']
        if (textContentValue && textContentValue.trim() !== '') {
          updates['textContent'] = textContentValue.trim()
        } else {
          // Remove textContent by setting it to undefined
          updates['textContent'] = undefined
        }
      }

      // Only update if there are actual changes
      if (Object.keys(updates).length > 0) {
        updateElement(selectedElementId, updates as Partial<ElementTreeNode>)
      }
    },
    [selectedElementId, selectedElement, updateElement],
  )

  const convertToCoralSpec = useCallback((): CoralRootNode => {
    // Get fresh element tree on each render
    const elementTree = getElementTree()

    if (elementTree.length === 0) {
      return {
        name: 'root',
        elementType: 'div',
        type: 'NODE',
        children: [],
      } as CoralRootNode
    }

    const buildCoralNode = (element: ElementTreeNode): CoralRootNode => {
      const node = {
        // Don't include internal ID in spec - it's only for editor use
        name: element.name,
        elementType: element.elementType,
        type: element.type || 'NODE',
        textContent: element.textContent,
        description: element.description,
        elementAttributes: element.elementAttributes,
        styles: element.styles, // Include styles in the coral spec
        responsiveStyles: element.responsiveStyles, // Include responsive styles
        children:
          element.children && element.children.length > 0
            ? element.children.map((child) => buildCoralNode(child as ElementTreeNode))
            : undefined,
      }

      return Object.fromEntries(
        Object.entries(node).filter(([_, value]) => value !== undefined),
      ) as unknown as CoralRootNode
    }

    if (elementTree.length === 1) {
      return buildCoralNode(elementTree[0]!) as CoralRootNode
    }

    return {
      name: 'root',
      elementType: 'div',
      type: 'NODE',
      children: elementTree.map(buildCoralNode),
    } as CoralRootNode
  }, [getElementTree])

  // Create a stable hash of elements to detect actual changes
  const elementsHash = useMemo(() => JSON.stringify(elements), [elements])

  // Memoize spec generation based on elements hash (not function reference)
  // This ensures spec only changes when elements actually change
  const specString = useMemo(() => {
    return JSON.stringify(convertToCoralSpec())
  }, [elementsHash, convertToCoralSpec])

  const spec = useMemo(() => JSON.parse(specString) as CoralRootNode, [specString])

  // Check if there are unsaved changes using the stringified spec
  const hasUnsavedChanges = lastSavedSpec !== null && lastSavedSpec !== specString && isInitialized

  // Load component spec ONLY when component ID changes (not when component object changes)
  useEffect(() => {
    // Don't load if:
    // - Still loading initial data
    // - Already initialized for this component ID
    // - Currently loading from DB
    // - We just saved (to prevent reload loop)
    // - Currently saving
    if (
      componentLoading ||
      isLoadingFromDb ||
      isLoadingFromDbRef.current ||
      justSavedRef.current ||
      isSavingRef.current ||
      (isInitialized && loadedComponentIdRef.current === componentId)
    ) {
      return
    }

    // Need component data to load
    if (!component || !componentSpecRef.current) {
      return
    }

    // If component ID changed, reset initialization
    if (loadedComponentIdRef.current !== null && loadedComponentIdRef.current !== componentId) {
      setIsInitialized(false)
      setLastSavedSpec(null)
      lastSavedSpecRef.current = null
    }

    // Only load if we haven't loaded this component yet
    if (isInitialized && loadedComponentIdRef.current === componentId) {
      return
    }

    setIsLoadingFromDb(true)
    isLoadingFromDbRef.current = true
    const currentComponentId = componentId
    loadedComponentIdRef.current = currentComponentId
    const specToLoad = componentSpecRef.current
    const convertCoralToElements = (node: CoralRootNode, parentId?: string): ElementTreeNode[] => {
      const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const element: ElementTreeNode = {
        id,
        parentId,
        name: node.name || node.elementType,
        elementType: node.elementType,
        type: node.type || 'NODE',
        isExpanded: true,
      }

      if (node.textContent) {
        element.textContent = node.textContent
      }
      if (node.description) {
        element.description = node.description
      }
      if (node.elementAttributes) {
        element.elementAttributes = node.elementAttributes
      }
      if (node.styles) {
        element.styles = node.styles
      }
      if (node.responsiveStyles) {
        element.responsiveStyles = node.responsiveStyles
      }

      let allElements = [element]

      if (node.children && node.children.length > 0) {
        node.children.forEach((child: CoralRootNode) => {
          const childElements = convertCoralToElements(child, id)
          allElements = [...allElements, ...childElements]
        })
      }

      return allElements
    }

    // ALWAYS treat the saved spec as the root element
    // The spec represents the entire component tree, so the top-level node
    // should always become the 'root' element in the editor
    const convertedElements = convertCoralToElements(specToLoad)

    // Set the first element (the top-level spec node) to use 'root' as ID
    if (convertedElements.length > 0) {
      const originalId = convertedElements[0]!.id
      convertedElements[0]!.id = 'root'
      convertedElements[0]!.parentId = undefined

      // Update all children's parentId from the original ID to 'root'
      convertedElements.slice(1).forEach((el) => {
        if (el.parentId === originalId) {
          el.parentId = 'root'
        }
      })
    }

    const newElements = convertedElements

    // Only replace elements if they're actually different to prevent unnecessary re-renders
    const currentElementsString = JSON.stringify(elements)
    const newElementsString = JSON.stringify(newElements)
    if (currentElementsString !== newElementsString) {
      replaceAllElements(newElements)
    }
    setIsInitialized(true)

    // Set the last saved spec to match what we just loaded
    const loadedSpecString = JSON.stringify(specToLoad)
    setLastSavedSpec(loadedSpecString)
    lastSavedSpecRef.current = loadedSpecString
    lastElementsHashRef.current = loadedSpecString
    setIsLoadingFromDb(false)
    isLoadingFromDbRef.current = false
    justSavedRef.current = false // Reset save flag after loading
  }, [componentId, componentLoading, replaceAllElements])

  // Reset initialization and saved state when componentId changes
  useEffect(() => {
    setIsInitialized(false)
    setLastSavedSpec(null)
    lastSavedSpecRef.current = null
    setIsSaving(false)
    setIsLoadingFromDb(false)
    loadedComponentIdRef.current = null
    justSavedRef.current = false
    lastElementsHashRef.current = null
    // Clear any pending save timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
  }, [componentId])

  // Save function - call API directly to avoid React Query mutation re-renders
  const handleSave = useCallback(async () => {
    if (!component || !isInitialized || isSaving) return

    // Use startTransition to prevent immediate re-render flash
    startTransition(() => {
      setIsSaving(true)
    })
    isSavingRef.current = true
    justSavedRef.current = true // Mark that we're saving to prevent reload
    try {
      const spec = convertToCoralSpec()
      const specString = JSON.stringify(spec)

      // Call API directly instead of using mutation hook to prevent re-renders
      await componentsApi.updateComponent(component.id, { spec })

      // Batch state updates in a transition to prevent flashing
      startTransition(() => {
        setLastSavedSpec(specString)
        setIsSaving(false)
      })
      lastSavedSpecRef.current = specString
      lastElementsHashRef.current = specString
      isSavingRef.current = false

      toast.success('Component saved successfully')

      // Run accessibility check after successful save
      try {
        setIsCheckingAccessibility(true)
        const accessibilityResults = await checkAccessibility(spec)
        await componentsApi.updateComponent(component.id, { accessibility: accessibilityResults })
        toast.success('Accessibility check completed')
      } catch (error) {
        // Don't block save if accessibility check fails
        console.error('Accessibility check failed:', error)
        toast.error(`Accessibility check failed: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setIsCheckingAccessibility(false)
      }

      // Reset save flag after a delay to prevent any reload attempts
      setTimeout(() => {
        justSavedRef.current = false
      }, 1000)
    } catch (error) {
      justSavedRef.current = false
      isSavingRef.current = false
      startTransition(() => {
        setIsSaving(false)
      })
      toast.error(`Failed to save: ${(error as Error).message}`)
    }
  }, [component, isInitialized, isSaving, convertToCoralSpec])

  // Auto-save component spec when it changes (debounced)
  // Use interval-based checking to avoid dependency on elements array
  useEffect(() => {
    // Don't set up auto-save if component not ready
    if (!component || !isInitialized) {
      return
    }

    // Check for changes periodically instead of on every render
    const checkInterval = setInterval(() => {
      const currentComponent = componentRef.current
      // Skip if component not available, saving, loading, or just saved
      if (!currentComponent || isSavingRef.current || isLoadingFromDbRef.current || justSavedRef.current) {
        return
      }

      // Calculate current spec
      const currentSpec = convertToCoralSpec()
      const currentSpecString = JSON.stringify(currentSpec)

      // Skip if nothing has changed (use ref for stable comparison)
      if (lastSavedSpecRef.current === currentSpecString) {
        return
      }

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Set new timeout to save after 2 seconds of inactivity
      saveTimeoutRef.current = setTimeout(() => {
        // Double-check conditions before saving using refs
        if (isSavingRef.current || isLoadingFromDbRef.current || justSavedRef.current || !componentRef.current) {
          return
        }

        // Recalculate spec at save time
        const spec = convertToCoralSpec()
        const specString = JSON.stringify(spec)

        // Double-check we still have changes before saving (use ref)
        if (lastSavedSpecRef.current === specString) {
          return
        }

        startTransition(() => {
          setIsSaving(true)
        })
        isSavingRef.current = true
        justSavedRef.current = true // Mark that we're saving to prevent reload

        // Call API directly instead of using mutation hook to prevent re-renders
        componentsApi
          .updateComponent(componentRef.current.id, { spec })
          .then(() => {
            startTransition(() => {
              setLastSavedSpec(specString)
              setIsSaving(false)
            })
            lastSavedSpecRef.current = specString
            lastElementsHashRef.current = specString
            isSavingRef.current = false
            // Reset save flag after a longer delay to prevent reload loops
            setTimeout(() => {
              justSavedRef.current = false
            }, 500)
          })
          .catch(() => {
            justSavedRef.current = false
            isSavingRef.current = false
            startTransition(() => {
              setIsSaving(false)
            })
          })
      }, 2000)
    }, 1000) // Check every second

    return () => {
      clearInterval(checkInterval)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [component?.id, isInitialized, convertToCoralSpec])

  const handleImportCode = (code: string) => {
    try {
      const spec = transformHTMLToSpec(code)

      // Convert the coral spec to ElementTreeNode format
      const convertCoralToElements = (node: CoralRootNode, parentId?: string): ElementTreeNode[] => {
        const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const element: ElementTreeNode = {
          id,
          parentId,
          name: node.name || node.elementType,
          elementType: node.elementType,
          type: node.type || 'NODE',
          isExpanded: true,
        }

        if (node.textContent) {
          element.textContent = node.textContent
        }
        if (node.elementAttributes) {
          element.elementAttributes = node.elementAttributes
        }
        if (node.styles) {
          element.styles = node.styles
        }
        if (node.responsiveStyles) {
          element.responsiveStyles = node.responsiveStyles
        }

        let allElements = [element]

        if (node.children && node.children.length > 0) {
          node.children.forEach((child: CoralRootNode) => {
            const childElements = convertCoralToElements(child, id)
            allElements = [...allElements, ...childElements]
          })
        }

        return allElements
      }

      const importedElements = convertCoralToElements(spec, 'root')

      // Create root element and ensure imported elements are children of root
      const rootElement: ElementTreeNode = {
        id: 'root',
        name: 'Root',
        elementType: 'div',
        type: 'NODE',
        isExpanded: true,
        children: [],
      }

      // Ensure all top-level imported elements have root as parent
      const elementsWithRootParent = importedElements.map((el) => {
        // If element has no parentId or parentId is undefined, set it to 'root'
        if (!el.parentId) {
          return { ...el, parentId: 'root' as string }
        }
        return el
      })

      // Combine root element with imported elements
      const newElements = [rootElement, ...elementsWithRootParent]

      // Replace all elements with the imported ones (including root)
      replaceAllElements(newElements)

      toast.success('Component imported successfully')
    } catch (error) {
      toast.error(`Failed to import: ${(error as Error).message}`)
    }
  }

  // Handle delete element
  const handleDelete = useCallback(() => {
    if (!selectedElementId) return

    // Can't delete root element
    if (selectedElementId === 'root') {
      toast.error('Cannot delete root element')
      return
    }

    removeElement(selectedElementId)
    setSelectedElementId(null)
    toast.success('Element deleted')
  }, [selectedElementId, removeElement, setSelectedElementId])

  // TODO: Implement undo/redo with TanStack Query
  const handleUndo = useCallback(() => {
    // Placeholder for undo functionality
    toast.info('Undo functionality coming soon')
  }, [])

  const handleRedo = useCallback(() => {
    // Placeholder for redo functionality
    toast.info('Redo functionality coming soon')
  }, [])

  // Set up keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      {
        key: 'Delete',
        handler: handleDelete,
      },
      {
        key: 'Backspace',
        handler: handleDelete,
      },
      {
        key: 's',
        ctrlKey: true,
        metaKey: true,
        handler: (e: KeyboardEvent) => {
          e.preventDefault()
          handleSave()
        },
      },
      {
        key: 'z',
        ctrlKey: true,
        metaKey: true,
        handler: handleUndo,
      },
      {
        key: 'y',
        ctrlKey: true,
        metaKey: true,
        handler: handleRedo,
      },
      {
        key: 'z',
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
        handler: handleRedo,
      },
    ],
    [handleDelete, handleUndo, handleRedo, handleSave],
  )

  useKeyboardShortcuts(shortcuts)

  if (componentLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-2.5rem)] mt-10">
        <div className="text-center">Loading component...</div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-2.5rem)] mt-10">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Component not found</p>
          <p className="text-muted-foreground">The component you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-[calc(100dvh-3rem)] bg-background">
      <div className="flex flex-1 h-[calc(100dvh-2.5rem)] max-h-[calc(100dvh-2.5rem)] overflow-hidden">
        <aside className="w-64 flex flex-col h-full overflow-hidden">
          <EditorSidebar componentName={component.name} hasUnsavedChanges={hasUnsavedChanges} isSaving={isSaving} />
        </aside>
        <main className="bg-area-background flex-1 overflow-hidden pt-2 px-4 rounded-t-lg shadow-hairline border border-border border-b-0">
          <EditorPreviewPane
            spec={spec}
            libraryId={component?.libraryId}
            setImportDialogOpen={setImportDialogOpen}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            handleSave={handleSave}
            isSaving={isSaving}
            hasUnsavedChanges={hasUnsavedChanges}
            componentName={component.name}
          />
        </main>
        <aside className="w-72 h-[calc(100dvh-3rem)] max-h-[calc(100dvh-3rem)] flex flex-col">
          <div className="flex-1 flex flex-col gap-2 bg-background">
            {selectedElement ? (
              <Tabs defaultValue="style" className="flex-1 flex flex-col">
                <div className="px-1.5">
                  <TabsList className="!w-full">
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="component">Details</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="component">
                  <ComponentForm
                    key={`component-form-${formKey || 'none'}`}
                    onChange={handleComponentChange}
                    {...(componentFormInitialValues ? { initialValues: componentFormInitialValues } : {})}
                  />
                </TabsContent>
                <TabsContent
                  value="style"
                  className="flex-1 h-[calc(100dvh-5.5rem)] max-h-[calc(100dvh-5.5rem)] overflow-y-auto pb-6"
                  style={{ scrollbarWidth: 'thin', scrollbarGutter: 'stable' }}
                >
                  <BreakpointManager
                    element={selectedElement}
                    updateProperty={(property, value) => {
                      if (!selectedElementId) return
                      updateElement(selectedElementId, { [property]: value } as Partial<ElementTreeNode>)
                    }}
                  />
                  {/* <ScrollArea innerClassName="" className="flex-1 pb-12"> */}
                  <StyleForm
                    key={`style-form-${formKey || 'none'}`}
                    onChange={handleStyleChange}
                    {...(formInitialValues ? { initialValues: formInitialValues } : {})}
                  />
                  {/* </ScrollArea> */}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col h-full flex-1">
                <ScrollArea innerClassName="flex flex-col gap-2.5 py-2.5" className="flex-1">
                  <div className="px-2.5 pb-2.5">
                    <AccessibilityPanel
                      {...(component?.accessibility ? { accessibility: component.accessibility } : {})}
                      isChecking={isCheckingAccessibility}
                    />
                  </div>
                  <div className="flex flex-col h-full">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <IconFolderCode />
                        </EmptyMedia>
                        <EmptyTitle>No element selected</EmptyTitle>
                        <EmptyDescription>Select an element from the tree to edit its styles</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </aside>
      </div>
      <ImportCodeDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImport={handleImportCode} />
    </div>
  )
})

Editor.displayName = 'Editor'
