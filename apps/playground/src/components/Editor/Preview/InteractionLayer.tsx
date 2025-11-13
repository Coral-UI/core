import { useElementTreeQuery } from '@/hooks/useElementTreeQuery'
import { useElementSelectionStore } from '@/stores/useElementSelectionStore'
import { getValidChildTypes } from '@/utils/elementHierarchy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { CoralRootNode } from '@reallygoodwork/coral-core'
import { CoralElementType } from '@reallygoodwork/coral-core'

import { AddElementCombobox } from '../ElementTree/AddElementCombobox'
import { getIframeBoundingRect, transformIframeToParent } from './utils/coordinateUtils'

interface HitZone {
  elementId: string
  x: number
  y: number
  width: number
  height: number
  isVisible: boolean
}

interface InteractionLayerProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  containerRef: React.RefObject<HTMLDivElement>
  spec: CoralRootNode
}

/**
 * Recursively collect all element IDs from a Coral spec
 */
function collectElementIds(node: CoralRootNode, ids: string[] = []): string[] {
  const nodeWithId = node as CoralRootNode & { id?: string }
  if (nodeWithId.id) {
    ids.push(nodeWithId.id)
  }

  if (node.children) {
    for (const child of node.children as CoralRootNode[]) {
      collectElementIds(child, ids)
    }
  }

  return ids
}

