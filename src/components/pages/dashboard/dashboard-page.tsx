'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight, Plus, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { VaultWidget } from '@/components/pages/dashboard/vault-widget'
import { AddTransactionSheet } from '@/components/pages/ledger/add-transaction-sheet'
import { BudgetRadar } from '@/components/pages/dashboard/budget-radar'
import { CashflowMatrix } from '@/components/pages/dashboard/cashflow-matrix'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { useTransactions, type Transaction } from '@/lib/transaction-store'
import { useSubscriptions } from '@/lib/subscription-store'
import { useUser } from '@/lib/user-store'
import { formatCurrency } from '@/lib/utils'

// ─── Simplified Audit Analyzer (beginner-friendly messages) ──────────────────
function runSimpleAudit(transactions: Transaction[]): { type: 'ok' | 'warning' | 'info'; message: string }[] {
  const results: { type: 'ok' | 'warning' | 'info'; message: string }[] = []

  if (transactions.length === 0) {
    return [{ type: 'info', message: 'Belum ada transaksi. Yuk mulai catat keuangan kamu! 📝' }]
  }

  const expenses = transactions.filter(t => t.type === 'EXPENSE')
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)

  if (expenses.length === 0) {
    return [{ type: 'ok', message: 'Semua aman! Belum ada pengeluaran tercatat. ✅' }]
  }

  // 1. Large expense check
  const avgExpense = totalExpense / expenses.length
  const largeExpenses = expenses.filter(t => t.amount > avgExpense * 2.5)

  if (largeExpenses.length > 0) {
    const tx = largeExpenses[0]
    results.push({
      type: 'warning',
      message: `Pengeluaran besar terdeteksi: "${tx.description}" sebesar ${formatCurrency(tx.amount)} ⚠️`
    })
  }

  // 2. Category concentration
  const categoryTotals: Record<string, number> = {}
  expenses.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
  })

  Object.entries(categoryTotals).forEach(([category, total]) => {
    const ratio = total / totalExpense
    if (ratio > 0.5 && totalExpense > 200000) {
      results.push({
        type: 'warning',
        message: `Pengeluaran kategori "${category}" cukup tinggi (${(ratio * 100).toFixed(0)}% dari total) 📊`
      })
    }
  })

  // 3. Micro-transaction check
  const categoryCounts: Record<string, number> = {}
  expenses.forEach((tx) => {
    categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1
  })

  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count >= 4) {
      results.push({
        type: 'info',
        message: `Banyak transaksi kecil di "${category}" (${count}x). Coba perhatikan pengeluaran rutin kamu 🔍`
      })
    }
  })

  if (results.length === 0) {
    results.push({ type: 'ok', message: 'Keuangan kamu terlihat sehat! Pertahankan ya! 💪' })
  }

  return results
}

// ─── Helper: Greeting based on time of day ───────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat Pagi'
  if (hour < 17) return 'Selamat Siang'
  if (hour < 20) return 'Selamat Sore'
  return 'Selamat Malam'
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────
export function DashboardPage() {
  const { transactions } = useTransactions()
  const { upcomingBills } = useSubscriptions()
  const { userName } = useUser()
  const [showAdd, setShowAdd] = useState(false)
  const [auditResults, setAuditResults] = useState<{ type: 'ok' | 'warning' | 'info'; message: string }[]>([])

  const recent = transactions.slice(0, 5)

  useEffect(() => {
    const results = runSimpleAudit(transactions)
    setAuditResults(results)
  }, [transactions])

  return (
    <>
      <div className="flex flex-col gap-5 animate-[fade-in_0.3s_ease] pb-24">
        {/* Header — Logo left, actions right */}
        <div className="flex items-center justify-between px-5 pt-14">
          <div className="flex items-center gap-3">
            <Image src="/logo1.png" alt="NOMOS" width={36} height={36} className="rounded-xl" />
            <div>
              <p className="text-[11px] text-[var(--color-secondary)]">{getGreeting()} 👋</p>
              <h1 className="text-[18px] font-bold tracking-tight text-[var(--color-foreground)]">
                {userName || 'NOMOS'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Add transaction */}
            <button
              onClick={() => setShowAdd(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-secondary)] active:scale-95 transition-all"
              style={{ background: 'var(--color-card)' }}
              aria-label="Tambah transaksi"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Subscription Overdue Warnings */}
        {upcomingBills.length > 0 && (
          <div className="px-5">
            <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-negative)]/20 p-3.5 text-[12px] leading-relaxed" style={{ background: 'color-mix(in srgb, var(--color-negative) 5%, transparent)' }}>
              <div className="flex items-center gap-1.5 font-bold text-[var(--color-negative)]">
                <Bell className="h-3.5 w-3.5" />
                Tagihan Segera Jatuh Tempo
              </div>
              {upcomingBills.map(({ sub, daysLeft }) => (
                <p key={sub.id} className="text-[var(--color-secondary)]">
                  <span className="font-semibold text-[var(--color-foreground)]">{sub.name}</span> ({formatCurrency(sub.amount)}) — {daysLeft === 0 ? 'Hari ini!' : `${daysLeft} hari lagi`}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Smart Insight Card (simplified audit) */}
        {auditResults.length > 0 && (
          <div className="px-5">
            <div className="rounded-2xl border border-[var(--color-border)] p-4" style={{ background: 'var(--color-card)' }}>
              <h3 className="text-[12px] font-semibold text-[var(--color-foreground)] mb-2">💡 Insight Keuangan</h3>
              <div className="space-y-1.5">
                {auditResults.slice(0, 2).map((result, index) => (
                  <p key={index} className="text-[12px] leading-relaxed text-[var(--color-secondary)]">
                    {result.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Balance */}
        <div className="px-5">
          <VaultWidget />
        </div>


        {/* Budget Radar */}
        <BudgetRadar />

        {/* Cashflow */}
        <CashflowMatrix />

        {/* Recent Transactions */}
        <div className="px-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[var(--color-foreground)]">Transaksi Terakhir</h2>
            <Link href="/ledger" className="text-[11px] font-medium text-[var(--color-secondary)]">
              Lihat semua
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="mt-4 flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-[13px] font-medium text-[var(--color-foreground)]">Belum ada transaksi</p>
              <p className="text-[11px] text-[var(--color-tertiary)]">
                Ketik di AI Chat atau tap + untuk mulai mencatat
              </p>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-1 rounded-xl px-4 py-2 text-[12px] font-bold transition-opacity active:opacity-80"
                style={{ background: 'var(--color-foreground)', color: 'var(--color-background)' }}
              >
                + Mulai Catat
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-1">
              {recent.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors"
                  style={{ background: 'transparent' }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: tx.type === 'INCOME'
                        ? 'color-mix(in srgb, var(--color-positive) 10%, transparent)'
                        : 'color-mix(in srgb, var(--color-foreground) 4%, transparent)'
                    }}
                  >
                    {tx.type === 'INCOME' ? (
                      <ArrowDownLeft className="h-4 w-4 text-[var(--color-positive)]" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-[var(--color-secondary)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-medium text-[var(--color-foreground)]">{tx.description}</p>
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
