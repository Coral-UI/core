import { clsx } from 'clsx'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  children: React.ReactNode
  onClick: () => void
  className?: string
  icon?: React.ReactNode
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
    'rounded-md px-2.5 py-1.5 text-sm font-semibold border-1 backdrop-blur-2xl',
    variant === 'primary' &&
      'bg-indigo-400/20 text-indigo-300 hover:bg-indigo-500/40 border-indigo-400/20 shadow-indigo-100/50',
    variant === 'secondary' &&
      'bg-blue-400/20 text-blue-300 hover:bg-blue-500/40 border-blue-400/20 shadow-blue-100/50',
    variant === 'tertiary' && 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent shadow-gray-100/50',
    variant === 'danger' && 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100 shadow-red-100/50',
    className,
  )

  return (
    <button onClick={onClick} className={classes}>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  )
}
