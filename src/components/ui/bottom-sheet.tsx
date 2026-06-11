'use client'

import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-[fade-in_0.2s_ease]"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] animate-[sheet-up_0.4s_var(--ease-spring)_both]',
          className
        )}
      >
        <div className="rounded-t-3xl border-t border-[var(--color-border)] bg-[var(--color-surface)]"
          style={{ paddingBottom: 'calc(var(--nav-height) + var(--safe-bottom) + 16px)' }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pb-2 pt-3">
            <div className="h-[3px] w-9 rounded-full bg-[var(--color-quaternary)]" />
          </div>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-5 pb-2 pt-1">
              <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-foreground)]">{title}</h2>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-card)] text-[var(--color-secondary)] transition-opacity active:opacity-60"
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          <div className="px-5 pb-2 pt-3">{children}</div>
        </div>
      </div>
    </>
  )
}
