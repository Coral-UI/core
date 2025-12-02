'use client'

import { IconHelpCircle } from '@tabler/icons-react'
// import { useAuthContext } from '@/lib/auth/auth-context'
// import { useSignOut } from '@/lib/auth/use-auth'
// import Link from 'next/link'
import { useState } from 'react'

import { Button } from './primitives/Button/button'
import { Dialog } from './primitives/Dialog/dialog'
// import { LogOut, User } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { toast } from 'sonner'

// import { Avatar, AvatarFallback } from './primitives/Avatar/avatar'
// import { DropdownMenu } from './primitives/DropdownMenu/dropdown-menu'
import { ModeToggle } from './ThemeToggle'

// function getUserInitials(email: string | undefined): string {
//   if (!email) return 'U'
//   const parts = email.split('@')[0]?.split(/[._-]/)
//   if (parts?.length && parts.length >= 2) {
//     return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '').toUpperCase()
//   }
//   return email[0]?.toUpperCase() ?? 'U'
// }

// function UserMenu() {
//   // const { user } = useAuthContext()
//   // const { signOut, loading } = useSignOut()
//   const router = useRouter()

//   // const handleSignOut = async () => {
//   //   try {
//   //     await signOut()
//   //     toast.success('Signed out successfully')
//   //     router.push('/login')
//   //   } catch (err) {
//   //     const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
//   //     toast.error('Sign out failed', { description: errorMessage })
//   //   }
//   // }

//   const handleProfileClick = () => {
//     router.push('/profile')
//   }

//   // if (!user) {
//   //   return null
//   // }

//   // const initials = getUserInitials(user.email)

//   return (
//     <DropdownMenu
//       trigger={
//         <button
//           type="button"
//           className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//         >
//           <Avatar className="size-8">
//             <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
//               {initials}
//             </AvatarFallback>
//           </Avatar>
//         </button>
//       }
//       items={[
//         {
//           key: 'profile',
//           label: 'Profile',
//           onClick: handleProfileClick,
//         },
//         {
//           key: 'sign-out',
//           label: 'Sign Out',
//           onClick: handleSignOut,
//           disabled: loading,
//         },
//       ]}
//     >
//       {/* <DropdownMenuTrigger asChild></DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-56">
//         <div className="px-2 py-1.5">
//           <p className="text-sm font-medium">{user.email}</p>
//           {user.user_metadata?.full_name && (
//             <p className="text-xs text-muted-foreground">{user.user_metadata.full_name}</p>
//           )}
//         </div>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleProfileClick}>
//           <User className="mr-2 size-4" />
//           View Profile
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleSignOut} disabled={loading} variant="destructive">
//           <LogOut className="mr-2 size-4" />
//           Sign Out
//         </DropdownMenuItem>
//       </DropdownMenuContent> */}
//     </DropdownMenu>
//   )
// }

export const NavBar = () => {
  const [open, setOpen] = useState(true)
  // const { user, loading } = useAuthContext()

  return (
    <div className="bg-background fixed top-0 left-0 right-0 z-50">
      <div className={`px-4 mx-auto flex items-center justify-between py-2`}>
        {/* <Link href="/"> */}
        <h1 className="text-base font-medium tracking-tight">Coral</h1>
        {/* </Link> */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Dialog
            open={open}
            onOpenChange={setOpen}
            buttonVariant="ghost"
            buttonText="What is Coral?"
            buttonSize={'sm'}
            buttonIcon={<IconHelpCircle />}
            title="Welcome to the Coral Beta Playground"
            description="Coral is a exploration into the future of UI development. It is a platform and framework agnostic file format that can be used with any frontend framework and any design tool through the use of Coral UI's plugin system."
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-base font-medium">How to use the Coral Beta Playground</p>
                <ul className="text-sm text-caption list-disc list-outside pl-4 space-y-1">
                  <li>Explore the editor to change values and see how a spec is generated.</li>
                  <li>
                    Download the{' '}
                    <a
                      href="https://drive.google.com/file/d/18xj19EA2ZqE5_YtSW5NRgmTbfkX0BBba/view?usp=sharing"
                      className="text-accent underline hover:no-underline"
                    >
                      Figma plugin
                    </a>{' '}
                    and follow the instructions to see how Coral files can be used to sync code with design.
                  </li>
                  <li>Export the spec from Figma to see how it can quickly convert Figma designs to code.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-base font-medium">Who made this?</p>
                <p className="text-caption text-sm">
                  Coral is a project by Drew Minns from{' '}
                  <a href="https://reallygoodwork.com" className="text-accent underline hover:no-underline">
                    Really Good Work
                  </a>
                  . It's an exploration into the future of UI development tooling. If you're interested in my efforts,
                  or would like to make this a part of your team's workflow, please reach out to me at{' '}
                  <a href="mailto:drew@reallygoodwork.com" className="text-accent underline hover:no-underline">
                    drew@reallygoodwork.com
                  </a>
                  .
                </p>
              </div>
            </div>

            <Button variant="default" size="sm" onClick={() => setOpen(false)} className="mt-4">
              Got it!
            </Button>
          </Dialog>
          {/* {!loading && user && <UserMenu />} */}
        </div>
      </div>
    </div>
  )
}
