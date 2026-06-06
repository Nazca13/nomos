'use client'

import { cn } from '@/lib/utils'

interface RadialProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  className?: string
}

function getAutoColor(value: number): string {
  if (value <= 50) return 'var(--color-positive)'
  if (value <= 80) return 'var(--color-warning)'
  return 'var(--color-negative)'
}

export function RadialProgress({
  value,
  size = 64,
  strokeWidth = 5,
  color,
  label,
  className,
}: RadialProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (clamped / 100) * circ
  const c = color ?? getAutoColor(clamped)

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-quaternary)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-financial text-[11px] font-bold" style={{ color: c }}>{clamped}%</span>
        {label && <span className="text-[8px] font-medium uppercase tracking-wider text-[var(--color-tertiary)]">{label}</span>}
      </div>
    </div>
  )
}
