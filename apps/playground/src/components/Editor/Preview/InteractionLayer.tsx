import { Tooltip } from '@/components/style-manager/components/Tooltip'
import { IconPlus } from '@tabler/icons-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

import { getIframeBoundingRect, getIframeScrollOffsets, transformIframeToParent } from './utils/coordinateUtils'

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
  onElementClick: ((elementId: string) => void) | undefined
  selectedElementId: string | null | undefined
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

export const InteractionLayer = ({
  iframeRef,
  containerRef,
  spec,
  onElementClick,
  selectedElementId,
}: InteractionLayerProps) => {
  const layerRef = useRef<HTMLDivElement>(null)
  const [hitZones, setHitZones] = useState<HitZone[]>([])
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null)
  const [buttonInteractionElementId, setButtonInteractionElementId] = useState<string | null>(null)
  const buttonInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isReady, setIsReady] = useState(false)
  const rafIdRef = useRef<number | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)
  const observedElementsRef = useRef<Set<HTMLElement>>(new Set())

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
      const scrollOffsets = getIframeScrollOffsets(iframe)
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
          scrollOffsets.x,
          scrollOffsets.y,
          containerScrollX,
          containerScrollY,
          containerRect,
          iframe,
          containerRef.current || undefined,
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
      if (onElementClick) {
        onElementClick(elementId)
      }
    },
    [onElementClick],
  )

  // Handle keyboard navigation
  const handleHitZoneKeyDown = useCallback(
    (elementId: string, event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        if (onElementClick) {
          onElementClick(elementId)
        }
      }
    },
    [onElementClick],
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

  return (
    <div ref={layerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
      {hitZones.map((zone) => {
        const isSelected = zone.elementId === selectedElementId
        const isHovered = hoveredElementId === zone.elementId
        const showButton = isSelected && (isHovered || buttonInteractionElementId === zone.elementId)
        const elementName = getElementName(zone.elementId)

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
              backgroundColor: isSelected
                ? 'transparent'
                : isHovered
                  ? 'rgba(59, 130, 246, 0.4)'
                  : 'rgba(59, 130, 246, 0.1)',
              border:
                isSelected || isHovered
                  ? isSelected
                    ? '1px solid #3b82f6'
                    : '1px solid rgba(59, 130, 246, 0.6)'
                  : '1px solid transparent',
              boxSizing: 'border-box',
              zIndex: 1001,
              position: 'absolute',
            }}
            onClick={(e) => handleHitZoneClick(zone.elementId, e)}
            onKeyDown={(e) => handleHitZoneKeyDown(zone.elementId, e)}
            onMouseEnter={() => {
              setHoveredElementId(zone.elementId)
            }}
            onMouseLeave={() => {
              setHoveredElementId(null)
            }}
          >
            {showButton && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[1002] translate-y-full"
                style={{ marginTop: '4px' }}
                onMouseEnter={() => {
                  if (buttonInteractionTimeoutRef.current) {
                    clearTimeout(buttonInteractionTimeoutRef.current)
                    buttonInteractionTimeoutRef.current = null
                  }
                  setButtonInteractionElementId(zone.elementId)
                }}
                onMouseLeave={() => {
                  buttonInteractionTimeoutRef.current = setTimeout(() => {
                    setButtonInteractionElementId(null)
                  }, 200)
                }}
                onFocus={() => {
                  if (buttonInteractionTimeoutRef.current) {
                    clearTimeout(buttonInteractionTimeoutRef.current)
                    buttonInteractionTimeoutRef.current = null
                  }
                  setButtonInteractionElementId(zone.elementId)
                }}
                onBlur={() => {
                  buttonInteractionTimeoutRef.current = setTimeout(() => {
                    setButtonInteractionElementId(null)
                  }, 200)
                }}
              >
                <Tooltip content="Add element" side="bottom" sideOffset={8}>
                  <button
                    type="button"
                    className="bg-interactive-bg-primary rounded-full p-1 text-text-primary hover:bg-interactive-bg-primary-hover transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Add element below:', zone.elementId)
                    }}
                  >
                    <IconPlus className="size-4" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
