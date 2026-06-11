'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { getTransactions, createTransaction, deleteTransaction as deleteDbTransaction } from '@/app/actions'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category: string
  accountName: string
  timestamp: string
  rawPrompt?: string | null
}

interface State {
  transactions: Transaction[]
}

type Action =
  | { type: 'ADD'; payload: Transaction }
  | { type: 'DELETE'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: Transaction[] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return { transactions: [action.payload, ...state.transactions] }
    case 'DELETE':
      return { transactions: state.transactions.filter((t) => t.id !== action.payload) }
    case 'CLEAR':
      return { transactions: [] }
    case 'HYDRATE':
      return { transactions: action.payload }
    default:
      return state
  }
}

interface TransactionContextValue {
  transactions: Transaction[]
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => Transaction
  deleteTransaction: (id: string) => void
  clearAll: () => void
  totalBalance: number
  totalIncome: number
  totalExpense: number
}

const TransactionContext = createContext<TransactionContextValue | null>(null)

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { transactions: [] })

  // Hydrate from DB once
  useEffect(() => {
    async function fetchTxs() {
      try {
        const data = await getTransactions()
        const mapped = data.map(t => ({ ...t, timestamp: new Date(t.timestamp).toISOString() }))
        dispatch({ type: 'HYDRATE', payload: mapped as any })
      } catch (e) {
        console.error('Failed to load txs', e)
      }
    }
    fetchTxs()
  }, [])

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
    const full: Transaction = {
      ...tx,
      id: crypto.randomUUID(), // optimistic ID
      timestamp: new Date().toISOString(),
    }
    dispatch({ type: 'ADD', payload: full })
    
    // DB
    createTransaction(tx).catch(e => console.error('Failed to save tx', e))
    
    return full
  }

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE', payload: id })
    deleteDbTransaction(id).catch(e => console.error('Failed to delete tx', e))
  }
  const clearAll = () => dispatch({ type: 'CLEAR' })

  const { totalIncome, totalExpense } = state.transactions.reduce(
    (acc, t) => {
      if (t.type === 'INCOME') acc.totalIncome += t.amount
      else acc.totalExpense += t.amount
      return acc
    },
    { totalIncome: 0, totalExpense: 0 }
  )

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        addTransaction,
        deleteTransaction,
        clearAll,
        totalBalance: totalIncome - totalExpense,
        totalIncome,
        totalExpense,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactions must be inside TransactionProvider')
  return ctx
}
