// TypeScript interfaces mirroring all Prisma models
// These provide type safety throughout the application without requiring
// Prisma client imports in every file.

// ─── Enums / Literal Types ────────────────────────────────────────────────────

export type AccountType = 'BANK' | 'EWALLET' | 'CASH'
export type TransactionType = 'INCOME' | 'EXPENSE'
export type BudgetPeriod = 'MONTHLY' | 'WEEKLY'
export type InsightType = 'WARNING' | 'SUGGESTION' | 'ANOMALY'

// ─── Entity Interfaces ────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Account {
  id: string
  userId: string
  name: string
  type: AccountType
  balance: number
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  amount: number
  type: TransactionType
  category: string
  description: string
  rawPrompt: string | null
  timestamp: Date
}

export interface Budget {
  id: string
  userId: string
  category: string
  limitAmount: number
  spentAmount: number
  period: BudgetPeriod
  startDate: Date
  endDate: Date
  isActive: boolean
}

export interface AiInsight {
  id: string
  userId: string
  type: InsightType
  message: string
  isRead: boolean
  createdAt: Date
}

// ─── Extended / Joined Types ──────────────────────────────────────────────────

/** Transaction with its parent account resolved (useful for display). */
export interface TransactionWithAccount extends Transaction {
  account: Account
}

/** Account with all its transactions resolved (useful for balance history). */
export interface AccountWithTransactions extends Account {
  transactions: Transaction[]
}

/** Budget with computed percentage spent (derived, not stored). */
export interface BudgetWithProgress extends Budget {
  /** spentAmount / limitAmount, clamped to [0, 1]. */
  percentSpent: number
}

// ─── Input / Mutation Types ───────────────────────────────────────────────────

/** Shape used when creating a new account (id and timestamps are server-generated). */
export interface CreateAccountInput {
  userId: string
  name: string
  type: AccountType
  balance?: number
}

/** Shape used when creating a new transaction via AI or manual form. */
export interface CreateTransactionInput {
  userId: string
  accountId: string
  amount: number
  type: TransactionType
  category: string
  description: string
  rawPrompt?: string
}

/** Fields that can be mutated via Smart Ledger inline editing. */
export interface UpdateTransactionInput {
  id: string
  category?: string
  amount?: number
  description?: string
}

/** Shape used when creating a new budget. */
export interface CreateBudgetInput {
  userId: string
  category: string
  limitAmount: number
  period: BudgetPeriod
  startDate: Date
  endDate: Date
}
