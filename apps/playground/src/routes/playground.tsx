import App from '@/App'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playground')({
  component: Playground,
})

function Playground() {
  return <App />
}
