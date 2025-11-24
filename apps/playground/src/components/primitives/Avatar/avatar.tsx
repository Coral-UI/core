import { cn } from '@/lib/utils'
import { Avatar as BaseAvatar } from '@base-ui-components/react/avatar'
import * as React from 'react'

// Root component
const Avatar = React.forwardRef<
  React.ElementRef<typeof BaseAvatar.Root>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Root>
>(({ className, ...props }, ref) => {
  return (
    <BaseAvatar.Root
      ref={ref}
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
})
Avatar.displayName = 'Avatar'

// Image component
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof BaseAvatar.Image>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Image>
>(({ className, ...props }, ref) => {
  return (
    <BaseAvatar.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
})
AvatarImage.displayName = 'AvatarImage'

// Fallback component
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof BaseAvatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>
>(({ className, ...props }, ref) => {
  return (
    <BaseAvatar.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  )
})
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
