import { cn } from '@/lib/utils'
import * as React from 'react'

import './card.css'

function Card({ className, tight, ...props }: React.ComponentProps<'div'> & { tight?: boolean }) {
  return <div className={cn('card', tight && 'tight', className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('card-header', className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('card-title', className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('card-description', className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('card-action', className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('card-content', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('card-footer', className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
