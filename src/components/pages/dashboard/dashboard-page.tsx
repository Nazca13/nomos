'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight, Plus, ShieldAlert, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { VaultWidget } from '@/components/pages/dashboard/vault-widget'
import { QuickCommand } from '@/components/pages/dashboard/quick-command'
import { BudgetRadar } from '@/components/pages/dashboard/budget-radar'
import { CashflowMatrix } from '@/components/pages/dashboard/cashflow-matrix'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { AddTransactionSheet } from '@/components/pages/ledger/add-transaction-sheet'
import { useTransactions, type Transaction } from '@/lib/transaction-store'
import { useSubscriptions } from '@/lib/subscription-store'
import { formatCurrency } from '@/lib/utils'

// ─── AI Audit Node Analyzer ──────────────────────────────────────────────────
function runFinancialAudit(transactions: Transaction[]): string[] {
  const logs: string[] = []
  
  if (transactions.length === 0) {
    return ['[SYSTEM_CHECK]: Ledger empty. Initialize transactions to enable audit node.']
  }

  const expenses = transactions.filter(t => t.type === 'EXPENSE')
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)
  
  if (expenses.length === 0) {
    return ['[SYSTEM_CHECK]: Cashflow nodes green. No expenses tracked in active ledger.']
  }

  // 1. Single Large Expense Check
  const avgExpense = totalExpense / expenses.length
  const largeExpenses = expenses.filter(t => t.amount > avgExpense * 2.5)
  
  if (largeExpenses.length > 0) {
    largeExpenses.slice(0, 2).forEach(tx => {
      logs.push(
        `[WARNING]: Outlier expense detected on '${tx.description}' for ${formatCurrency(tx.amount)}. Value exceeds 2.5x standard average.`
      )
    })
  }

  // 2. Category Concentration Check
  const categoryTotals: Record<string, number> = {}
  expenses.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
  })

  Object.entries(categoryTotals).forEach(([category, total]) => {
    const ratio = total / totalExpense
    if (ratio > 0.5 && totalExpense > 200000) {
      logs.push(
        `[WARNING]: Critical concentration in '${category}' (${(ratio * 100).toFixed(0)}% of outflow). Portfolio allocation imbalanced.`
      )
    }
  })

  // 3. Micro-transaction Frequency Leak Check
  const categoryCounts: Record<string, number> = {}
  expenses.forEach((tx) => {
    categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1
  })

  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count >= 4) {
      logs.push(
        `[NOTICE]: Micro-outflow leak detected in '${category}' (${count} events). Analyze billing nodes for subscription leaks.`
      )
    }
  })

  if (logs.length === 0) {
    logs.push('[SYSTEM_CHECK]: All cashflow nodes functioning within normal parameters. No leak detected.')
  }

  return logs
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────
export function DashboardPage() {
  const { transactions } = useTransactions()
  const { upcomingBills } = useSubscriptions()
  const [showAdd, setShowAdd] = useState(false)
  const [auditLogs, setAuditLogs] = useState<string[]>([])

  const recent = transactions.slice(0, 5)

  // Run audit scanning on transaction changes
  useEffect(() => {
    const logs = runFinancialAudit(transactions)
    setAuditLogs(logs)
  }, [transactions])

  return (
    <>
      <div className="flex flex-col gap-5 animate-[fade-in_0.3s_ease] pb-24">
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

        {/* Subscription Overdue Warnings */}
        {upcomingBills.length > 0 && (
          <div className="px-5">
            <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-negative)]/20 bg-[var(--color-negative)]/5 p-3.5 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[var(--color-negative)]">
                <Bell className="h-3.5 w-3.5" />
                Peringatan Tagihan Rutin
              </div>
              {upcomingBills.map(({ sub, daysLeft }) => (
                <p key={sub.id} className="text-[var(--color-secondary)]">
                  Paket <span className="font-bold text-white">{sub.name}</span> ({formatCurrency(sub.amount)}) akan memotong saldo <span className="font-bold text-white">{sub.account}</span> dalam {daysLeft === 0 ? 'hari ini' : `${daysLeft * 24} jam`}.
                </p>
              ))}
            </div>
          </div>
        )}

        {/* AI Audit Terminal Console */}
        <div className="px-5">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 font-mono text-[11px] leading-relaxed">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-2">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-white">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                NOMOS Audit Console
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-wider text-[var(--color-tertiary)] font-bold">Secured</span>
              </div>
            </div>
            
            <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
              {auditLogs.map((log, index) => {
                const isWarning = log.includes('[WARNING]')
                const isNotice = log.includes('[NOTICE]')
                const color = isWarning ? 'text-[var(--color-negative)]' : isNotice ? 'text-amber-400' : 'text-[var(--color-secondary)]'
                
                return (
                  <div key={index} className="flex gap-1.5">
                    <span className="text-[var(--color-tertiary)] shrink-0">&gt;</span>
                    <span className={color}>{log}</span>
                  </div>
                )
              })}
            </div>
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
