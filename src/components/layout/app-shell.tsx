'use client'

import { usePathname } from 'next/navigation'
import { MobileNav } from '@/components/layout/mobile-nav'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-black">
      {/* Main content */}
      <main className="flex-1 safe-bottom">
        {children}
      </main>

      {/* Bottom navigation */}
      <MobileNav currentPath={pathname} />
    </div>
  )
}
