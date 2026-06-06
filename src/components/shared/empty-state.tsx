import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-20 text-center', className)}>
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-card)] text-[var(--color-tertiary)]">
          {icon}
        </div>
      )}
      <h3 className="text-[14px] font-semibold text-white">{title}</h3>
      {description && <p className="max-w-[240px] text-[12px] leading-relaxed text-[var(--color-secondary)]">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
