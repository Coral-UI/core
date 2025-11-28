'use client'

import { IconSearch } from '@tabler/icons-react'
import { Command as CommandPrimitive } from 'cmdk'
import * as React from 'react'

import './command-panel.css'

type Item = {
  label: string
  icon?: React.ReactNode
  shortcut: string
}

export const CommandPanel = ({
  items = [],
  suggestions,
  onSuggestionSelect,
}: {
  items: Item[]
  suggestions?: Item[]
  onSuggestionSelect: (suggestion: string) => void
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [shouldFocus, setShouldFocus] = React.useState(false)

  // Store scroll position before component mounts (when popover opens)
  React.useEffect(() => {
    // Store scroll positions for all scrollable containers BEFORE any focus happens
    const scrollPositions = new Map<Element, { x: number; y: number }>()

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
    scrollableContainers.forEach((container) => {
      scrollPositions.set(container, {
        x: container.scrollLeft,
        y: container.scrollTop,
      })
    })
    scrollPositions.set(window as unknown as Element, {
      x: window.scrollX,
      y: window.scrollY,
    })

    // Prevent any scroll from happening
    const restoreScroll = () => {
      scrollPositions.forEach((position, container) => {
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

    // Prevent scrollIntoView globally
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
    HTMLElement.prototype.scrollIntoView = function () {
      // Prevent all scrollIntoView calls
      return
    }

    // Prevent focus from causing scroll
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target === inputRef.current) {
        // Prevent scroll when input focuses
        restoreScroll()
      }
    }

    // Monitor scroll events
    const handleScroll = () => {
      restoreScroll()
    }

    document.addEventListener('focus', handleFocus, { capture: true })
    window.addEventListener('scroll', handleScroll, { passive: false, capture: true })
    document.addEventListener('scroll', handleScroll, { passive: false, capture: true })

    // Restore scroll aggressively
    const restoreInterval = setInterval(restoreScroll, 16) // ~60fps

    // Allow focus after a delay, but still prevent scroll
    setTimeout(() => {
      setShouldFocus(true)
      const input = inputRef.current
      if (input) {
        input.focus({ preventScroll: true })
        restoreScroll()
      }
    }, 100)

    // Clean up after 500ms
    setTimeout(() => {
      clearInterval(restoreInterval)
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView
      document.removeEventListener('focus', handleFocus, { capture: true })
      window.removeEventListener('scroll', handleScroll, { capture: true })
      document.removeEventListener('scroll', handleScroll, { capture: true })
    }, 500)

    return () => {
      clearInterval(restoreInterval)
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView
      document.removeEventListener('focus', handleFocus, { capture: true })
      window.removeEventListener('scroll', handleScroll, { capture: true })
      document.removeEventListener('scroll', handleScroll, { capture: true })
    }
  }, [])

  return (
    <CommandPrimitive className="command-panel" label="Command Panel">
      <div className="command-input-wrapper">
        <IconSearch className="command-input-icon" />
        <CommandPrimitive.Input ref={inputRef} className="command-input" />
      </div>
      <CommandPrimitive.List className="command-list">
        <CommandPrimitive.Empty className="command-empty">No results found.</CommandPrimitive.Empty>
        {suggestions && (
          <>
            <CommandPrimitive.Group className="command-group" heading="Suggestions">
              {suggestions.map((suggestion) => (
                <CommandPrimitive.Item
                  key={suggestion.label}
                  className="command-item"
                  onSelect={() => onSuggestionSelect(suggestion.shortcut)}
                >
                  {suggestion.icon && suggestion.icon}
                  {suggestion.label}
                  {suggestion.shortcut && <span className="command-item-shortcut">{suggestion.shortcut}</span>}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.Group>
            <CommandPrimitive.Separator className="command-separator" />
          </>
        )}
        <CommandPrimitive.Group className="command-group" heading="Elements">
          {items.map((item) => (
            <CommandPrimitive.Item
              key={item.label}
              className="command-item"
              onSelect={() => onSuggestionSelect(item.shortcut)}
            >
              {item.icon && item.icon}
              {item.label}
              {item.shortcut && <span className="command-item-shortcut">{item.shortcut}</span>}
            </CommandPrimitive.Item>
          ))}
        </CommandPrimitive.Group>
      </CommandPrimitive.List>
    </CommandPrimitive>
  )
}
