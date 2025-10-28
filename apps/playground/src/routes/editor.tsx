import { Editor } from '@/components/Editor/Editor'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/editor')({
  component: EditorRoute,
})

function EditorRoute() {
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

  return <Editor />
}
