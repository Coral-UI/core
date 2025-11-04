import { create } from 'zustand'

import { headerCentered } from '../../specs/header-centered'

interface SpecValue {
  value: string
  setValue: (value: string) => void
}

export const useSpecValue = create<SpecValue>((set) => ({
  value: JSON.stringify(headerCentered, null, 2),
  setValue: (value: string) => set({ value }),
}))
