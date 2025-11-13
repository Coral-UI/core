import { cn } from '@/lib/utils'

export const AlignItemsBaseline = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => {
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
        d="M22 21.75a.75.75 0 0 0 0-1.5zm-20-1.5a.75.75 0 0 0 0 1.5zM11 6v-.75c-.32 0-.6.2-.71.51zM6.29 17.76a.75.75 0 0 0 1.42.48zM13 6l.71-.24a.75.75 0 0 0-.71-.51zm3.29 12.24a.75.75 0 0 0 1.42-.48zM8.5 13.25h-.75v1.5h.75zm7 1.5h.75v-1.5h-.75zm6.5 5.5H2v1.5h20zM10.29 5.76l-4 12 1.42.48 4-12zm.71.99h2v-1.5h-2zm1.29-.51 4 12 1.42-.48-4-12zM8.5 14.75h7v-1.5h-7z"
      />
    </svg>
  )
}
