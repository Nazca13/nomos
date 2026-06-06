'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, Check, X, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

function DraftCard({
  data,
  onConfirm,
  onCancel,
}: {
  data: { amount: number; type: 'INCOME' | 'EXPENSE'; account: string; category: string; description: string }
  onConfirm: () => void
  onCancel: () => void
}) {
  const isIncome = data.type === 'INCOME'
  return (
    <div className="animate-[slide-up_0.3s_ease] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isIncome ? 'bg-[var(--color-positive)]/15' : 'bg-white/[0.04]'}`}>
          {isIncome ? <ArrowDownLeft className="h-3.5 w-3.5 text-[var(--color-positive)]" /> : <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-negative)]" />}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">Draft Transaksi</span>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <DraftField label="Description" value={data.description} full />
        <DraftField label="Amount" value={formatCurrency(data.amount)} mono />
        <DraftField label="Type" value={data.type} />
        <DraftField label="Account" value={data.account} />
        <DraftField label="Category" value={data.category} />
      </div>
      <div className="flex gap-2">
        <button onClick={onConfirm} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-[12px] font-bold text-black active:bg-white/90">
          <Check className="h-3.5 w-3.5" /> Confirm
        </button>
        <button onClick={onCancel} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] py-2.5 text-[12px] font-medium text-[var(--color-secondary)] active:bg-[var(--color-card)]">
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      </div>
    </div>
  )
}

function DraftField({ label, value, mono = false, full = false }: { label: string; value: string; mono?: boolean; full?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-0.5', full && 'col-span-2')}>
      <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">{label}</span>
      <span className={cn('text-[13px] text-white', mono && 'font-financial')}>{value}</span>
    </div>
  )
}

export function ChatStream() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({ api: '/api/chat' })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 py-3">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-card)]">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <p className="text-[14px] font-semibold text-white">NOMOS AI</p>
            <p className="text-[12px] text-[var(--color-secondary)] max-w-[240px]">
              Kirim pesan untuk mencatat transaksi atau tanya soal keuanganmu.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {['Beli kopi 25rb pake Gopay', 'Gaji masuk 8.5jt di BCA', 'Habis berapa bulan ini?'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleInputChange({ target: { value: s } } as React.ChangeEvent<HTMLInputElement>)}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-[11px] text-[var(--color-secondary)] active:bg-[var(--color-card-hover)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((msg) => {
            const isUser = msg.role === 'user'
            return (
              <div key={msg.id} className="flex flex-col gap-2">
                {msg.content && (
                  <div className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
                    {!isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[var(--color-card)]">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div className={cn('max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed', isUser ? 'bg-white text-black' : 'bg-[var(--color-card)] text-white')}>
                      {msg.content}
                    </div>
                    {isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>
                )}
                {msg.toolInvocations?.map((inv) => {
                  if (inv.toolName === 'trackTransaction' && inv.state === 'result') {
                    const res = inv.result as { status: string; data: { amount: number; type: 'INCOME' | 'EXPENSE'; account: string; category: string; description: string } }
                    return (
                      <div key={inv.toolCallId} className="pl-9">
                        <DraftCard data={res.data} onConfirm={() => console.log('Confirmed:', res.data)} onCancel={() => console.log('Cancelled')} />
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            )
          })}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[var(--color-card)]">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-[var(--color-card)] px-3.5 py-2.5">
                <Loader2 className="h-3 w-3 animate-spin text-white" />
                <span className="text-[11px] text-[var(--color-secondary)]">Thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-[var(--color-negative)]/10 px-3 py-2 text-[12px] text-[var(--color-negative)]">
              Error: {error.message}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[var(--color-border)] px-2 pt-3 pb-2">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ketik transaksi..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-[14px] text-white placeholder:text-[var(--color-tertiary)] focus:outline-none disabled:opacity-50"
            id="chat-input"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-black transition-opacity disabled:opacity-20"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
