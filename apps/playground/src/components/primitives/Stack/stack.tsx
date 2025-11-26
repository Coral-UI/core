import { cn } from '@/lib/utils'

import './stack.css'

type StackProps = React.ComponentProps<'div'> & {
  as?: React.ElementType
}

export const Stack = ({ children, className, as = 'div', ...props }: StackProps) => {
  const As = as
  return (
    <As className={cn('stack', className)} {...props}>
      {children}
    </As>
  )
}

export const VStack = ({ children, as = 'div', className, ...props }: StackProps) => {
  const As = as
  return (
    <As className={cn('stack', className)} {...props}>
      {children}
    </As>
  )
}

export const HStack = ({ children, as = 'div', className, ...props }: StackProps) => {
  const As = as
  return (
    <As className={cn('row', className)} {...props}>
      {children}
    </As>
  )
}

export const Container = ({ children, as = 'div', className, ...props }: StackProps) => {
  const As = as
  return (
    <As className={cn('container', className)} {...props}>
      {children}
    </As>
  )
}
