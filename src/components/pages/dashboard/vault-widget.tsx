'use client'

import Image from 'next/image'
import { BentoCard } from '@/components/ui/bento-card'
import { StatValue } from '@/components/ui/stat-value'
import { Sparkline } from '@/components/ui/sparkline'
import { Landmark, Wallet, Banknote } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const ACCOUNTS = [
  { name: 'BCA', type: 'BANK', balance: 12_450_000, icon: Landmark },
  { name: 'Gopay', type: 'EWALLET', balance: 850_000, icon: Wallet },
  { name: 'Cash', type: 'CASH', balance: 320_000, icon: Banknote },
]

const TREND = [12.1, 11.8, 12.2, 12.0, 11.9, 12.3, 12.45, 12.6, 12.45, 13.0, 12.8, 13.2, 13.62]

const total = ACCOUNTS.reduce((s, a) => s + a.balance, 0)

export function VaultWidget() {
  return (
    <BentoCard className="relative overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-tertiary)]">
          Total Balance
        </span>
        <Image src="/favicon.ico" alt="NOMOS" width={20} height={20} className="rounded opacity-40" />
      </div>

      {/* Balance */}
      <div className="mt-3 flex items-end justify-between">
        <StatValue value={formatCurrency(total)} trend="positive" trendText="+3.2%" size="lg" />
        <Sparkline data={TREND} width={80} height={32} color="#fff" className="opacity-60" />
      </div>

      {/* Account scroll */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {ACCOUNTS.map((acc) => {
          const Icon = acc.icon
          return (
            <div
              key={acc.name}
              className="flex min-w-[110px] shrink-0 flex-col gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3 w-3 text-[var(--color-tertiary)]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-secondary)]">
                  {acc.name}
                </span>
              </div>
              <span className="font-financial text-[13px] font-bold text-white">
                {formatCurrency(acc.balance)}
              </span>
            </div>
          )
        })}
      </div>
    </BentoCard>
  )
}
