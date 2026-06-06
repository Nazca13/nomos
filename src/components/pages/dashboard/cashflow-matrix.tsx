'use client'

import { formatCurrency } from '@/lib/utils'

const DATA = [
  { month: 'Jan', income: 8_500_000, expense: 6_200_000 },
  { month: 'Feb', income: 8_500_000, expense: 7_100_000 },
  { month: 'Mar', income: 9_000_000, expense: 5_800_000 },
  { month: 'Apr', income: 8_500_000, expense: 6_900_000 },
  { month: 'May', income: 8_800_000, expense: 7_500_000 },
  { month: 'Jun', income: 9_200_000, expense: 6_400_000 },
]

export function CashflowMatrix() {
  const maxVal = Math.max(...DATA.flatMap((d) => [d.income, d.expense]))
  const totalIn = DATA.reduce((s, d) => s + d.income, 0)
  const totalOut = DATA.reduce((s, d) => s + d.expense, 0)

  return (
    <div className="px-5">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-white">Cashflow</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="text-[9px] text-[var(--color-secondary)]">In</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-tertiary)]" />
              <span className="text-[9px] text-[var(--color-secondary)]">Out</span>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-3 flex gap-4">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-[var(--color-tertiary)]">Income</span>
            <p className="font-financial text-[14px] font-bold text-white">{formatCurrency(totalIn)}</p>
          </div>
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-[var(--color-tertiary)]">Expense</span>
            <p className="font-financial text-[14px] font-semibold text-[var(--color-secondary)]">{formatCurrency(totalOut)}</p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="mt-4 flex items-end gap-[6px]" style={{ height: 100 }}>
          {DATA.map((d) => {
            const incH = (d.income / maxVal) * 100
            const expH = (d.expense / maxVal) * 100
            return (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-end justify-center gap-[2px]" style={{ height: 80 }}>
                  <div className="w-full max-w-[10px] rounded-t bg-white" style={{ height: `${incH}%` }} />
                  <div className="w-full max-w-[10px] rounded-t bg-[var(--color-tertiary)]" style={{ height: `${expH}%` }} />
                </div>
                <span className="text-[9px] font-medium text-[var(--color-tertiary)]">{d.month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
