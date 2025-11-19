import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { IconPlus } from '@tabler/icons-react'

import { Button, ButtonProps } from './button'

function Dialog({
  buttonVariant = 'default',
  buttonText = 'Create New',
  buttonIcon = <IconPlus className="size-4" />,
  title = 'Create New',
  description = 'Create a new item',
  children,
  open = false,
  onOpenChange,
}: {
  buttonVariant?: ButtonProps['variant']
  buttonText?: string
  buttonIcon?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  open?: React.ComponentProps<typeof BaseDialog.Root>['open']
  onOpenChange?: (open: boolean, eventDetails: BaseDialog.Root.ChangeEventDetails) => void
}) {
  return (
    <BaseDialog.Root open={open} {...(onOpenChange ? { onOpenChange } : {})}>
      <BaseDialog.Trigger
        render={(props) => (
          <Button {...props} variant={buttonVariant}>
            {buttonIcon}
            {buttonText}
          </Button>
        )}
      />

      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
        <BaseDialog.Popup className="bg-background data-[starting-style]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[starting-style]:fade-in-0 data-[ending-style]:zoom-out-95 data-[starting-style]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg">
          {title && <BaseDialog.Title className=" text-lg font-medium">{title}</BaseDialog.Title>}
          {description && (
            <BaseDialog.Description className="mb-4 text-sm text-muted-foreground">
              {description}
            </BaseDialog.Description>
          )}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

export { Dialog }
