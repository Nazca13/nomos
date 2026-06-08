'use client'

import Image from 'next/image'
import { Landmark, Wallet, Banknote } from 'lucide-react'
import { BentoCard } from '@/components/ui/bento-card'
import { StatValue } from '@/components/ui/stat-value'
import { Sparkline } from '@/components/ui/sparkline'
import { useTransactions } from '@/lib/transaction-store'
import { formatCurrency } from '@/lib/utils'

const TREND_PLACEHOLDER = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export function VaultWidget() {
  const { totalBalance, totalIncome, totalExpense, transactions } = useTransactions()

  // Build sparkline from last 13 running balances
  const sparkData = (() => {
    if (transactions.length === 0) return TREND_PLACEHOLDER
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    let running = 0
    const points = sorted.map((tx) => {
      running += tx.type === 'INCOME' ? tx.amount : -tx.amount
      return running / 1_000_000
    })
    // Pad or trim to 13 points
    if (points.length < 2) return [0, ...points]
    return points.slice(-13)
  })()

  const trendPct = (() => {
    if (transactions.length < 2) return null
    const last = sparkData[sparkData.length - 1]
    const prev = sparkData[sparkData.length - 2]
    if (prev === 0) return null
    return (((last - prev) / Math.abs(prev)) * 100).toFixed(1)
  })()

  const ACCOUNTS = [
    {
      name: 'BCA',
      icon: Landmark,
      balance: transactions.filter((t) => t.accountName === 'BCA').reduce((s, t) => s + (t.type === 'INCOME' ? t.amount : -t.amount), 0),
    },
    {
      name: 'Gopay',
      icon: Wallet,
      balance: transactions.filter((t) => t.accountName === 'Gopay').reduce((s, t) => s + (t.type === 'INCOME' ? t.amount : -t.amount), 0),
    },
    {
      name: 'Cash',
      icon: Banknote,
      balance: transactions.filter((t) => t.accountName === 'Cash').reduce((s, t) => s + (t.type === 'INCOME' ? t.amount : -t.amount), 0),
    },
  ]

  return (
    <BentoCard className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-tertiary)]">
          Total Balance
        </span>
        <Image src="/favicon.ico" alt="NOMOS" width={20} height={20} className="rounded opacity-40" />
      </div>

      <div className="mt-3 flex items-end justify-between">
        <StatValue
          value={formatCurrency(totalBalance)}
          trend={trendPct ? (Number(trendPct) >= 0 ? 'positive' : 'negative') : 'neutral'}
          trendText={trendPct ? `${Number(trendPct) >= 0 ? '+' : ''}${trendPct}%` : undefined}
          size="lg"
        />
        <Sparkline data={sparkData} width={80} height={32} color="#fff" className="opacity-60" />
      </div>

      {/* Income / Expense summary */}
      <div className="mt-3 flex gap-3">
        <div className="flex-1 rounded-xl bg-[var(--color-positive)]/8 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-positive)]/70">Income</p>
          <p className="font-financial text-[13px] font-bold text-[var(--color-positive)]">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="flex-1 rounded-xl bg-white/[0.04] px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-secondary)]">Expense</p>
          <p className="font-financial text-[13px] font-bold text-white">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      {/* Account scroll */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
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
