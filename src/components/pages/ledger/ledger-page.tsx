'use client'

import { useState, useMemo } from 'react'
import { BookOpen } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { TableFilters } from '@/components/pages/ledger/table-filters'
import { TransactionTable, type TransactionRow } from '@/components/pages/ledger/transaction-table'
import { EmptyState } from '@/components/shared/empty-state'

const MOCK: TransactionRow[] = [
  { id: '1', description: 'Gaji Bulanan', amount: 8_500_000, type: 'INCOME', category: 'Salary', accountName: 'BCA', timestamp: '2026-06-01T09:00:00Z' },
  { id: '2', description: 'Kopi Starbucks', amount: 55_000, type: 'EXPENSE', category: 'Food', accountName: 'Gopay', timestamp: '2026-06-02T10:30:00Z', rawPrompt: 'beli kopi 55rb pake gopay' },
  { id: '3', description: 'Grab ke Kantor', amount: 32_000, type: 'EXPENSE', category: 'Transport', accountName: 'Gopay', timestamp: '2026-06-02T07:45:00Z' },
  { id: '4', description: 'Listrik PLN', amount: 450_000, type: 'EXPENSE', category: 'Utilities', accountName: 'BCA', timestamp: '2026-06-03T14:00:00Z' },
  { id: '5', description: 'Transfer dari Sipa', amount: 150_000, type: 'INCOME', category: 'Transfer', accountName: 'BCA', timestamp: '2026-06-03T16:20:00Z' },
  { id: '6', description: 'Makan Siang Warteg', amount: 25_000, type: 'EXPENSE', category: 'Food', accountName: 'Cash', timestamp: '2026-06-04T12:30:00Z' },
  { id: '7', description: 'Netflix', amount: 186_000, type: 'EXPENSE', category: 'Entertainment', accountName: 'BCA', timestamp: '2026-06-05T00:00:00Z' },
  { id: '8', description: 'Freelance Project', amount: 2_500_000, type: 'INCOME', category: 'Freelance', accountName: 'BCA', timestamp: '2026-06-05T15:00:00Z' },
  { id: '9', description: 'Bensin Motor', amount: 50_000, type: 'EXPENSE', category: 'Transport', accountName: 'Cash', timestamp: '2026-06-06T08:00:00Z' },
  { id: '10', description: 'Skincare', amount: 180_000, type: 'EXPENSE', category: 'Personal', accountName: 'Gopay', timestamp: '2026-06-06T19:00:00Z' },
]

type TxType = 'ALL' | 'INCOME' | 'EXPENSE'

export function LedgerPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TxType>('ALL')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let d = [...MOCK]
    if (typeFilter !== 'ALL') d = d.filter((t) => t.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      d = d.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.accountName.toLowerCase().includes(q))
    }
    d.sort((a, b) => {
      const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortDir === 'desc' ? -diff : diff
    })
    return d
  }, [search, typeFilter, sortDir])

  return (
    <div className="flex flex-col gap-4 animate-[fade-in_0.3s_ease]">
      <PageHeader title="Ledger" />
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
            <TransactionTable data={filtered} />
            <p className="mt-3 text-center text-[10px] text-[var(--color-tertiary)]">
              {filtered.length} transactions
            </p>
          </>
        ) : (
          <EmptyState icon={<BookOpen className="h-5 w-5" />} title="No transactions" description={search ? 'Try different search.' : 'Add via AI Command Center.'} />
        )}
      </div>
    </div>
  )
}
