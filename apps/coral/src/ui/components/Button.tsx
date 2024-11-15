import { clsx } from 'clsx'
import { createElement } from 'react'

type ButtonProps = {
  variant?: 'primary' | 'destructive'
  children: React.ReactNode
  onClick: () => void
  className?: string
  icon?: React.ElementType
  iconPosition?: 'left' | 'right'
}

export const Button = ({
  children,
  onClick,
  className,
  variant = 'primary',
  icon,
  iconPosition = 'left',
}: ButtonProps) => {
  const classes = clsx(
    'rounded-md h-10 px-4 py-3 text-xs font-medium shadow-sm whitespace-nowrap inline-flex items-center gap-2 justify-center [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full',
    variant === 'primary' && 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
    variant === 'destructive' && 'bg-destructive text-destructive-foreground shadow hover:bg-destructive/90',
    // variant === 'secondary' &&
    //   'bg-blue-400/20 text-blue-300 hover:bg-blue-500/40 border-blue-400/20 shadow-blue-100/50',
    // variant === 'tertiary' && 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent shadow-gray-100/50',
    // variant === 'danger' && 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100 shadow-red-100/50',
    className,
  )

  return (
    <button onClick={onClick} className={classes}>
      {icon && iconPosition === 'left' && icon && <span className="w-4 h-4">{createElement(icon)}</span>}
      {children}
      {icon && iconPosition === 'right' && icon && <span className="w-4 h-4">{createElement(icon)}</span>}
    </button>
  )
}
