'use client'

import { Editor } from '@/components/Editor/Editor'
import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    // Prevent body scroll on the editor page
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100dvh'

    return () => {
      // Restore normal scrolling when leaving the editor page
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [])

  // Render Editor in standalone mode (no componentId, no database)
  return <Editor />
}
