/**
 * Analytics context provider
 *
 * Re-exports from use-analytics for convenience
 */

import type { ReactNode } from 'react'

import type { AnalyticsEvent, AnalyticsEventProperties, AnalyticsProvider } from './types'
import { AnalyticsContext, useAnalytics, useTrackEvent } from './use-analytics'

// Default no-op analytics provider
const noOpProvider: AnalyticsProvider = {
  track: () => {
    // No-op
  },
  identify: () => {
    // No-op
  },
  page: () => {
    // No-op
  },
}

interface AnalyticsProviderProps {
  children: ReactNode
  provider?: AnalyticsProvider
}

/**
 * AnalyticsProvider component that wraps the app
 */
export function AnalyticsProvider({ children, provider = noOpProvider }: AnalyticsProviderProps): JSX.Element {
  return <AnalyticsContext.Provider value={provider}>{children}</AnalyticsContext.Provider>
}

export { useAnalytics, useTrackEvent }
export type { AnalyticsEvent, AnalyticsEventProperties, AnalyticsProvider as AnalyticsProviderType }
