import { useComponent } from '@/hooks/queries/useComponents'
import { useLibrary } from '@/hooks/queries/useLibraries'
import { useOrganization } from '@/hooks/queries/useOrganizations'
import { cn } from '@/lib/utils'
import { IconChevronRight, IconHome } from '@tabler/icons-react'
import { Link, useRouterState } from '@tanstack/react-router'

export function Breadcrumbs({ className }: React.ComponentProps<'div'>) {
  const router = useRouterState()
  const pathname = router.location.pathname

  // Extract route params from pathname
  const orgMatch = pathname.match(/\/orgs\/([^/]+)/)
  const libraryMatch = pathname.match(/\/orgs\/[^/]+\/libraries\/([^/]+)/)
  const componentMatch = pathname.match(/\/orgs\/[^/]+\/libraries\/[^/]+\/components\/([^/]+)/)

  const orgId = orgMatch?.[1]
  const libraryId = libraryMatch?.[1]
  const componentId = componentMatch?.[1]

  const { data: organization } = useOrganization(orgId || '')
  const { data: library } = useLibrary(libraryId || '')
  const { data: component } = useComponent(componentId || '')

  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null
  }

  const items = [
    {
      label: 'Dashboard',
      href: '/',
    },
  ]

  if (orgId && organization) {
    items.push({
      label: organization.name,
      href: `/orgs/${orgId}`,
    })
  }

  if (libraryId && library) {
    items.push({
      label: library.name,
      href: `/orgs/${orgId}/libraries/${libraryId}`,
    })
  }

  if (componentId && component) {
    items.push({
      label: component.name,
      href: `/orgs/${orgId}/libraries/${libraryId}/components/${componentId}/edit`,
    })
  }

  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={item.href} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                to={item.href}
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
              >
                <IconHome className="size-3.5" />
              </Link>
            ) : (
              <>
                <IconChevronRight className="size-3 " />
                {isLast ? (
                  <span className="text-foreground font-normal">{item.label}</span>
                ) : (
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary hover:underline transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}
