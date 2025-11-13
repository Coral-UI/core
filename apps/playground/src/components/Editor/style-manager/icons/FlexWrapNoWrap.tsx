import { cn } from '@/lib/utils'

export const FlexWrapNoWrap = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={cn('w-4 h-4', className)}
    >
      <path
        strokeWidth={strokeWidth}
        d="M3 10.75V8a1 1 0 0 1 1-1h.5M3 13.25V16a1 1 0 0 0 1 1h.5M7 13.25V16a1 1 0 0 1-1 1h-.5M7 10.75V8a1 1 0 0 0-1-1h-.5M17 10.75V8a1 1 0 0 1 1-1h.5M17 13.25V16a1 1 0 0 0 1 1h.5m2.5-3.75V16a1 1 0 0 1-1 1h-.5m1.5-6.25V8a1 1 0 0 0-1-1h-.5M10 8v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1Z"
      />
    </svg>
  )
}
