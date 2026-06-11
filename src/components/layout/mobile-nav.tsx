'use client'

import Link from 'next/link'
import { Home, Shield, MessageSquareText, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  currentPath: string
}

const navItems = [
  { href: '/dashboard', label: 'Beranda', icon: Home },
  { href: '/vault', label: 'Vault', icon: Shield },
  { href: '/command-center', label: 'AI Chat', icon: MessageSquareText },
  { href: '/ledger', label: 'Catatan', icon: BookOpen },
] as const

export function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px]">
      {/* Gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6" style={{ background: 'linear-gradient(to top, var(--color-background), transparent)' }} />

      <div
        className="flex items-center justify-around border-t border-[var(--color-border)]"
        style={{
          paddingBottom: 'var(--safe-bottom)',
          height: 'calc(var(--nav-height) + var(--safe-bottom))',
          background: 'var(--color-background)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = currentPath === href

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2"
            >
              {/* Active pill indicator */}
              {isActive && (
                <span className="absolute -top-[1px] h-[2px] w-8 rounded-full animate-[scale-in_0.2s_ease]" style={{ background: 'var(--color-foreground)' }} />
              )}
              <Icon
                className={cn(
                  'h-[22px] w-[22px] transition-colors duration-200',
                  isActive ? 'text-[var(--color-foreground)]' : 'text-[var(--color-tertiary)]'
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-200',
                  isActive ? 'text-[var(--color-foreground)]' : 'text-[var(--color-tertiary)]'
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
