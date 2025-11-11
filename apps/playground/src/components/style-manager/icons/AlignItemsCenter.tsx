import { cn } from '@/lib/utils'

export const AlignItemsCenter = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={cn('w-4 h-4', className)}>
      <path
        fill="currentColor"
        d="M10 20h.75zm-1 1v.75zM9 3v-.75zm1 1h-.75zM6 4h-.75zm1-1v.75zM6 20h.75zm1 1v-.75zm11-5h-.75zm-1 1v.75zm0-10v.75zm1 1h.75zm-4 0h.75zm1-1v-.75zm-1 9h-.75zm1 1v-.75zm-9-4.25a.75.75 0 0 0 0-1.5zm-4-1.5a.75.75 0 0 0 0 1.5zm12 1.5a.75.75 0 0 0 0-1.5zm-4-1.5h-.75v1.5H10zm12 1.5a.75.75 0 0 0 0-1.5zm-4-1.5a.75.75 0 0 0 0 1.5zM6.75 20V4h-1.5v16zM7 3.75h2v-1.5H7zM9.25 4v16h1.5V4zM9 20.25H7v1.5h2zm.25-.25q-.02.23-.25.25v1.5c.97 0 1.75-.78 1.75-1.75zM9 3.75c.14 0 .25.11.25.25h1.5c0-.97-.78-1.75-1.75-1.75zM6.75 4c0-.14.11-.25.25-.25v-1.5c-.97 0-1.75.78-1.75 1.75zm-1.5 16c0 .97.78 1.75 1.75 1.75v-1.5a.25.25 0 0 1-.25-.25zm9.5-4V8h-1.5v8zM15 7.75h2v-1.5h-2zm2.25.25v8h1.5V8zM17 16.25h-2v1.5h2zm.25-.25q-.02.23-.25.25v1.5c.97 0 1.75-.78 1.75-1.75zM17 7.75c.14 0 .25.11.25.25h1.5c0-.97-.78-1.75-1.75-1.75zM14.75 8c0-.14.11-.25.25-.25v-1.5c-.97 0-1.75.78-1.75 1.75zm-1.5 8c0 .97.78 1.75 1.75 1.75v-1.5a.25.25 0 0 1-.25-.25zM6 11.25H2v1.5h4zm8 0h-4v1.5h4zm8 0h-4v1.5h4z"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}
