import type { Metadata } from 'next'
import { CommandCenterPage } from '@/components/pages/command-center/command-center-page'

export const metadata: Metadata = {
  title: 'Command Center',
}

export default function Page() {
  return <CommandCenterPage />
}
