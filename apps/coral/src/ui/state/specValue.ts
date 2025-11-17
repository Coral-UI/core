import { create } from 'zustand'

// import { headerCentered } from '../../specs/header-centered'
import { simpleStacked } from '../../specs/simple-stacked'

interface SpecValue {
  value: string
  setValue: (value: string) => void
}

export const useSpecValue = create<SpecValue>((set) => ({
  value: JSON.stringify(simpleStacked, null, 2),
  setValue: (value: string) => set({ value }),
}))
