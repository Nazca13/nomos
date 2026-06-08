import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { TransactionProvider } from '@/lib/transaction-store'
import { SubscriptionProvider } from '@/lib/subscription-store'
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
  description: 'Autonomous Financial Intelligence System',
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-black text-white antialiased">
        <TransactionProvider>
          <SubscriptionProvider>
            <AppShell>{children}</AppShell>
          </SubscriptionProvider>
        </TransactionProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid #1c1c1e',
              color: '#ffffff',
              fontSize: '13px',
              borderRadius: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
