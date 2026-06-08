'use client'

import { Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { useTransactions, type Transaction } from '@/lib/transaction-store'

interface TransactionDetailSheetProps {
  transaction: Transaction | null
  onClose: () => void
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="text-[12px] text-[var(--color-secondary)]">{label}</span>
      <span className={`text-right text-[12px] font-medium text-white ${mono ? 'font-financial' : ''}`}>{value}</span>
    </div>
  )
}

export function TransactionDetailSheet({ transaction, onClose }: TransactionDetailSheetProps) {
  const { deleteTransaction } = useTransactions()

  if (!transaction) return null

  const isIncome = transaction.type === 'INCOME'

  const handleDelete = () => {
    deleteTransaction(transaction.id)
    toast.success('Transaksi dihapus', {
      description: transaction.description,
    })
    onClose()
  }

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(transaction.timestamp))

  return (
    <BottomSheet open={!!transaction} onClose={onClose} title="Detail Transaksi">
      {/* Center amount */}
      <div className="mb-5 flex flex-col items-center gap-2 py-3">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            isIncome ? 'bg-[var(--color-positive)]/15' : 'bg-white/[0.06]'
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft className="h-7 w-7 text-[var(--color-positive)]" />
          ) : (
            <ArrowUpRight className="h-7 w-7 text-[var(--color-negative)]" />
          )}
        </div>
        <CurrencyDisplay
          amount={transaction.amount}
          type={isIncome ? 'income' : 'expense'}
          showSign
          size="lg"
        />
        <p className="text-[14px] font-semibold text-white">{transaction.description}</p>
      </div>

      {/* Details */}
      <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4">
        <DetailRow label="Jenis" value={isIncome ? 'Pemasukan' : 'Pengeluaran'} />
        <DetailRow label="Kategori" value={transaction.category} />
        <DetailRow label="Akun" value={transaction.accountName} />
        <DetailRow label="Waktu" value={formattedDate} />
        {transaction.rawPrompt && (
          <DetailRow label="Input AI" value={`"${transaction.rawPrompt}"`} mono />
        )}
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-negative)]/25 bg-[var(--color-negative)]/5 py-3.5 text-[13px] font-semibold text-[var(--color-negative)] transition-all active:bg-[var(--color-negative)]/15"
      >
        <Trash2 className="h-4 w-4" />
        Hapus Transaksi
      </button>
    </BottomSheet>
  )
}
