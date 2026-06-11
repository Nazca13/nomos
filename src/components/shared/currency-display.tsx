import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface CurrencyDisplayProps {
  amount: number
  type?: 'income' | 'expense' | 'neutral'
  showSign?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'text-[13px]', md: 'text-[15px]', lg: 'text-lg' } as const

export function CurrencyDisplay({ amount, type = 'neutral', showSign = false, size = 'md', className }: CurrencyDisplayProps) {
  const formatted = formatCurrency(Math.abs(amount))
  const prefix = showSign ? (type === 'income' ? '+' : type === 'expense' ? '-' : '') : ''

  return (
    <span className={cn(
      'font-financial font-semibold',
      sizeMap[size],
      type === 'income' && 'text-positive',
      type === 'expense' && 'text-negative',
      type === 'neutral' && 'text-[var(--color-foreground)]',
      className
    )}>
      {prefix}{formatted}
    </span>
  )
}
