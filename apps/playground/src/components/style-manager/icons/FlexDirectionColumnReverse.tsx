import { cn } from '@/lib/utils'

export const FlexDirectionColumnReverse = ({
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
        d="M18.5 18L18.5 6M18.5 6L15 9.5M18.5 6L22 9.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 21H3.75C2.7835 21 2 20.2165 2 19.25V18.375M8.25 21H10.25C11.2165 21 12 20.2165 12 19.25V18.375M8.25 14H10.25C11.2165 14 12 14.7835 12 15.75V16.625M5.75 14H3.75C2.7835 14 2 14.7835 2 15.75V16.625M4 10H10C11.1046 10 12 9.10457 12 8V5C12 3.89543 11.1046 3 10 3H4C2.89543 3 2 3.89543 2 5V8C2 9.10457 2.89543 10 4 10Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}
