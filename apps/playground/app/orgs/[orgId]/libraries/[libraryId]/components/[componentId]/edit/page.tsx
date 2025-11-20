'use client'

import { Editor } from '@/components/Editor/Editor'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function EditorPage() {
  const params = useParams()
  const componentId = params['componentId'] as string

  useEffect(() => {
    // Prevent body scroll only on the editor page
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100dvh'

    return () => {
      // Restore normal scrolling when leaving the editor page
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [])

  return <Editor componentId={componentId} />
}
