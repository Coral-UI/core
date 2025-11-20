/**
 * Hook for tracking analytics events
 *
 * Provides a simple interface for tracking events throughout the app.
 * Analytics implementation can be swapped by providing a different provider.
 */

import { createContext, useContext } from 'react'

import type { AnalyticsEvent, AnalyticsEventProperties, AnalyticsProvider } from './types'

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

export const AnalyticsContext = createContext<AnalyticsProvider>(noOpProvider)

/**
 * Hook to use analytics
 */
export function useAnalytics(): AnalyticsProvider {
  return useContext(AnalyticsContext)
}

/**
 * Hook to track a specific event
 */
export function useTrackEvent<T extends AnalyticsEvent>(
  event: T,
  properties?: AnalyticsEventProperties[T],
): () => void {
  const analytics = useAnalytics()

  return () => {
    analytics.track(event, properties)
  }
}
