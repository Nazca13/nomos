import { cn } from '@/lib/utils'

interface StatValueProps {
  value: string
  label?: string
  trend?: 'positive' | 'negative' | 'neutral'
  trendText?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-[32px]',
} as const

const trendColorMap = {
  positive: 'text-positive',
  negative: 'text-negative',
  neutral: 'text-[var(--color-secondary)]',
} as const

export function StatValue({
  value,
  label,
  trend,
  trendText,
  size = 'md',
  className,
}: StatValueProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-tertiary)]">
          {label}
        </span>
      )}
      <div className="flex items-baseline gap-2">
        <span className={cn('font-financial font-bold text-[var(--color-foreground)]', sizeMap[size])}>
          {value}
        </span>
        {trend && trendText && (
          <span className={cn('font-financial text-[12px] font-semibold', trendColorMap[trend])}>
            {trendText}
          </span>
        )}
      </div>
    </div>
  )
}
