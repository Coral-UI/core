import { Editor } from '@/components/Editor/Editor'
import { createFileRoute } from '@tanstack/react-router'
import { memo, useEffect } from 'react'

// Memoize the route component to prevent re-renders
const EditorRoute = memo(function EditorRoute() {
  const { componentId } = Route.useParams()

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
})

export const Route = createFileRoute('/orgs/$orgId/libraries/$libraryId/components/$componentId/edit')({
  component: EditorRoute,
})
