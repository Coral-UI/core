import { cn } from '@/lib/utils'

export const JustifyContentSpaceBetween = ({
  className,
  strokeWidth = 1.5,
}: {
  className?: string
  strokeWidth?: number
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={cn('w-4 h-4', className)}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M21 2v20M4 2v20m4-6V8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m13 0V8a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1"
      />
    </svg>
  )
}
