'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { VaultWidget } from '@/components/pages/dashboard/vault-widget'
import { QuickCommand } from '@/components/pages/dashboard/quick-command'
import { BudgetRadar } from '@/components/pages/dashboard/budget-radar'
import { CashflowMatrix } from '@/components/pages/dashboard/cashflow-matrix'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { AddTransactionSheet } from '@/components/pages/ledger/add-transaction-sheet'
import { useTransactions } from '@/lib/transaction-store'

export function DashboardPage() {
  const { transactions } = useTransactions()
  const [showAdd, setShowAdd] = useState(false)

  const recent = transactions.slice(0, 5)

  return (
    <>
      <div className="flex flex-col gap-5 animate-[fade-in_0.3s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-14">
          <div>
            <p className="text-[12px] text-[var(--color-secondary)]">Welcome back</p>
            <h1 className="text-[20px] font-bold tracking-tight text-white">NOMOS</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdd(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-secondary)] active:bg-[var(--color-card-hover)]"
              aria-label="Tambah transaksi"
            >
              <Plus className="h-4 w-4" />
            </button>
            <Image src="/favicon.ico" alt="NOMOS" width={32} height={32} className="rounded-xl" />
          </div>
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
            <h2 className="text-[13px] font-semibold text-white">Transaksi Terakhir</h2>
            <Link href="/ledger" className="text-[11px] font-medium text-[var(--color-secondary)]">
              Lihat semua
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="mt-4 flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-[13px] font-medium text-white">Belum ada transaksi</p>
              <p className="text-[11px] text-[var(--color-tertiary)]">
                Gunakan AI Chat atau tap + untuk mencatat
              </p>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-1 rounded-xl bg-white px-4 py-2 text-[12px] font-bold text-black"
              >
                + Mulai Sekarang
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-1">
              {recent.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors active:bg-[var(--color-card)]"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      tx.type === 'INCOME' ? 'bg-[var(--color-positive)]/10' : 'bg-white/[0.04]'
                    }`}
                  >
                    {tx.type === 'INCOME' ? (
                      <ArrowDownLeft className="h-4 w-4 text-[var(--color-positive)]" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-[var(--color-secondary)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-medium text-white">{tx.description}</p>
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
          )}
        </div>

        <div className="h-4" />
      </div>

      <AddTransactionSheet open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  )
}
