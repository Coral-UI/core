import { render } from '@react-email/render'
import * as React from 'react'

/**
 * Render a React Email component to HTML string
 */
export function renderEmail(component: React.ReactElement): string {
  return render(component)
}
