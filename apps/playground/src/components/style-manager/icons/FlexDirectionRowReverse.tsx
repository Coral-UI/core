import { cn } from '@/lib/utils'

export const FlexDirectionRowReverse = ({
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
        d="M18 18.5L6 18.5M6 18.5L9.5 22M6 18.5L9.5 15"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 5.75V3.75C14 2.7835 14.7835 2 15.75 2L16.625 2M14 8.25V10.25C14 11.2165 14.7835 12 15.75 12H16.625M21 8.25V10.25C21 11.2165 20.2165 12 19.25 12H18.375M21 5.75V3.75C21 2.7835 20.2165 2 19.25 2L18.375 2M3 4L3 10C3 11.1046 3.89543 12 5 12H8C9.10457 12 10 11.1046 10 10L10 4C10 2.89543 9.10457 2 8 2L5 2C3.89543 2 3 2.89543 3 4Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}
