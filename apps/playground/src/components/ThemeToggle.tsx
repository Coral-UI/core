import { Button } from '@/components/primitives/Button/button'
import { IconMoonStars, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'

import { DropdownMenu } from './primitives/DropdownMenu/dropdown-menu'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" size="icon-sm">
          <IconSun className="size-3.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <IconMoonStars className="absolute size-3.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      }
      items={[
        {
          key: 'light',
          children: 'Light',
          onClick: () => setTheme('light'),
        },
        {
          key: 'dark',
          children: 'Dark',
          onClick: () => setTheme('dark'),
        },
        {
          key: 'system',
          children: 'System',
          onClick: () => setTheme('system'),
        },
      ]}
    />
  )
}
