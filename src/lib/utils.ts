import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes safely, resolving conflicts via tailwind-merge.
 * This is the standard utility used by all Shadcn UI components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a numeric value as a localized currency string.
 * Uses tabular-nums-friendly formatting for financial displays.
 *
 * @param amount  - Numeric amount (e.g. 150000)
 * @param locale  - BCP 47 locale tag (default: 'id-ID' for Indonesian Rupiah context)
 * @param currency - ISO 4217 currency code (default: 'IDR')
 */
export function formatCurrency(
  amount: number,
  locale = 'id-ID',
  currency = 'IDR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a Date (or ISO string) for display in the Smart Ledger and timestamps.
 * Returns a short date-time string in the user's local timezone.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Parse shorthand currency expressions like "150k", "3m", "1.5jt"
 * into their numeric equivalents.
 *
 * Supported suffixes:
 *  - k / rb   → × 1,000
 *  - m / jt   → × 1,000,000
 *  - b / m (billion context) → × 1,000,000,000
 */
export function parseShorthandAmount(input: string): number | null {
  const normalized = input.trim().toLowerCase().replace(/[,_.]/g, '')
  const match = normalized.match(/^(\d+(?:\.\d+)?)(k|rb|m|jt|b)?$/)
  if (!match) return null

  const base = parseFloat(match[1])
  const suffix = match[2]

  if (suffix === 'k' || suffix === 'rb') return base * 1_000
  if (suffix === 'm' || suffix === 'jt') return base * 1_000_000
  if (suffix === 'b') return base * 1_000_000_000

  return base
}