/**
 * Debounce function to limit how often we recalculate
 */
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export const InteractionLayer = ({ iframeRef, containerRef, spec }: InteractionLayerProps) => {
  const selectedElementId = useElementSelectionStore((state) => state.selectedElementId)
  const setSelectedElementId = useElementSelectionStore((state) => state.setSelectedElementId)
  const layerRef = useRef<HTMLDivElement>(null)
  const [hitZones, setHitZones] = useState<HitZone[]>([])
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null)
  const [hoverZone, setHoverZone] = useState<'top' | 'center' | 'bottom' | null>(null)
  const [buttonInteractionElementId, setButtonInteractionElementId] = useState<string | null>(null)
  const [popoverOpenElementId, setPopoverOpenElementId] = useState<string | null>(null)
  const buttonInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isReady, setIsReady] = useState(false)
  const rafIdRef = useRef<number | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)
  const observedElementsRef = useRef<Set<HTMLElement>>(new Set())
  const { addElement, moveElement, elements } = useElementTreeQuery()

  // Collect all element IDs from spec
  const elementIds = useMemo(() => {
    if (!spec || !spec.name) {
      return []
    }
    return collectElementIds(spec)
  }, [spec])

  // Calculate hit zone positions
  const calculateHitZones = useCallback(() => {
    if (!iframeRef.current || !containerRef.current || !layerRef.current || !isReady) {
      return
    }

    try {
      const iframe = iframeRef.current
      const contentDocument = iframe.contentDocument
      if (!contentDocument) {
        return
      }

      const iframeRect = getIframeBoundingRect(iframe)
      const containerScrollX = containerRef.current?.scrollLeft || 0
      const containerScrollY = containerRef.current?.scrollTop || 0
      const containerRect = containerRef.current?.getBoundingClientRect()
      const newHitZones: HitZone[] = []

      // Batch DOM reads
      const elementRects = elementIds.map((elementId) => {
        const element = contentDocument.querySelector(`[data-element-id="${elementId}"]`)
        if (!element) {
          return null
        }

        const htmlElement = element as HTMLElement
        const rect = element.getBoundingClientRect()

        // Use offsetWidth/offsetHeight which include padding and border
        const elementWidth = htmlElement.offsetWidth || rect.width
        const elementHeight = htmlElement.offsetHeight || rect.height
        const finalWidth = Math.max(elementWidth, rect.width)
        const finalHeight = Math.max(elementHeight, rect.height)

        // Create a modified rect with the correct dimensions
        const modifiedRect = new DOMRect(rect.left, rect.top, finalWidth, finalHeight)

        const transformed = transformIframeToParent(
          iframeRect,
          modifiedRect,
          containerScrollX,
          containerScrollY,
          containerRect,
          iframe,
        )

        return {
          elementId,
          ...transformed,
        }
      })

      // Create hit zones for all found elements
      elementRects.forEach((rect) => {
        if (!rect) {
          return
        }

        const hitZone: HitZone = {
          elementId: rect.elementId,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          isVisible: true,
        }

        newHitZones.push(hitZone)
      })

      // Batch DOM writes
      setHitZones(newHitZones)
    } catch (error) {
      console.warn('Could not calculate hit zones:', error)
    }
  }, [iframeRef, elementIds, isReady, containerRef])

  // Debounced version of calculateHitZones
  const debouncedCalculateHitZones = useMemo(() => debounce(() => calculateHitZones(), 100), [calculateHitZones])

  // Schedule position update with requestAnimationFrame
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) {
      return
    }

    rafIdRef.current = requestAnimationFrame(() => {
      calculateHitZones()
      rafIdRef.current = null
    })
  }, [calculateHitZones])

  // Set up observers when iframe is ready
  useEffect(() => {
    if (!iframeRef.current || !isReady) {
      return
    }

    const iframe = iframeRef.current
    const contentDocument = iframe.contentDocument
    const contentWindow = contentDocument?.defaultView

    if (!contentDocument || !contentWindow) {
      return
    }

    // Wait for body to be available
    const setupObservers = () => {
      const body = contentDocument.body
      if (!body) {
        return false
      }

      // Clean up existing observers
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect()
      }
      observedElementsRef.current.clear()

      // Create ResizeObserver for all elements
      resizeObserverRef.current = new ResizeObserver(() => {
        scheduleUpdate()
      })

      // Observe iframe itself
      resizeObserverRef.current.observe(iframe)

      // Observe all elements with data-element-id
      const elementsWithIds = contentDocument.querySelectorAll<HTMLElement>('[data-element-id]')
      elementsWithIds.forEach((element) => {
        resizeObserverRef.current?.observe(element)
        observedElementsRef.current.add(element)
      })

      // MutationObserver to detect new elements or style changes
      mutationObserverRef.current = new MutationObserver((mutations) => {
        let shouldRecalculate = false

        for (const mutation of mutations) {
          // Check for new elements
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes).filter(
              (node): node is HTMLElement => node instanceof HTMLElement,
            )
            for (const node of addedNodes) {
              // Check if it has data-element-id or contains elements with it
              if (node.hasAttribute('data-element-id')) {
                resizeObserverRef.current?.observe(node)
                observedElementsRef.current.add(node)
                shouldRecalculate = true
              }
              const childrenWithIds = node.querySelectorAll<HTMLElement>('[data-element-id]')
              childrenWithIds.forEach((child) => {
                resizeObserverRef.current?.observe(child)
                observedElementsRef.current.add(child)
                shouldRecalculate = true
              })
            }
          }

          // Check for style/class changes
          if (mutation.type === 'attributes') {
            if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
              shouldRecalculate = true
            }
          }
        }

        if (shouldRecalculate) {
          // Use debounced update for style changes, immediate for DOM changes
          if (mutations.some((m) => m.type === 'attributes')) {
            debouncedCalculateHitZones()
          } else {
            scheduleUpdate()
          }
        }
      })

      mutationObserverRef.current.observe(body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })

      // Initial calculation
      scheduleUpdate()

      return true
    }

    // Set up scroll listeners
    const handleIframeScroll = () => scheduleUpdate()
    contentWindow.addEventListener('scroll', handleIframeScroll, { passive: true })

    const handleContainerScroll = () => scheduleUpdate()
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleContainerScroll, { passive: true })
    }

    // Try to set up observers immediately
    let cleanupDOMReady: (() => void) | undefined
    if (!setupObservers()) {
      const handleDOMReady = () => {
        setupObservers()
      }

      if (contentDocument.readyState === 'loading') {
        contentDocument.addEventListener('DOMContentLoaded', handleDOMReady, { once: true })
        cleanupDOMReady = () => {
          contentDocument.removeEventListener('DOMContentLoaded', handleDOMReady)
        }
      } else {
        const timeoutId = setTimeout(handleDOMReady, 100)
        cleanupDOMReady = () => {
          clearTimeout(timeoutId)
        }
      }
    }

    return () => {
      resizeObserverRef.current?.disconnect()
      mutationObserverRef.current?.disconnect()
      contentWindow.removeEventListener('scroll', handleIframeScroll)
      if (container) {
        container.removeEventListener('scroll', handleContainerScroll)
      }
      if (cleanupDOMReady) {
        cleanupDOMReady()
      }
    }
  }, [isReady, elementIds, scheduleUpdate, debouncedCalculateHitZones, iframeRef, containerRef])

  // Recalculate when spec changes (iframe content regenerates)
  useEffect(() => {
    if (!isReady || !iframeRef.current) {
      return
    }

    const iframe = iframeRef.current

    const handleIframeReload = () => {
      // Wait for content to be ready, then recalculate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scheduleUpdate()
          }, 150)
        })
      })
    }

    iframe.addEventListener('load', handleIframeReload)
    handleIframeReload()

    return () => {
      iframe.removeEventListener('load', handleIframeReload)
    }
  }, [spec, isReady, scheduleUpdate])

  // Mark as ready when iframe loads
  useEffect(() => {
    if (!iframeRef.current) {
      return
    }

    const iframe = iframeRef.current
    const handleLoad = () => {
      setIsReady(true)
    }

    if (iframe.contentDocument?.readyState === 'complete') {
      setIsReady(true)
    } else {
      iframe.addEventListener('load', handleLoad)
      return () => {
        iframe.removeEventListener('load', handleLoad)
      }
    }
  }, [])

  // Handle hit zone clicks
  const handleHitZoneClick = useCallback(
    (elementId: string, event: React.MouseEvent) => {
      event.stopPropagation()
      setSelectedElementId(elementId)
    },
    [setSelectedElementId],
  )

  // Handle keyboard navigation
  const handleHitZoneKeyDown = useCallback(
    (elementId: string, event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        setSelectedElementId(elementId)
      }
    },
    [setSelectedElementId],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (buttonInteractionTimeoutRef.current) {
        clearTimeout(buttonInteractionTimeoutRef.current)
      }
    }
  }, [])

  // Get element name for accessibility
  const getElementName = useCallback(
    (elementId: string): string => {
      const findNode = (node: CoralRootNode): CoralRootNode | null => {
        const nodeWithId = node as CoralRootNode & { id?: string }
        if (nodeWithId.id === elementId) {
          return node
        }

        if (node.children) {
          for (const child of node.children as CoralRootNode[]) {
            const found = findNode(child)
            if (found) {
              return found
            }
          }
        }

        return null
      }

      const node = findNode(spec)
      return node?.name || 'element'
    },
    [spec],
  )

  // Check if element is root
  const isRootElement = useCallback((elementId: string): boolean => {
    return elementId === 'root'
  }, [])

  // Get element's parent ID
  const getElementParentId = useCallback(
    (elementId: string): string | undefined => {
      // Root element has no parent
      if (elementId === 'root') return undefined

      const element = elements.find((el) => el.id === elementId)
      // If element doesn't have a parentId, it's a root-level element, so parent is 'root'
      return element?.parentId || 'root'
    },
    [elements],
  )

  // Get element type
  const getElementType = useCallback(
    (elementId: string): CoralElementType => {
      const element = elements.find((el) => el.id === elementId)
      return element?.elementType || 'div'
    },
    [elements],
  )

  // Get sibling index
  const getSiblingIndex = useCallback(
    (elementId: string): number => {
      const element = elements.find((el) => el.id === elementId)
      if (!element) return -1

      const parentId = element.parentId || 'root'
      const siblings = elements
        .filter((el) => {
          const elParentId = el.parentId || 'root'
          return elParentId === parentId
        })
        .sort((a, b) => {
          if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
            return a.orderIndex - b.orderIndex
          }
          return 0
        })

      return siblings.findIndex((el) => el.id === elementId)
    },
    [elements],
  )

  // Handle adding element before
  const handleAddBefore = useCallback(
    async (targetElementId: string, elementType: CoralElementType) => {
      // Can't add before root
      if (targetElementId === 'root') return

      const parentId = getElementParentId(targetElementId)
      if (!parentId) return

      const siblingIndex = getSiblingIndex(targetElementId)
      if (siblingIndex === -1) return

      const newElementId = await addElement(elementType, parentId)

      if (newElementId) {
        moveElement(newElementId, parentId, siblingIndex)
        // Automatically select the newly added element
        setSelectedElementId(newElementId)
      }
    },
    [addElement, moveElement, getElementParentId, getSiblingIndex, setSelectedElementId],
  )

  // Handle adding element after
  const handleAddAfter = useCallback(
    async (targetElementId: string, elementType: CoralElementType) => {
      // Can't add after root
      if (targetElementId === 'root') return

      const parentId = getElementParentId(targetElementId)
      if (!parentId) return

      const siblingIndex = getSiblingIndex(targetElementId)
      if (siblingIndex === -1) return

      const newElementId = await addElement(elementType, parentId)

      if (newElementId) {
        moveElement(newElementId, parentId, siblingIndex + 1)
        // Automatically select the newly added element
        setSelectedElementId(newElementId)
      }
    },
    [addElement, moveElement, getElementParentId, getSiblingIndex, setSelectedElementId],
  )

  // Handle adding element inside
  const handleAddInside = useCallback(
    async (targetElementId: string, elementType: CoralElementType) => {
      const newElementId = await addElement(elementType, targetElementId)
      // Automatically select the newly added element
      if (newElementId) {
        setSelectedElementId(newElementId)
      }
    },
    [addElement, setSelectedElementId],
  )

  // Add click listener to container to catch clicks outside hit zones
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const container = containerRef.current
    const handleContainerClick = (event: MouseEvent) => {
      // Check if click is on a hit zone DOM element - if so, let it handle the click
      const target = event.target as HTMLElement
      if (target.closest('[data-debug-zone]')) {
        return
      }

      // Ignore clicks on popovers (like AddElementCombobox)
      if (target.closest('[data-slot="popover-content"]') || target.closest('[data-slot="popover"]')) {
        return
      }

      // Check if clicking on an interactive element inside the iframe
      if (!iframeRef.current) {
        setSelectedElementId(null)
        return
      }

      const iframe = iframeRef.current
      const contentDocument = iframe.contentDocument
      if (!contentDocument) {
        setSelectedElementId(null)
        return
      }

      const iframeRect = getIframeBoundingRect(iframe)

      // Validate that we have valid coordinates
      if (
        !isFinite(event.clientX) ||
        !isFinite(event.clientY) ||
        !isFinite(iframeRect.x) ||
        !isFinite(iframeRect.y) ||
        !isFinite(iframeRect.width) ||
        !isFinite(iframeRect.height)
      ) {
        return
      }

      // Calculate click position relative to the layer (where hit zones are positioned)
      // The layer is positioned absolutely with inset-0 relative to its parent container
      if (!layerRef.current) {
        return
      }

      const layerRect = layerRef.current.getBoundingClientRect()
      const containerScrollX = containerRef.current?.scrollLeft || 0
      const containerScrollY = containerRef.current?.scrollTop || 0

      // Calculate click position relative to layer (accounting for scroll)
      const clickXRelativeToLayer = event.clientX - layerRect.left + containerScrollX
      const clickYRelativeToLayer = event.clientY - layerRect.top + containerScrollY

      // Check if click intersects with any hit zone
      const clickHitsHitZone = hitZones.some((zone) => {
        return (
          clickXRelativeToLayer >= zone.x &&
          clickXRelativeToLayer <= zone.x + zone.width &&
          clickYRelativeToLayer >= zone.y &&
          clickYRelativeToLayer <= zone.y + zone.height
        )
      })

      // If click hits a hit zone, let it handle the click (it should have already)
      if (clickHitsHitZone) {
        return
      }

      // Calculate click position relative to iframe viewport for elementFromPoint
      const clickX = event.clientX - iframeRect.x
      const clickY = event.clientY - iframeRect.y

      // Validate calculated coordinates are finite
      if (!isFinite(clickX) || !isFinite(clickY)) {
        return
      }

      // Check if click is within iframe bounds
      if (clickX < 0 || clickY < 0 || clickX > iframeRect.width || clickY > iframeRect.height) {
        // Click is outside iframe, deselect
        setSelectedElementId(null)
        return
      }

      // Find the element at the click position in the iframe
      const elementAtPoint = contentDocument.elementFromPoint(clickX, clickY)

      if (elementAtPoint) {
        // Check if the clicked element or any of its parents is an interactive element
        const interactiveSelectors = [
          'input',
          'button',
          'select',
          'textarea',
          'a',
          '[role="button"]',
          '[role="link"]',
          '[role="menuitem"]',
          '[contenteditable="true"]',
        ]

        const isInteractive = interactiveSelectors.some((selector) => {
          return elementAtPoint.matches(selector) || elementAtPoint.closest(selector) !== null
        })

        // Don't deselect if clicking on an interactive element
        if (isInteractive) {
          return
        }

        // Check if clicking on an element with data-element-id
        // If so, check if it's actually a hit zone (might have been missed)
        const clickedElementId = elementAtPoint.getAttribute('data-element-id')
        if (clickedElementId) {
          // Check if this element has a hit zone that should have caught this click
          const hasHitZone = hitZones.some((zone) => zone.elementId === clickedElementId)
          if (hasHitZone) {
            // This should have been caught by the hit zone, but wasn't - select it anyway
            setSelectedElementId(clickedElementId)
            return
          }
        }

        // Check if we're clicking on empty space (body or container div)
        // If clicking on body or the coral-container, and it's not an interactive element,
        // we should deselect
        const isBodyOrContainer =
          elementAtPoint.tagName === 'BODY' ||
          elementAtPoint.classList.contains('coral-container') ||
          (elementAtPoint.tagName === 'DIV' && !elementAtPoint.hasAttribute('data-element-id'))

        if (isBodyOrContainer && !isInteractive) {
          setSelectedElementId(null)
          return
        }
      } else {
        // No element at point - definitely empty space, deselect
        setSelectedElementId(null)
        return
      }

      // If we get here and there's an element but it's not interactive and doesn't have data-element-id,
      // it's likely empty space within a container, so deselect
      setSelectedElementId(null)
    }

    container.addEventListener('click', handleContainerClick, true)
    return () => {
      container.removeEventListener('click', handleContainerClick, true)
    }
  }, [containerRef, iframeRef, hitZones, setSelectedElementId])

  return (
    <div ref={layerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
      {hitZones.map((zone) => {
        const isSelected = zone.elementId === selectedElementId
        const isHovered = hoveredElementId === zone.elementId
        const isRoot = isRootElement(zone.elementId)
        const currentHoverZone = isSelected && isHovered ? hoverZone : null
        const isPopoverOpen = popoverOpenElementId === zone.elementId
        const showButtons = isSelected && (isHovered || buttonInteractionElementId === zone.elementId || isPopoverOpen)
        const elementName = getElementName(zone.elementId)
        const elementType = getElementType(zone.elementId)
        const validChildTypes = getValidChildTypes(elementType)

        // Determine which buttons to show - only for selected elements
        // Keep buttons visible if popover is open
        const showTopButton =
          isSelected &&
          !isRoot &&
          (showButtons || isPopoverOpen) &&
          (currentHoverZone === 'top' || buttonInteractionElementId === zone.elementId || isPopoverOpen)
        const showCenterButton =
          isSelected &&
          (showButtons || isPopoverOpen) &&
          (currentHoverZone === 'center' || (isRoot && buttonInteractionElementId === zone.elementId) || isPopoverOpen)
        const showBottomButton =
          isSelected &&
          !isRoot &&
          (showButtons || isPopoverOpen) &&
          (currentHoverZone === 'bottom' || buttonInteractionElementId === zone.elementId || isPopoverOpen)

        return (
          <div
            key={zone.elementId}
            role="button"
            tabIndex={0}
            aria-label={`Select ${elementName} element`}
            aria-pressed={isSelected}
            className="absolute cursor-pointer transition-all"
            data-debug-zone={zone.elementId}
            style={{
              left: `${zone.x}px`,
              top: `${zone.y}px`,
              width: `${Math.max(0, zone.width)}px`,
              height: `${Math.max(0, zone.height)}px`,
              pointerEvents: 'auto',
              backgroundColor: isSelected ? 'transparent' : isHovered ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
              border:
                isSelected || isHovered
                  ? isSelected
                    ? '1px solid #3b82f6'
                    : '1px dashed #3b82f6'
                  : '1px solid transparent',
              boxSizing: 'border-box',
              zIndex: 1001,
              position: 'absolute',
            }}
            onClick={(e) => handleHitZoneClick(zone.elementId, e)}
            onKeyDown={(e) => handleHitZoneKeyDown(zone.elementId, e)}
            onMouseMove={(e) => {
              if (!isHovered) {
                setHoveredElementId(zone.elementId)
              }
              // Only track hover zone for selected elements
              if (isSelected) {
                // Determine hover zone based on mouse position relative to element
                const rect = e.currentTarget.getBoundingClientRect()
                const relativeY = e.clientY - rect.top
                const height = rect.height
                const topThird = height / 3
                const bottomThird = (height * 2) / 3

                if (relativeY < topThird) {
                  setHoverZone('top')
                } else if (relativeY > bottomThird) {
                  setHoverZone('bottom')
                } else {
                  setHoverZone('center')
                }
              }
            }}
            onMouseEnter={() => {
              setHoveredElementId(zone.elementId)
            }}
            onMouseLeave={() => {
              setHoveredElementId(null)
              setHoverZone(null)
            }}
          >
            {/* Top button (before) - only for non-root elements */}
            {showTopButton && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-[1002] -translate-y-full"
                style={{ marginBottom: '4px' }}
                onMouseEnter={() => {
                  if (buttonInteractionTimeoutRef.current) {
                    clearTimeout(buttonInteractionTimeoutRef.current)
                    buttonInteractionTimeoutRef.current = null
                  }
                  setButtonInteractionElementId(zone.elementId)
                  setHoverZone('top')
                }}
                onMouseLeave={() => {
                  // Don't hide if popover is open
                  if (popoverOpenElementId !== zone.elementId) {
                    buttonInteractionTimeoutRef.current = setTimeout(() => {
                      setButtonInteractionElementId(null)
                    }, 200)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <AddElementCombobox
                  validChildTypes={validChildTypes}
                  onSelect={(elementType) => {
                    handleAddBefore(zone.elementId, elementType)
                  }}
                  onOpenChange={(open) => {
                    setPopoverOpenElementId(open ? zone.elementId : null)
                  }}
                />
              </div>
            )}

            {/* Center button (inside) - for all elements */}
            {showCenterButton && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1002]"
                onMouseEnter={() => {
                  if (buttonInteractionTimeoutRef.current) {
                    clearTimeout(buttonInteractionTimeoutRef.current)
                    buttonInteractionTimeoutRef.current = null
                  }
                  setButtonInteractionElementId(zone.elementId)
                  setHoverZone('center')
                }}
                onMouseLeave={() => {
                  // Don't hide if popover is open
                  if (popoverOpenElementId !== zone.elementId) {
                    buttonInteractionTimeoutRef.current = setTimeout(() => {
                      setButtonInteractionElementId(null)
                    }, 200)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <AddElementCombobox
                  validChildTypes={validChildTypes}
                  onSelect={(elementType) => {
                    handleAddInside(zone.elementId, elementType)
                  }}
                  onOpenChange={(open) => {
                    setPopoverOpenElementId(open ? zone.elementId : null)
                  }}
                />
              </div>
            )}

            {/* Bottom button (after) - only for non-root elements */}
            {showBottomButton && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[1002] translate-y-full"
                style={{ marginTop: '4px' }}
                onMouseEnter={() => {
                  if (buttonInteractionTimeoutRef.current) {
                    clearTimeout(buttonInteractionTimeoutRef.current)
                    buttonInteractionTimeoutRef.current = null
                  }
                  setButtonInteractionElementId(zone.elementId)
                  setHoverZone('bottom')
                }}
                onMouseLeave={() => {
                  // Don't hide if popover is open
                  if (popoverOpenElementId !== zone.elementId) {
                    buttonInteractionTimeoutRef.current = setTimeout(() => {
                      setButtonInteractionElementId(null)
                    }, 200)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <AddElementCombobox
                  validChildTypes={validChildTypes}
                  onSelect={(elementType) => {
                    handleAddAfter(zone.elementId, elementType)
                  }}
                  onOpenChange={(open) => {
                    setPopoverOpenElementId(open ? zone.elementId : null)
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
