import { Container } from '@/components/primitives/Stack/stack'

export const LoadingContent = ({ type }: { type: 'organizations' | 'libraries' | 'components' }) => {
  return (
    <Container>
      <div className="text-center">Loading {type}...</div>
    </Container>
  )
}
