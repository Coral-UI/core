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

  // Prevent scroll when popover opens and input auto-focuses
  React.useEffect(() => {
    const input = inputRef.current
    if (!input) return

    // Store initial scroll position
    let scrollY = window.scrollY
    let scrollX = window.scrollX
    let isRestoring = false

    // Function to restore scroll position
    const restoreScroll = () => {
      if (isRestoring) return
      isRestoring = true
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' })
      requestAnimationFrame(() => {
        isRestoring = false
      })
    }

    // Monitor scroll changes and restore if needed
    const handleScroll = () => {
      if (!isRestoring && (window.scrollY !== scrollY || window.scrollX !== scrollX)) {
        restoreScroll()
      }
    }

    // Focus input without scrolling after a short delay
    const timeoutId = setTimeout(() => {
      scrollY = window.scrollY
      scrollX = window.scrollX

      // Try to focus with preventScroll
      input.focus({ preventScroll: true })

      // Monitor for scroll changes and restore
      window.addEventListener('scroll', handleScroll, { passive: false, once: true })

      // Also restore after focus event
      requestAnimationFrame(() => {
        restoreScroll()
        setTimeout(restoreScroll, 0)
      })
    }, 10)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
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
