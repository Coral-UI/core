import type { VariantProps } from 'cva'
import { cva } from 'cva'
import { twMerge } from 'tailwind-merge'

interface TabButtonsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: React.ReactNode
}

const tabButtonStyles = cva({
  base: 'rounded-full px-3 py-1 font-semibold text-sm',
  variants: {
    active: {
      true: 'bg-rose-100 text-rose-600 hover:bg-rose-200',
      false: 'bg-transparent hover:bg-rose-100/50 hover:text-rose-700',
    },
  },
})

export interface TabButtonVariants extends VariantProps<typeof tabButtonStyles> {}

const tabButtonVariants = (variants: TabButtonVariants) => twMerge(tabButtonStyles(variants))

export const TabButtons = ({ active, children, className, ...rest }: TabButtonsProps) => {
  return (
    <button className={tabButtonVariants({ active })} {...rest}>
      {children}
    </button>
  )
}
