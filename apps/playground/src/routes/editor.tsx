import { Editor } from '@/components/Editor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor')({
  component: EditorRoute,
})

function EditorRoute() {
  return <Editor />
}
