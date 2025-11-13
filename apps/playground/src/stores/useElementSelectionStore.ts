import { create } from 'zustand'

interface ElementSelectionState {
  selectedElementId: string | null
  setSelectedElementId: (elementId: string | null) => void
}

/**
 * Global store for element selection state
 * Keeps selection synchronized across:
 * - Element tree sidebar
 * - Preview/interaction layer
 * - Style form
 */
export const useElementSelectionStore = create<ElementSelectionState>((set) => ({
  selectedElementId: null,
  setSelectedElementId: (elementId: string | null) => {
    set({ selectedElementId: elementId })
  },
}))
