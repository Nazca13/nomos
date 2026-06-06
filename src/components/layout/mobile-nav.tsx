'use client'

import Link from 'next/link'
import { LayoutDashboard, MessageSquareText, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  currentPath: string
}

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/command-center', label: 'AI', icon: MessageSquareText },
  { href: '/ledger', label: 'Ledger', icon: BookOpen },
] as const

export function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px]">
      {/* Gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-black to-transparent" />

      <div
        className="flex items-center justify-around border-t border-[var(--color-border)] bg-black/95 backdrop-blur-xl"
        style={{ paddingBottom: 'var(--safe-bottom)', height: 'calc(var(--nav-height) + var(--safe-bottom))' }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = currentPath === href

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 px-6 py-2"
            >
              {/* Active pill indicator */}
              {isActive && (
                <span className="absolute -top-[1px] h-[2px] w-8 rounded-full bg-white animate-[scale-in_0.2s_ease]" />
              )}
              <Icon
                className={cn(
                  'h-[22px] w-[22px] transition-colors duration-200',
                  isActive ? 'text-white' : 'text-[var(--color-tertiary)]'
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-200',
                  isActive ? 'text-white' : 'text-[var(--color-tertiary)]'
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
