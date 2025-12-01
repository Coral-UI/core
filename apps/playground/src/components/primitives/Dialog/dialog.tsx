import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { IconPlus } from '@tabler/icons-react'
import * as React from 'react'

import './dialog.css'

import { Button, ButtonProps } from '../Button/button'

function Dialog({
  buttonVariant = 'default',
  buttonText = 'Create New',
  buttonSize = 'default',
  buttonIcon = <IconPlus className="size-4" />,
  title = 'Create New',
  description = 'Create a new item',
  children,
  open = false,
  onOpenChange,
  hideTrigger = false,
}: {
  buttonVariant?: ButtonProps['variant']
  buttonText?: string
  buttonIcon?: React.ReactNode
  buttonSize?: ButtonProps['size']
  title?: string
  description?: string
  children?: React.ReactNode
  open?: React.ComponentProps<typeof BaseDialog.Root>['open']
  onOpenChange?: (open: boolean, eventDetails: BaseDialog.Root.ChangeEventDetails) => void
  hideTrigger?: boolean
}) {
  return (
    <BaseDialog.Root open={open} {...(onOpenChange ? { onOpenChange } : {})}>
      {!hideTrigger && (
        <BaseDialog.Trigger
          render={(props) => (
            <Button {...props} variant={buttonVariant} size={buttonSize}>
              {buttonIcon}
              {buttonText}
            </Button>
          )}
        />
      )}

      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="dialog-backdrop" />
        <BaseDialog.Popup className="dialog">
          {title && <BaseDialog.Title className="dialog-title">{title}</BaseDialog.Title>}
          {description && <BaseDialog.Description className="dialog-description">{description}</BaseDialog.Description>}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

export { Dialog }
