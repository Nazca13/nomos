'use client'

import { RadialProgress } from '@/components/ui/radial-progress'
import { formatCurrency } from '@/lib/utils'

const BUDGETS = [
  { category: 'Food', spent: 1_650_000, limit: 2_000_000 },
  { category: 'Transport', spent: 280_000, limit: 500_000 },
  { category: 'Utilities', spent: 920_000, limit: 1_000_000 },
]

export function BudgetRadar() {
  return (
    <div className="px-5">
      <h2 className="mb-3 text-[13px] font-semibold text-white">
        Budget Radar
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {BUDGETS.map((b) => {
          const pct = Math.round((b.spent / b.limit) * 100)
          const remaining = b.limit - b.spent
          return (
            <div
              key={b.category}
              className="flex min-w-[140px] shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
            >
              <RadialProgress value={pct} size={56} strokeWidth={4} />
              <span className="text-[12px] font-semibold text-white">{b.category}</span>
              <span className="font-financial text-[10px] text-[var(--color-secondary)]">
                {remaining > 0 ? `${formatCurrency(remaining)} left` : 'Over budget'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
