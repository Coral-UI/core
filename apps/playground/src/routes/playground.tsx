import Playground from '@/components/Playground/Playground'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playground')({
  component: PlaygroundRoute,
})

function PlaygroundRoute() {
  return <Playground />
}
