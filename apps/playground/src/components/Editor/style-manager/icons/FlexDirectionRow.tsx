import { cn } from '@/lib/utils'

export const FlexDirectionRow = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={cn('w-4 h-4', className)}
    >
      <path
        // stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 18.5h12m0 0L14.5 15m3.5 3.5L14.5 22"
      />
      <path
        // stroke="#000"
        strokeWidth={strokeWidth}
        d="M3 5.75v-2C3 2.78 3.78 2 4.75 2h.88M3 8.25v2c0 .97.78 1.75 1.75 1.75h.88M10 8.25v2c0 .97-.78 1.75-1.75 1.75h-.87M10 5.75v-2C10 2.78 9.22 2 8.25 2h-.87M14 4v6c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2Z"
      />
    </svg>
  )
}
