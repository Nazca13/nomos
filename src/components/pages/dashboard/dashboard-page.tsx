'use client'

import Image from 'next/image'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { VaultWidget } from '@/components/pages/dashboard/vault-widget'
import { QuickCommand } from '@/components/pages/dashboard/quick-command'
import { BudgetRadar } from '@/components/pages/dashboard/budget-radar'
import { CashflowMatrix } from '@/components/pages/dashboard/cashflow-matrix'
import { CurrencyDisplay } from '@/components/shared/currency-display'
const RECENT_TX = [
  { id: '1', desc: 'Kopi Starbucks', amount: 55_000, type: 'EXPENSE' as const, category: 'Food', time: '2026-06-06T10:30:00Z' },
  { id: '2', desc: 'Gaji Bulanan', amount: 8_500_000, type: 'INCOME' as const, category: 'Salary', time: '2026-06-01T09:00:00Z' },
  { id: '3', desc: 'Grab ke Kantor', amount: 32_000, type: 'EXPENSE' as const, category: 'Transport', time: '2026-06-05T07:45:00Z' },
]

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 animate-[fade-in_0.3s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14">
        <div>
          <p className="text-[12px] text-[var(--color-secondary)]">Welcome back</p>
          <h1 className="text-[20px] font-bold tracking-tight text-white">NOMOS</h1>
        </div>
        <Image src="/favicon.ico" alt="NOMOS" width={32} height={32} className="rounded-xl" />
      </div>

      {/* Balance */}
      <div className="px-5">
        <VaultWidget />
      </div>

      {/* Quick Command */}
      <QuickCommand />

      {/* Budget Radar */}
      <BudgetRadar />

      {/* Cashflow */}
      <CashflowMatrix />

      {/* Recent Transactions */}
      <div className="px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-white">Recent Transactions</h2>
          <a href="/ledger" className="text-[11px] font-medium text-[var(--color-secondary)]">See all</a>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          {RECENT_TX.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors active:bg-[var(--color-card)]">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tx.type === 'INCOME' ? 'bg-[var(--color-positive)]/10' : 'bg-white/[0.04]'}`}>
                {tx.type === 'INCOME' ? (
                  <ArrowDownLeft className="h-4 w-4 text-[var(--color-positive)]" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-secondary)]" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-white">{tx.desc}</p>
                <p className="text-[10px] text-[var(--color-tertiary)]">{tx.category}</p>
              </div>
              <CurrencyDisplay
                amount={tx.amount}
                type={tx.type === 'INCOME' ? 'income' : 'expense'}
                showSign
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  )
}
