import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { TransactionProvider } from '@/lib/transaction-store'
import { SubscriptionProvider } from '@/lib/subscription-store'
import { UserProvider } from '@/lib/user-store'
import { AppShell } from '@/components/layout/app-shell'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NOMOS',
  description: 'Catat keuangan kamu dengan mudah dan cerdas',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NOMOS',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
        <UserProvider>
          <TransactionProvider>
            <SubscriptionProvider>
              <AppShell>{children}</AppShell>
            </SubscriptionProvider>
          </TransactionProvider>
        </UserProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
              fontSize: '13px',
              borderRadius: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
