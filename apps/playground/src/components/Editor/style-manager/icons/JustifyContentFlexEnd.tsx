import { cn } from '@/lib/utils'

export const JustifyContentFlexEnd = ({
  className,
  strokeWidth = 1.5,
}: {
  className?: string
  strokeWidth?: number
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-4 h-4', className)}
    >
      <path
        d="M21 2L21 22M11 16L11 8C11 7.44772 10.5523 7 10 7H8C7.44772 7 7 7.44772 7 8L7 16C7 16.5523 7.44772 17 8 17H10C10.5523 17 11 16.5523 11 16ZM18 16V8C18 7.44772 17.5523 7 17 7H15C14.4477 7 14 7.44772 14 8L14 16C14 16.5523 14.4477 17 15 17H17C17.5523 17 18 16.5523 18 16Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
