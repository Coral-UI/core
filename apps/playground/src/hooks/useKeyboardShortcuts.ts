import { useEffect } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
}

/**
 * Hook to register keyboard shortcuts
 * @param shortcuts Array of keyboard shortcuts to register
 * @param enabled Whether the shortcuts are enabled (default: true)
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled = true) => {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if focus is in a form element (input, select, textarea, etc.)
      const activeElement = document.activeElement
      const isFormElement =
        activeElement &&
        (activeElement.tagName.toLowerCase() === 'input' ||
          activeElement.tagName.toLowerCase() === 'select' ||
          activeElement.tagName.toLowerCase() === 'textarea' ||
          activeElement.tagName.toLowerCase() === 'button' ||
          (activeElement instanceof HTMLElement && activeElement.isContentEditable))

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey
        const metaMatches = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey
        const shiftMatches = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey
        const altMatches = shortcut.altKey === undefined || event.altKey === shortcut.altKey

        // For Cmd/Ctrl shortcuts, check if either is pressed
        const modifierMatches =
          shortcut.ctrlKey || shortcut.metaKey
            ? (event.ctrlKey && shortcut.ctrlKey) || (event.metaKey && shortcut.metaKey)
            : ctrlMatches && metaMatches

        if (keyMatches && modifierMatches && shiftMatches && altMatches) {
          // Don't trigger shortcuts if focus is in a form element (unless it's a modifier key shortcut)
          // Modifier key shortcuts (Cmd/Ctrl) should still work in form elements
          const hasModifier = shortcut.ctrlKey || shortcut.metaKey || shortcut.altKey || shortcut.shiftKey
          if (isFormElement && !hasModifier) {
            // Allow normal text editing behavior
            continue
          }

          if (shortcut.preventDefault !== false) {
            event.preventDefault()
          }
          shortcut.handler(event)
          break // Stop after first match
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts, enabled])
}
