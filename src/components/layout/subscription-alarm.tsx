'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { useSubscriptions } from '@/lib/subscription-store'
import { formatCurrency } from '@/lib/utils'

export function SubscriptionAlarm() {
  const { upcomingBills } = useSubscriptions()
  const [dismissed, setDismissed] = useState(true) // default true to prevent flash

  useEffect(() => {
    // Only show if there are upcoming bills and we haven't dismissed them today
    if (upcomingBills.length > 0) {
      const lastDismissed = sessionStorage.getItem('nomos_sub_alarm_dismissed')
      const today = new Date().toDateString()
      if (lastDismissed !== today) {
        setDismissed(false)
      }
    }
  }, [upcomingBills])

  if (dismissed || upcomingBills.length === 0) return null

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('nomos_sub_alarm_dismissed', new Date().toDateString())
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_0.3s_ease] p-6">
      <div className="w-full max-w-[360px] rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl animate-[scale-in_0.3s_ease] relative">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-secondary)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-5 text-center mt-2">
          {/* Bell Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <Bell className="h-8 w-8 animate-pulse" />
          </div>

          <div>
            <h2 className="text-[20px] font-bold text-[var(--color-foreground)] tracking-tight">
              Alarm Tagihan! ⏰
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-secondary)]">
              Ada tagihan rutin yang harus segera disiapkan saldonya.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2 text-left">
            {upcomingBills.map(({ sub, daysLeft }) => (
              <div key={sub.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-foreground)] text-[14px]">{sub.name}</span>
                  <span className="text-[12px] font-semibold text-red-500">
                    {daysLeft === 0 ? 'HARI INI' : `H-${daysLeft}`}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[12px] text-[var(--color-secondary)]">
                  <span className="font-financial">{formatCurrency(sub.amount)}</span>
                  <span>via {sub.account}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleDismiss}
            className="mt-2 w-full rounded-2xl bg-[var(--color-foreground)] py-3.5 text-[14px] font-bold text-[var(--color-background)] transition-opacity active:opacity-80"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  )
}
