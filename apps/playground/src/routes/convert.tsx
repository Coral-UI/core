import Playground from '@/components/Playground/Playground'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/convert')({
  component: ConvertRoute,
})

function ConvertRoute() {
  return <Playground />
}
