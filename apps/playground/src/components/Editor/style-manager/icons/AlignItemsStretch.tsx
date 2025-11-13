import { cn } from '@/lib/utils'

export const AlignItemsStretch = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => {
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
        d="M22 21H2M22 4H2M6 8L6 17C6 17.5523 6.44772 18 7 18H9C9.55229 18 10 17.5523 10 17V8C10 7.44772 9.55229 7 9 7L7 7C6.44772 7 6 7.44771 6 8ZM14 8V17C14 17.5523 14.4477 18 15 18H17C17.5523 18 18 17.5523 18 17V8C18 7.44772 17.5523 7 17 7L15 7C14.4477 7 14 7.44771 14 8Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
