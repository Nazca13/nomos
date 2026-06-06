import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-tertiary)]">
          {icon}
        </div>
      )}
      <input
        className={cn(
          'h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[14px] text-white placeholder:text-[var(--color-tertiary)] transition-colors duration-200',
          'focus:border-[var(--color-border-hover)] focus:outline-none',
          icon && 'pl-9',
          className
        )}
        {...props}
      />
    </div>
  )
}
