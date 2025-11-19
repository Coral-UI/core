export const PageHeader = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => {
  return (
    <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
      <div>
        <h1 className="text-2xl font-medium text-foreground mb-1 tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}
