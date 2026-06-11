'use client'

import { useState } from 'react'
import { MessageSquareText, TrendingUp } from 'lucide-react'
import { ChatStream } from '@/components/pages/command-center/chat-stream'
import { PredictiveCanvas } from '@/components/pages/command-center/predictive-canvas'
import { cn } from '@/lib/utils'

type Tab = 'chat' | 'canvas'

export function CommandCenterPage() {
  const [tab, setTab] = useState<Tab>('chat')

  return (
    <div className="flex flex-col animate-[fade-in_0.3s_ease]" style={{ height: 'calc(100dvh - var(--nav-height))' }}>
      {/* Header with tabs */}
      <div className="px-5 pt-14 pb-3">
        <h1 className="text-[20px] font-bold tracking-tight text-[var(--color-foreground)]">Command Center</h1>
        <div className="mt-3 flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[3px]">
          <button
            onClick={() => setTab('chat')}
            className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-all', tab === 'chat' ? 'bg-[var(--color-foreground)] text-[var(--color-background)]' : 'text-[var(--color-tertiary)]')}
          >
            <MessageSquareText className="h-3.5 w-3.5" /> Chat
          </button>
          <button
            onClick={() => setTab('canvas')}
            className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-all', tab === 'canvas' ? 'bg-[var(--color-foreground)] text-[var(--color-background)]' : 'text-[var(--color-tertiary)]')}
          >
            <TrendingUp className="h-3.5 w-3.5" /> Proyeksi
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'chat' ? (
          <div className="flex h-full flex-col px-3">
            <ChatStream />
          </div>
        ) : (
          <div className="h-full overflow-y-auto pb-4">
            <PredictiveCanvas />
          </div>
        )}
      </div>
    </div>
  )
}
