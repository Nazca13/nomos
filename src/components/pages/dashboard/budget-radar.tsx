'use client'

import { RadialProgress } from '@/components/ui/radial-progress'
import { useTransactions } from '@/lib/transaction-store'
import { formatCurrency } from '@/lib/utils'

const BUDGET_LIMITS: Record<string, number> = {
  Food: 2_000_000,
  Transport: 500_000,
  Utilities: 1_000_000,
  Shopping: 1_500_000,
  Entertainment: 500_000,
}

export function BudgetRadar() {
  const { transactions } = useTransactions()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyExpenses = transactions.filter((t) => {
    const d = new Date(t.timestamp)
    return t.type === 'EXPENSE' && d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const budgets = Object.entries(BUDGET_LIMITS).map(([category, limit]) => {
    const spent = monthlyExpenses
      .filter((t) => t.category === category)
      .reduce((s, t) => s + t.amount, 0)
    return { category, spent, limit }
  })

  const hasData = budgets.some((b) => b.spent > 0)

  return (
    <div className="px-5">
      <h2 className="mb-3 text-[13px] font-semibold text-white">Budget Radar</h2>
      {!hasData && (
        <p className="mb-3 text-[11px] text-[var(--color-tertiary)]">
          Catat pengeluaran untuk melihat progres budget.
        </p>
      )}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {budgets.map((b) => {
          const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100)
          const remaining = b.limit - b.spent
          return (
            <div
              key={b.category}
              className="flex min-w-[140px] shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
            >
              <RadialProgress value={pct} size={56} strokeWidth={4} />
              <span className="text-[12px] font-semibold text-white">{b.category}</span>
              <span className="font-financial text-[10px] text-[var(--color-secondary)]">
                {remaining >= 0 ? `${formatCurrency(remaining)} left` : 'Over budget'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
