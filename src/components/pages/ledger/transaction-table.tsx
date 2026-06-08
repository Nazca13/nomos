'use client'

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { formatDate } from '@/lib/utils'
import { type Transaction } from '@/lib/transaction-store'

interface TransactionTableProps {
  data: Transaction[]
  onRowClick?: (tx: Transaction) => void
}

export function TransactionTable({ data, onRowClick }: TransactionTableProps) {
  if (data.length === 0) return null

  return (
    <div className="flex flex-col gap-0.5">
      {data.map((tx) => (
        <button
          key={tx.id}
          onClick={() => onRowClick?.(tx)}
          className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors active:bg-[var(--color-card)]"
        >
          {/* Icon */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              tx.type === 'INCOME' ? 'bg-[var(--color-positive)]/10' : 'bg-white/[0.04]'
            }`}
          >
            {tx.type === 'INCOME' ? (
              <ArrowDownLeft className="h-4 w-4 text-[var(--color-positive)]" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-[var(--color-secondary)]" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] font-medium text-white">{tx.description}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-[10px] text-[var(--color-tertiary)]">{tx.category}</span>
              <span className="text-[10px] text-[var(--color-quaternary)]">·</span>
              <span className="text-[10px] text-[var(--color-tertiary)]">{tx.accountName}</span>
            </div>
          </div>

          {/* Amount + date */}
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <CurrencyDisplay
              amount={tx.amount}
              type={tx.type === 'INCOME' ? 'income' : 'expense'}
              showSign
              size="sm"
            />
            <span className="font-financial text-[9px] text-[var(--color-tertiary)]">
              {formatDate(tx.timestamp)}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
