export const Preview = () => {
  return (
    <div className="flex flex-col px-4">
      <header className="flex items-center justify-between mt-8 pb-2 border-b border-border">
        <h1 className="text-xl font-semibold tracking-tight text-primary">Preview</h1>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 min-h-48">
        <p className="text-xl font-semibold tracking-tight">Coming Soon</p>
        <p className="text-muted-foreground">We are working on the preview feature.</p>
      </div>
    </div>
  )
}
