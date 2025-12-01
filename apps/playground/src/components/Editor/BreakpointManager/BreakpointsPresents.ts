import { Monitor, Smartphone, Tablet } from 'lucide-react'

import { BreakpointType } from './BreakpointManager'

export const BREAKPOINT_PRESETS = [
  { label: 'Small Tablet', type: 'min-width' as BreakpointType, value: '640px', icon: Smartphone },
  { label: 'Tablet', type: 'min-width' as BreakpointType, value: '768px', icon: Tablet },
  { label: 'Desktop', type: 'min-width' as BreakpointType, value: '1024px', icon: Monitor },
  { label: 'Large Desktop', type: 'min-width' as BreakpointType, value: '1280px', icon: Monitor },
]
