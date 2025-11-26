'use client'

import { useAuthContext } from '@/lib/auth/auth-context'
import { useSignOut } from '@/lib/auth/use-auth'
import Link from 'next/link'
// import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from './primitives/Avatar/avatar'
import { DropdownMenu } from './primitives/DropdownMenu/dropdown-menu'
import { ModeToggle } from './ThemeToggle'

function getUserInitials(email: string | undefined): string {
  if (!email) return 'U'
  const parts = email.split('@')[0]?.split(/[._-]/)
  if (parts?.length && parts.length >= 2) {
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '').toUpperCase()
  }
  return email[0]?.toUpperCase() ?? 'U'
}

function UserMenu() {
  const { user } = useAuthContext()
  const { signOut, loading } = useSignOut()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
      toast.error('Sign out failed', { description: errorMessage })
    }
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  if (!user) {
    return null
  }

  const initials = getUserInitials(user.email)

  return (
    <DropdownMenu
      trigger={
        <button
          type="button"
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      }
      items={[
        {
          key: 'profile',
          label: 'Profile',
          onClick: handleProfileClick,
        },
        {
          key: 'sign-out',
          label: 'Sign Out',
          onClick: handleSignOut,
          disabled: loading,
        },
      ]}
    >
      {/* <DropdownMenuTrigger asChild></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.email}</p>
          {user.user_metadata?.full_name && (
            <p className="text-xs text-muted-foreground">{user.user_metadata.full_name}</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 size-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={loading} variant="destructive">
          <LogOut className="mr-2 size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
  )
}

export const NavBar = () => {
  const { user, loading } = useAuthContext()

  return (
    <div className="border-b border-border bg-muted fixed top-0 left-0 right-0 z-50">
      <div className={`px-4 mx-auto flex items-center justify-between py-2`}>
        <Link href="/">
          <h1 className="text-base font-medium tracking-tight">Coral</h1>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {!loading && user && <UserMenu />}
        </div>
      </div>
    </div>
  )
}
