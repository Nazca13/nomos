'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { useTransactions } from './transaction-store'
import { toast } from 'sonner'
import { Bell } from 'lucide-react'

export interface Subscription {
  id: string
  name: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  account: string
  category: string
  billingDate: number // Day of month (1-31)
  isActive: boolean
  lastBilledDate?: string | null // ISO Timestamp
}

interface State {
  subscriptions: Subscription[]
}

type Action =
  | { type: 'ADD_SUB'; payload: Subscription }
  | { type: 'DELETE_SUB'; payload: string }
  | { type: 'TOGGLE_SUB'; payload: string }
  | { type: 'UPDATE_SUB'; payload: Subscription }
  | { type: 'HYDRATE_SUBS'; payload: Subscription[] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SUB':
      return { subscriptions: [...state.subscriptions, action.payload] }
    case 'DELETE_SUB':
      return { subscriptions: state.subscriptions.filter((s) => s.id !== action.payload) }
    case 'TOGGLE_SUB':
      return {
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.payload ? { ...s, isActive: !s.isActive } : s
        ),
      }
    case 'UPDATE_SUB':
      return {
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      }
    case 'HYDRATE_SUBS':
      return { subscriptions: action.payload }
    default:
      return state
  }
}

interface SubscriptionContextValue {
  subscriptions: Subscription[]
  addSubscription: (sub: Omit<Subscription, 'id' | 'isActive'>) => Subscription
  deleteSubscription: (id: string) => void
  toggleSubscription: (id: string) => void
  updateSubscription: (sub: Subscription) => void
  upcomingBills: Array<{ sub: Subscription; daysLeft: number }>
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

const STORAGE_KEY = 'nomos_subscriptions_v1'

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { subscriptions: [] })
  const { addTransaction } = useTransactions()

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        dispatch({ type: 'HYDRATE_SUBS', payload: JSON.parse(raw) })
      } else {
        // Hydrate with some premium default subscriptions
        const defaults: Subscription[] = [
          {
            id: '1',
            name: 'Netflix Premium',
            amount: 186000,
            type: 'EXPENSE',
            account: 'Gopay',
            category: 'Entertainment',
            billingDate: 15,
            isActive: true,
            lastBilledDate: null,
          },
          {
            id: '2',
            name: 'Spotify Family',
            amount: 86000,
            type: 'EXPENSE',
            account: 'BCA',
            category: 'Entertainment',
            billingDate: 25,
            isActive: true,
            lastBilledDate: null,
          },
        ]
        dispatch({ type: 'HYDRATE_SUBS', payload: defaults })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      }
    } catch {}
  }, [])

  // Persist changes
  useEffect(() => {
    try {
      if (state.subscriptions.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.subscriptions))
      }
    } catch {}
  }, [state.subscriptions])

  // Cron execution on load: check if active subscriptions are due for billing
  useEffect(() => {
    if (state.subscriptions.length === 0) return

    const now = new Date()
    const currentDay = now.getDate()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let updated = false
    const nextSubs = state.subscriptions.map((sub) => {
      if (!sub.isActive) return sub

      // Check if already billed this month
      let shouldBill = false
      if (sub.lastBilledDate) {
        const lastBilled = new Date(sub.lastBilledDate)
        const lastBilledMonth = lastBilled.getMonth()
        const lastBilledYear = lastBilled.getFullYear()

        // If last billed was in a previous month/year, and today is on or past billing date
        if ((lastBilledYear < currentYear || lastBilledMonth < currentMonth) && currentDay >= sub.billingDate) {
          shouldBill = true
        }
      } else {
        // Never billed before, bill if today is on or past billing date
        if (currentDay >= sub.billingDate) {
          shouldBill = true
        }
      }

      if (shouldBill) {
        // Execute transaction
        addTransaction({
          description: sub.name,
          amount: sub.amount,
          type: sub.type,
          accountName: sub.account,
          category: sub.category,
          rawPrompt: `Auto-billing node: ${sub.name}`,
        })

        toast('Auto-billing Executed', {
          description: `[SYSTEM_NOTICE]: ${sub.name} (Rp ${sub.amount.toLocaleString()}) berhasil ditagih otomatis ke ${sub.account}.`,
          icon: <Bell className="h-4 w-4 text-[var(--color-positive)]" />,
          duration: 6000,
        })

        updated = true
        return {
          ...sub,
          lastBilledDate: now.toISOString(),
        }
      }

      return sub
    })

    if (updated) {
      dispatch({ type: 'HYDRATE_SUBS', payload: nextSubs })
    }
  }, [state.subscriptions, addTransaction])

  const addSubscription = (sub: Omit<Subscription, 'id' | 'isActive'>): Subscription => {
    const full: Subscription = {
      ...sub,
      id: crypto.randomUUID(),
      isActive: true,
      lastBilledDate: null,
    }
    dispatch({ type: 'ADD_SUB', payload: full })
    return full
  }

  const deleteSubscription = (id: string) => dispatch({ type: 'DELETE_SUB', payload: id })
  const toggleSubscription = (id: string) => dispatch({ type: 'TOGGLE_SUB', payload: id })
  const updateSubscription = (sub: Subscription) => dispatch({ type: 'UPDATE_SUB', payload: sub })

  // Calculate upcoming bills (warn 3 days before billingDate)
  const getUpcomingBills = (): Array<{ sub: Subscription; daysLeft: number }> => {
    const now = new Date()
    const currentDay = now.getDate()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return state.subscriptions
      .filter((s) => s.isActive)
      .map((sub) => {
        // Calculate billing date for this month
        let billDateThisMonth = new Date(currentYear, currentMonth, sub.billingDate)
        
        // If billing date has passed for this month, check next month's billing
        if (currentDay > sub.billingDate) {
          const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
          const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
          billDateThisMonth = new Date(nextYear, nextMonth, sub.billingDate)
        }

        const timeDiff = billDateThisMonth.getTime() - now.getTime()
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))

        return { sub, daysLeft }
      })
      .filter((item) => item.daysLeft <= 3 && item.daysLeft >= 0)
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions: state.subscriptions,
        addSubscription,
        deleteSubscription,
        toggleSubscription,
        updateSubscription,
        upcomingBills: getUpcomingBills(),
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscriptions must be inside SubscriptionProvider')
  return ctx
}
