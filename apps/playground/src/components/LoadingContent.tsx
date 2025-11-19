export const LoadingContent = ({ type }: { type: 'organizations' | 'libraries' | 'components' }) => {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center">Loading {type}...</div>
    </div>
  )
}
