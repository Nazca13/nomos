import { cn } from '@/lib/utils'

interface BentoCardProps {
  children: React.ReactNode
  className?: string
}

export function BentoCard({ children, className }: BentoCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-colors duration-200 active:bg-[var(--color-card-hover)]',
        className
      )}
    >
      {children}
    </div>
  )
}
