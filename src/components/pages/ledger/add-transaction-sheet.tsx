'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { useTransactions } from '@/lib/transaction-store'
import { cn } from '@/lib/utils'

interface AddTransactionSheetProps {
  open: boolean
  onClose: () => void
}

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Gadget', 'Personal', 'Other']
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Transfer', 'Investment', 'Bonus', 'Other']
const ACCOUNTS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Gopay', 'OVO', 'Dana', 'ShopeePay', 'Cash']

export function AddTransactionSheet({ open, onClose }: AddTransactionSheetProps) {
  const { addTransaction, totalBalance } = useTransactions()
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('Cash')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const reset = () => {
    setAmount('')
    setDescription('')
    setCategory('')
    setAccount('Cash')
    setType('EXPENSE')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ''))
    if (!parsedAmount || !description.trim() || !category) {
      toast.error('Lengkapi semua field')
      return
    }

    if (type === 'EXPENSE' && parsedAmount > totalBalance) {
      toast.error('Saldo Tidak Cukup!', {
        description: `Saldo (Rp ${totalBalance.toLocaleString('id-ID')}) kurang untuk transaksi ini.`
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 300)) // micro-delay for UX
    addTransaction({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category: category || 'Other',
      accountName: account,
    })
    toast.success(type === 'INCOME' ? 'Pemasukan dicatat ✓' : 'Pengeluaran dicatat ✓', {
      description: `${description} • ${account}`,
    })
    setIsSubmitting(false)
    handleClose()
  }

  // Format amount as rupiah while typing
  const handleAmountChange = (v: string) => {
    const raw = v.replace(/[^0-9]/g, '')
    setAmount(raw)
  }

  const displayAmount = amount
    ? new Intl.NumberFormat('id-ID').format(Number(amount))
    : ''

  return (
    <BottomSheet open={open} onClose={handleClose} title="Tambah Transaksi">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Type toggle */}
        <div className="flex rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-[3px]">
          {(['EXPENSE', 'INCOME'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setCategory('') }}
              className={cn(
                'flex-1 rounded-lg py-2.5 text-[12px] font-bold transition-all duration-200',
                type === t
                  ? t === 'EXPENSE'
                    ? 'bg-[var(--color-negative)]/90 text-[var(--color-background)]'
                    : 'bg-[var(--color-positive)]/90 text-black'
                  : 'text-[var(--color-tertiary)]'
              )}
            >
              {t === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">
            Nominal
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-financial text-[14px] text-[var(--color-secondary)]">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={displayAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent font-financial text-[20px] font-bold text-[var(--color-foreground)] focus:outline-none placeholder:text-[var(--color-quaternary)]"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">
            Keterangan
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Makan siang Padang"
            className="mt-1 w-full bg-transparent text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-quaternary)] focus:outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">
            Kategori
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all',
                  category === c
                    ? 'bg-[var(--color-foreground)] text-[var(--color-background)]'
                    : 'border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-secondary)]'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">
            Akun
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ACCOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAccount(a)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all',
                  account === a
                    ? 'bg-[var(--color-foreground)] text-[var(--color-background)]'
                    : 'border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-secondary)]'
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-2xl bg-[var(--color-foreground)] py-4 text-[14px] font-bold text-[var(--color-background)] transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>
    </BottomSheet>
  )
}
