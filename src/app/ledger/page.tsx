import type { Metadata } from 'next'
import { LedgerPage } from '@/components/pages/ledger/ledger-page'

export const metadata: Metadata = {
  title: 'Smart Ledger',
}

export default function Page() {
  return <LedgerPage />
}
