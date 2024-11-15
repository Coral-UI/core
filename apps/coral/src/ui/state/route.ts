import { create } from 'zustand'

type RouteValues = 'import' | 'export' | 'preview' | 'settings'

interface Route {
  route: RouteValues
  setRoute: (value: RouteValues) => void
}

export const useRoute = create<Route>((set) => ({
  route: 'import',
  setRoute: (route: RouteValues) => set({ route }),
}))
