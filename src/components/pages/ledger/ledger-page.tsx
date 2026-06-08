'use client'

import { useState, useMemo } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { TableFilters } from '@/components/pages/ledger/table-filters'
import { TransactionTable } from '@/components/pages/ledger/transaction-table'
import { TransactionDetailSheet } from '@/components/pages/ledger/transaction-detail-sheet'
import { AddTransactionSheet } from '@/components/pages/ledger/add-transaction-sheet'
import { EmptyState } from '@/components/shared/empty-state'
import { useTransactions, type Transaction } from '@/lib/transaction-store'

type TxType = 'ALL' | 'INCOME' | 'EXPENSE'

export function LedgerPage() {
  const { transactions } = useTransactions()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TxType>('ALL')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = useMemo(() => {
    let d = [...transactions]
    if (typeFilter !== 'ALL') d = d.filter((t) => t.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      d = d.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.accountName.toLowerCase().includes(q)
      )
    }
    d.sort((a, b) => {
      const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortDir === 'desc' ? -diff : diff
    })
    return d
  }, [transactions, search, typeFilter, sortDir])

  return (
    <>
      <div className="flex flex-col gap-4 animate-[fade-in_0.3s_ease]">
        <PageHeader title="Ledger">
          <button
            onClick={() => setShowAdd(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black active:opacity-80"
            aria-label="Tambah transaksi"
          >
            <Plus className="h-4 w-4" />
          </button>
        </PageHeader>

        <div className="px-5">
          <TableFilters
            searchQuery={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            sortDirection={sortDir}
            onSortToggle={() => setSortDir((p) => (p === 'desc' ? 'asc' : 'desc'))}
          />
        </div>

        <div className="px-3">
          {filtered.length > 0 ? (
            <>
              <TransactionTable data={filtered} onRowClick={setSelectedTx} />
              <p className="mt-3 text-center font-financial text-[10px] text-[var(--color-tertiary)]">
                {filtered.length} transaksi
              </p>
            </>
          ) : (
            <EmptyState
              icon={<BookOpen className="h-5 w-5" />}
              title={transactions.length === 0 ? 'Belum ada transaksi' : 'Tidak ditemukan'}
              description={
                transactions.length === 0
                  ? 'Catat via AI Command Center atau tap tombol + di atas.'
                  : 'Coba kata kunci lain.'
              }
              action={
                transactions.length === 0 ? (
                  <button
                    onClick={() => setShowAdd(true)}
                    className="rounded-xl bg-white px-4 py-2 text-[12px] font-bold text-black"
                  >
                    + Tambah Pertama
                  </button>
                ) : undefined
              }
            />
          )}
        </div>
      </div>

      {/* Bottom Sheets */}
      <TransactionDetailSheet transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      <AddTransactionSheet open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  )
}
