import { cn } from '@/lib/utils'

export const AlignItemsFlexEnd = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={cn('w-4 h-4', className)}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M22 21H2M6 6v11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1m8 4v7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1"
      />
    </svg>
  )
}
