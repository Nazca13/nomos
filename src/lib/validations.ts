import { z } from 'zod'

// ─── Shared Primitives ────────────────────────────────────────────────────────

const uuidSchema = z.string().uuid()

const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

const accountTypeSchema = z.enum(['BANK', 'EWALLET', 'CASH'])

const budgetPeriodSchema = z.enum(['MONTHLY', 'WEEKLY'])

// ─── Transaction Schemas ──────────────────────────────────────────────────────

/**
 * Validates the payload for creating a new Transaction.
 * Used before calling prisma.transaction.create().
 */
export const createTransactionSchema = z.object({
  userId: uuidSchema,
  accountId: uuidSchema,
  amount: z
    .number()
    .positive({ message: 'Amount must be greater than zero' }),
  type: transactionTypeSchema,
  category: z
    .string()
    .min(1, { message: 'Category is required' })
    .max(100, { message: 'Category must be 100 characters or fewer' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description must be 500 characters or fewer' }),
  rawPrompt: z.string().max(2000).optional(),
})

export type CreateTransactionData = z.infer<typeof createTransactionSchema>

/**
 * Validates the payload for updating an existing Transaction via inline editing.
 * Only category, amount, and description are mutable from the UI (rawPrompt and
 * timestamp are immutable per Requirement 12).
 */
export const updateTransactionSchema = z.object({
  id: uuidSchema,
  category: z
    .string()
    .min(1, { message: 'Category is required' })
    .max(100, { message: 'Category must be 100 characters or fewer' })
    .optional(),
  amount: z
    .number()
    .positive({ message: 'Amount must be greater than zero' })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description must be 500 characters or fewer' })
    .optional(),
}).refine(
  (data) => data.category !== undefined || data.amount !== undefined || data.description !== undefined,
  { message: 'At least one field must be provided for update' }
)

export type UpdateTransactionData = z.infer<typeof updateTransactionSchema>

// ─── Budget Schemas ───────────────────────────────────────────────────────────

/**
 * Validates the payload for creating a new Budget.
 * Used before calling prisma.budget.create().
 */
export const createBudgetSchema = z.object({
  userId: uuidSchema,
  category: z
    .string()
    .min(1, { message: 'Category is required' })
    .max(100, { message: 'Category must be 100 characters or fewer' }),
  limitAmount: z
    .number()
    .positive({ message: 'Limit amount must be greater than zero' }),
  period: budgetPeriodSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: 'End date must be after start date', path: ['endDate'] }
)

export type CreateBudgetData = z.infer<typeof createBudgetSchema>

// ─── Account Schemas ──────────────────────────────────────────────────────────

/**
 * Validates the payload for creating a new Account.
 * Used before calling prisma.account.create().
 */
export const createAccountSchema = z.object({
  userId: uuidSchema,
  name: z
    .string()
    .min(1, { message: 'Account name is required' })
    .max(100, { message: 'Account name must be 100 characters or fewer' }),
  type: accountTypeSchema,
  balance: z
    .number()
    .default(0.0),
})

export type CreateAccountData = z.infer<typeof createAccountSchema>

/**
 * Validates the payload for updating an existing Account (e.g. renaming or
 * correcting the type). Balance is managed internally via atomic transaction
 * operations and is not directly mutable from the UI.
 */
export const updateAccountSchema = z.object({
  id: uuidSchema,
  name: z
    .string()
    .min(1, { message: 'Account name is required' })
    .max(100, { message: 'Account name must be 100 characters or fewer' })
    .optional(),
  type: accountTypeSchema.optional(),
}).refine(
  (data) => data.name !== undefined || data.type !== undefined,
  { message: 'At least one field must be provided for update' }
)

export type UpdateAccountData = z.infer<typeof updateAccountSchema>

// ─── AiInsight Schemas ────────────────────────────────────────────────────────

const insightTypeSchema = z.enum(['WARNING', 'SUGGESTION', 'ANOMALY'])

/**
 * Validates the payload when the system creates a new AiInsight record
 * (anomaly detection, suggestion engine, budget warnings).
 * Used before calling prisma.aiInsight.create().
 */
export const createAiInsightSchema = z.object({
  userId: uuidSchema,
  type: insightTypeSchema,
  message: z
    .string()
    .min(1, { message: 'Insight message is required' })
    .max(1000, { message: 'Insight message must be 1000 characters or fewer' }),
})

export type CreateAiInsightData = z.infer<typeof createAiInsightSchema>
