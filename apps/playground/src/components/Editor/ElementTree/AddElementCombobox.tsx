'use client'

import { Button } from '@/components/primitives/Button/button'
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CommandPanel } from '@/components/primitives/CommandPanel/command-panel'
import { Popover } from '@/components/primitives/Popover/popover'
import { getElementTypeGroups } from '@/utils/elementTypes'
import { IconPlus } from '@tabler/icons-react'
import * as React from 'react'

import { CoralElementType } from '@reallygoodwork/coral-core'

interface AddElementComboboxProps {
  validChildTypes: CoralElementType[]
  onSelect: (elementType: CoralElementType) => void
  onOpenChange?: (open: boolean) => void
}

export function AddElementCombobox({ validChildTypes, onSelect, onOpenChange }: AddElementComboboxProps) {
  const [search, setSearch] = React.useState('')
  const scrollPositionsRef = React.useRef<Map<Element, { x: number; y: number }>>(new Map())
  const isRestoringRef = React.useRef(false)
  const openScrollPreventionRef = React.useRef<(() => void) | null>(null)

  const groups = getElementTypeGroups((elementType) => validChildTypes.includes(elementType.type))


  const handleSelect = (elementType: string) => {
    // Find all scrollable containers and store their scroll positions BEFORE any changes
    const findAllScrollableContainers = () => {
      const containers: HTMLElement[] = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
      let node: Node | null = walker.nextNode()

      while (node) {
        const element = node as HTMLElement
        const style = window.getComputedStyle(element)
        if (
          (style.overflow === 'auto' || style.overflowY === 'auto' || style.overflow === 'scroll' || style.overflowY === 'scroll') &&
          (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
        ) {
          containers.push(element)
        }
        node = walker.nextNode()
      }
      return containers
    }

    const scrollableContainers = findAllScrollableContainers()

    // Store scroll positions for all containers
    scrollableContainers.forEach((container) => {
      scrollPositionsRef.current.set(container, {
        x: container.scrollLeft,
        y: container.scrollTop,
      })
    })

    // Also store window scroll position
    scrollPositionsRef.current.set(window as unknown as Element, {
      x: window.scrollX,
      y: window.scrollY,
    })

    isRestoringRef.current = true

    // Close popover first
    onOpenChange?.(false)
    setSearch('')

    // Restore function for all containers
    const restoreScroll = () => {
      if (!isRestoringRef.current) return

      scrollPositionsRef.current.forEach((position, container) => {
        try {
          if (container === (window as unknown as Element)) {
            window.scrollTo({
              left: position.x,
              top: position.y,
              behavior: 'instant',
            })
          } else {
            const element = container as HTMLElement
            if (element && element.isConnected) {
              element.scrollTo({
                left: position.x,
                top: position.y,
                behavior: 'instant',
              })
            }
          }
        } catch (e) {
          // Ignore errors from disconnected elements
        }
      })
    }

    // Then trigger the element addition (which will cause DOM updates)
    onSelect(elementType as CoralElementType)

    // Restore scroll position aggressively after React updates
    // Use multiple strategies to catch all scroll events
    const restoreInterval = setInterval(() => {
      if (isRestoringRef.current) {
        restoreScroll()
      } else {
        clearInterval(restoreInterval)
      }
    }, 16) // ~60fps

    // Also restore on multiple frames
    setTimeout(() => {
      restoreScroll()
      requestAnimationFrame(() => {
        restoreScroll()
        requestAnimationFrame(() => {
          restoreScroll()
          setTimeout(() => {
            restoreScroll()
            setTimeout(() => {
              restoreScroll()
              setTimeout(() => {
                clearInterval(restoreInterval)
                isRestoringRef.current = false
                scrollPositionsRef.current.clear()
              }, 300)
            }, 100)
          }, 50)
        })
      })
    }, 0)
  }

  // Monitor and prevent scroll for all containers
  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      if (!isRestoringRef.current) return

      const target = e.target as Element | null
      if (!target) return

      // Find the scrollable container that triggered this event
      let scrollableElement: Element | null = target as Element

      // Walk up the tree to find the scrollable container
      while (scrollableElement && scrollableElement !== document.body) {
        const style = window.getComputedStyle(scrollableElement as HTMLElement)
        if (style.overflow === 'auto' || style.overflowY === 'auto' || style.overflow === 'scroll' || style.overflowY === 'scroll') {
          const position = scrollPositionsRef.current.get(scrollableElement)
          if (position) {
            e.preventDefault()
            e.stopPropagation()
            ;(scrollableElement as HTMLElement).scrollTo({
              left: position.x,
              top: position.y,
              behavior: 'instant',
            })
            return
          }
        }
        scrollableElement = scrollableElement.parentElement
      }

      // Check window scroll
      const windowPosition = scrollPositionsRef.current.get(window as unknown as Element)
      if (windowPosition) {
        e.preventDefault()
        e.stopPropagation()
        window.scrollTo({
          left: windowPosition.x,
          top: windowPosition.y,
          behavior: 'instant',
        })
      }
    }

    // Override scrollIntoView to prevent scrolling during restoration
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
    HTMLElement.prototype.scrollIntoView = function (this: HTMLElement, ...args: Parameters<typeof HTMLElement.prototype.scrollIntoView>) {
      if (isRestoringRef.current) {
        // Don't scroll during restoration
        return
      }
      return originalScrollIntoView.apply(this, args)
    }

    // Listen to scroll events with capture to catch them early
    window.addEventListener('scroll', handleScroll, { passive: false, capture: true })
    document.addEventListener('scroll', handleScroll, { passive: false, capture: true })

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true })
      document.removeEventListener('scroll', handleScroll, { capture: true })
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView
    }
  }, [])

  // Filter groups based on search
  const filteredGroups = React.useMemo(() => {
    if (!search) return groups

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.type.toLowerCase().includes(search.toLowerCase()) ||
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.group.toLowerCase().includes(search.toLowerCase()),
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [groups, search])

  const handlePopoverOpenChange = React.useCallback((open: boolean) => {
    if (open) {
      // Store scroll position when popover opens (before CommandPanel focuses)
      const findAllScrollableContainers = () => {
        const containers: HTMLElement[] = []
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
        let node: Node | null = walker.nextNode()

        while (node) {
          const element = node as HTMLElement
          const style = window.getComputedStyle(element)
          if (
            (style.overflow === 'auto' || style.overflowY === 'auto' || style.overflow === 'scroll' || style.overflowY === 'scroll') &&
            (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
          ) {
            containers.push(element)
          }
          node = walker.nextNode()
        }
        return containers
      }

      const scrollableContainers = findAllScrollableContainers()
      scrollPositionsRef.current.clear()

      scrollableContainers.forEach((container) => {
        scrollPositionsRef.current.set(container, {
          x: container.scrollLeft,
          y: container.scrollTop,
        })
      })
      scrollPositionsRef.current.set(window as unknown as Element, {
        x: window.scrollX,
        y: window.scrollY,
      })
      isRestoringRef.current = true

      // Prevent scroll when popover opens
      const restoreScroll = () => {
        if (!isRestoringRef.current) return
        scrollPositionsRef.current.forEach((position, container) => {
          try {
            if (container === (window as unknown as Element)) {
              window.scrollTo({
                left: position.x,
                top: position.y,
                behavior: 'instant',
              })
            } else {
              const element = container as HTMLElement
              if (element && element.isConnected) {
                element.scrollTo({
                  left: position.x,
                  top: position.y,
                  behavior: 'instant',
                })
              }
            }
          } catch (e) {
            // Ignore errors
          }
        })
      }

      // Prevent scrollIntoView
      const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
      HTMLElement.prototype.scrollIntoView = function () {
        restoreScroll()
        return
      }

      // Prevent scroll events
      const handleScroll = () => {
        restoreScroll()
      }

      window.addEventListener('scroll', handleScroll, { passive: false, capture: true })
      document.addEventListener('scroll', handleScroll, { passive: false, capture: true })

      // Restore aggressively
      const restoreInterval = setInterval(restoreScroll, 16)

      // Clean up after 500ms
      const cleanup = () => {
        clearInterval(restoreInterval)
        HTMLElement.prototype.scrollIntoView = originalScrollIntoView
        window.removeEventListener('scroll', handleScroll, { capture: true })
        document.removeEventListener('scroll', handleScroll, { capture: true })
        isRestoringRef.current = false
        scrollPositionsRef.current.clear()
      }

      openScrollPreventionRef.current = cleanup
      setTimeout(cleanup, 500)
    } else {
      if (openScrollPreventionRef.current) {
        openScrollPreventionRef.current()
        openScrollPreventionRef.current = null
      }
    }
  }, [])

  return (
    <Popover
      onOpenChange={handlePopoverOpenChange}
      trigger={
        <Button variant="elementPreview" size="icon-sm" title="Add Child Element">
          <IconPlus />
        </Button>
      }
    >
      <CommandPanel
        items={filteredGroups.flatMap((group) =>
          group.items.map((item) => ({ label: item.label, icon: item.icon, shortcut: item.type })),
        )}
        suggestions={[]}
        onSuggestionSelect={handleSelect}
      />
      {/* <PopoverContent
        className="w-[280px] p-0 z-20000"
        align="end"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onInteractOutside={(e) => {
          // Prevent closing when clicking on hit zones or interaction layer
          const target = e.target as HTMLElement
          if (target.closest('[data-debug-zone]') || target.closest('[data-element-id]')) {
            e.preventDefault()
          }
        }}
      > */}
      {/* <Command shouldFilter={false}>
        <CommandInput placeholder="Search elements..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>No elements found.</CommandEmpty>
          {filteredGroups.map((group) => (
            <CommandGroup key={group.name} heading={group.name}>
              {group.items.map((elementType) => (
                <CommandItem
                  key={elementType.type}
                  value={elementType.type}
                  onSelect={() => handleSelect(elementType.type)}
                  className="flex items-center gap-2"
                >
                  {elementType.icon}
                  <span className="text-xs flex-1">{elementType.label}</span>
                  <span className="text-xxs text-muted-foreground font-mono tabular-nums uppercase tracking-widest">
                    {elementType.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command> */}
      {/* </PopoverContent> */}
    </Popover>
  )
}
