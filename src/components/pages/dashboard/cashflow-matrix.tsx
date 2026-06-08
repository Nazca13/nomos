'use client'

import { useTransactions } from '@/lib/transaction-store'
import { formatCurrency } from '@/lib/utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function CashflowMatrix() {
  const { transactions } = useTransactions()

  const now = new Date()
  // Last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { month: MONTHS[d.getMonth()], year: d.getFullYear(), monthIndex: d.getMonth() }
  })

  const data = months.map(({ month, year, monthIndex }) => {
    const monthTxs = transactions.filter((t) => {
      const d = new Date(t.timestamp)
      return d.getMonth() === monthIndex && d.getFullYear() === year
    })
    const income = monthTxs.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
    const expense = monthTxs.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)
    return { month, income, expense }
  })

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1)
  const totalIn = data.reduce((s, d) => s + d.income, 0)
  const totalOut = data.reduce((s, d) => s + d.expense, 0)

  return (
    <div className="px-5">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
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

        <div className="mt-3 flex gap-4">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">Income</span>
            <p className="font-financial text-[14px] font-bold text-white">{formatCurrency(totalIn)}</p>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">Expense</span>
            <p className="font-financial text-[14px] font-semibold text-[var(--color-secondary)]">{formatCurrency(totalOut)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-end gap-[6px]" style={{ height: 100 }}>
          {data.map((d) => {
            const incH = maxVal > 0 ? (d.income / maxVal) * 100 : 0
            const expH = maxVal > 0 ? (d.expense / maxVal) * 100 : 0
            return (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-end justify-center gap-[2px]" style={{ height: 80 }}>
                  <div
                    className="w-full max-w-[10px] rounded-t bg-white transition-all duration-500"
                    style={{ height: `${Math.max(incH, 1)}%` }}
                  />
                  <div
                    className="w-full max-w-[10px] rounded-t bg-[var(--color-tertiary)] transition-all duration-500"
                    style={{ height: `${Math.max(expH, 1)}%` }}
                  />
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
