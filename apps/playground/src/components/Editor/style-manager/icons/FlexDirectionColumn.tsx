import { cn } from '@/lib/utils'

export const FlexDirectionColumn = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={cn('w-4 h-4', className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M18.5 6v12m0 0 3.5-3.5M18.5 18 15 14.5"
      />
      <path
        strokeWidth={strokeWidth}
        d="M5.75 10h-2C2.78 10 2 9.22 2 8.25v-.87M8.25 10h2c.97 0 1.75-.78 1.75-1.75v-.87M8.25 3h2c.97 0 1.75.78 1.75 1.75v.88M5.75 3h-2C2.78 3 2 3.78 2 4.75v.88M4 21h6a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2Z"
      />
    </svg>
  )
}
