'use client'

import { Search, ArrowUp, ArrowDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type TxType = 'ALL' | 'INCOME' | 'EXPENSE'

interface TableFiltersProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  typeFilter: TxType
  onTypeFilterChange: (t: TxType) => void
  sortDirection: 'asc' | 'desc'
  onSortToggle: () => void
}

const types: { value: TxType; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'INCOME', label: 'In' },
  { value: 'EXPENSE', label: 'Out' },
]

export function TableFilters({ searchQuery, onSearchChange, typeFilter, onTypeFilterChange, sortDirection, onSortToggle }: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="h-3.5 w-3.5" />}
        id="ledger-search-input"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[3px]">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeFilterChange(t.value)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-[11px] font-semibold transition-all duration-200',
                typeFilter === t.value ? 'bg-[var(--color-foreground)] text-[var(--color-background)]' : 'text-[var(--color-tertiary)]'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={onSortToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)]"
          aria-label="Sort"
        >
          {sortDirection === 'desc' ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}
