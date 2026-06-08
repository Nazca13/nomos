'use client'

import { useChat } from '@ai-sdk/react'
import { useRef, useEffect } from 'react'
import { Send, Check, X, ArrowDownLeft, ArrowUpRight, Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatCurrency } from '@/lib/utils'
import { useTransactions } from '@/lib/transaction-store'
import Image from 'next/image'

// ─── Types ──────────────────────────────────────────────────────────────────
interface TxDraft {
  amount: number
  type: 'INCOME' | 'EXPENSE'
  account: string
  category: string
  description: string
}

// ─── TX marker parser ────────────────────────────────────────────────────────
const TX_REGEX = /\[TX:([\s\S]*?)\]/

function parseTx(content: string): TxDraft | null {
  const match = content.match(TX_REGEX)
  if (!match) return null
  try { return JSON.parse(match[1]) as TxDraft } catch { return null }
}

function stripTxMarker(content: string): string {
  return content.replace(TX_REGEX, '').trim()
}

// ─── NOMOS Avatar ────────────────────────────────────────────────────────────
function NomosAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-card)]"
      style={{ width: size, height: size }}
    >
      <Image
        src="/icon-192x192.png"
        alt="NOMOS"
        width={size}
        height={size}
        className="h-full w-full object-cover"
        priority
      />
    </div>
  )
}

// ─── Typing dots animation ───────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-[5px] w-[5px] rounded-full bg-[var(--color-tertiary)]"
          style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  )
}

// ─── Draft card sub-field ────────────────────────────────────────────────────
function DraftField({
  label,
  value,
  mono = false,
  full = false,
}: {
  label: string
  value: string
  mono?: boolean
  full?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-[3px]', full && 'col-span-2')}>
      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tertiary)]">{label}</span>
      <span className={cn('text-[13px] leading-tight text-white', mono && 'font-financial font-bold tracking-tight')}>
        {value}
      </span>
    </div>
  )
}

// ─── Draft confirmation card ──────────────────────────────────────────────────
function DraftCard({
  data,
  onConfirm,
  onCancel,
}: {
  data: TxDraft
  onConfirm: () => void
  onCancel: () => void
}) {
  const isIncome = data.type === 'INCOME'
  const accentColor = isIncome ? 'var(--color-positive)' : 'var(--color-negative)'

  return (
    <div className="animate-[slide-up_0.3s_var(--ease-spring)_both] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{ background: accentColor }} />

      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: `color-mix(in srgb, ${accentColor} 12%, transparent)` }}
          >
            {isIncome
              ? <ArrowDownLeft className="h-3 w-3" style={{ color: accentColor }} />
              : <ArrowUpRight className="h-3 w-3" style={{ color: accentColor }} />
            }
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-secondary)]">
            {isIncome ? 'Pemasukan Terdeteksi' : 'Pengeluaran Terdeteksi'}
          </span>
        </div>

        {/* Data grid */}
        <div className="mb-4 grid grid-cols-2 gap-x-5 gap-y-3.5 rounded-xl bg-[var(--color-surface)] p-3">
          <DraftField label="Deskripsi" value={data.description} full />
          <DraftField label="Nominal" value={formatCurrency(data.amount)} mono />
          <DraftField label="Akun" value={data.account} />
          <DraftField label="Kategori" value={data.category} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-[12px] font-semibold text-black transition-opacity active:opacity-75"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            Simpan
          </button>
          <button
            onClick={onCancel}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] py-2.5 text-[12px] font-medium text-[var(--color-secondary)] transition-colors active:bg-[var(--color-surface)]"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
            Tolak
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Suggestion chips ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { label: 'Beli kopi 25rb Gopay', query: 'Beli kopi 25rb pake Gopay' },
  { label: 'Gaji masuk 8.5jt BCA', query: 'Gaji masuk 8.5jt di BCA' },
  { label: 'Grab ke kantor 32rb', query: 'Grab ke kantor 32rb' },
]

// ─── Main ChatStream ──────────────────────────────────────────────────────────
export function ChatStream() {
  const { addTransaction } = useTransactions()
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages, reload } =
    useChat({ api: '/api/chat', streamProtocol: 'text' })
  const scrollRef = useRef<HTMLDivElement>(null)
  const confirmedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleClearChat = () => {
    setMessages([])
    confirmedIds.current.clear()
    toast('Riwayat chat dihapus', { icon: <Trash2 size={13} /> })
  }

  const handleReload = () => {
    if (!messages.length) return
    reload()
    toast('Mengirim ulang pesan...', { icon: <RotateCcw size={13} /> })
  }

  const handleConfirm = (draft: TxDraft, msgId: string, rawPrompt?: string) => {
    confirmedIds.current.add(msgId)
    addTransaction({ ...draft, accountName: draft.account, rawPrompt })
    toast.success('Transaksi berhasil dicatat', {
      description: `${draft.description} · ${formatCurrency(draft.amount)}`,
    })
  }

  const handleCancel = (msgId: string) => {
    confirmedIds.current.add(msgId)
    toast('Draft transaksi dibatalkan', { icon: <X size={13} /> })
  }

  return (
    <div className="flex h-full flex-col">
      {/* ── Messages area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-4">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center">
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-xl" />
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                <Image
                  src="/icon-192x192.png"
                  alt="NOMOS"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[15px] font-semibold tracking-tight text-white">NOMOS AI</p>
              <p className="text-[12px] leading-relaxed text-[var(--color-secondary)]">
                Catat transaksi dalam bahasa sehari-hari.<br />
                AI akan mendeteksi dan mengkonfirmasi otomatis.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="flex w-full flex-col gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={s.query}
                  onClick={() => handleInputChange({ target: { value: s.query } } as React.ChangeEvent<HTMLInputElement>)}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2.5 text-left transition-colors active:bg-[var(--color-card-hover)] stagger-1"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="h-4 w-[2px] rounded-full bg-[var(--color-tertiary)]" />
                  <span className="text-[12px] text-[var(--color-secondary)]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        <div className="flex flex-col gap-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user'
            const rawContent = typeof msg.content === 'string' ? msg.content : ''
            const draft = !isUser ? parseTx(rawContent) : null
            const visibleText = draft ? stripTxMarker(rawContent) : rawContent
            const alreadyActioned = confirmedIds.current.has(msg.id)

            return (
              <div key={msg.id} className="flex flex-col gap-2.5">
                {/* Bubble */}
                {visibleText && (
                  <div className={cn('flex items-end gap-2', isUser ? 'justify-end' : 'justify-start')}>
                    {!isUser && <NomosAvatar size={28} />}

                    <div className={cn(
                      'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                      isUser
                        ? 'rounded-br-sm bg-white font-medium text-black'
                        : 'rounded-bl-sm bg-[var(--color-card)] text-[var(--color-foreground)]'
                    )}>
                      {visibleText}
                    </div>

                    {isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-card)] text-[10px] font-bold text-[var(--color-secondary)]">
                        U
                      </div>
                    )}
                  </div>
                )}

                {/* Draft card */}
                {draft && !alreadyActioned && (
                  <div className="pl-9">
                    <DraftCard
                      data={draft}
                      onConfirm={() => {
                        const userMsg = messages.find((m) => m.role === 'user')
                        handleConfirm(draft, msg.id, typeof userMsg?.content === 'string' ? userMsg.content : undefined)
                      }}
                      onCancel={() => handleCancel(msg.id)}
                    />
                  </div>
                )}
              </div>
            )
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <NomosAvatar size={28} />
              <div className="rounded-2xl rounded-bl-sm bg-[var(--color-card)] px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-negative)]/20 bg-[var(--color-negative)]/8 px-3 py-2.5 text-[12px] text-[var(--color-negative)]">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {error.message}
            </div>
          )}
        </div>
      </div>

      {/* ── Controls + Input ── */}
      <div className="border-t border-[var(--color-border)] px-2 pb-2 pt-2.5">
        {/* Action row */}
        {messages.length > 0 && (
          <div className="mb-2 flex items-center justify-end gap-1.5">
            <button
              onClick={handleReload}
              disabled={isLoading}
              className="flex h-7 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 text-[10px] font-medium text-[var(--color-secondary)] disabled:opacity-40 active:bg-[var(--color-card-hover)]"
            >
              <RotateCcw className="h-3 w-3" />
              Ulangi
            </button>
            <button
              onClick={handleClearChat}
              disabled={isLoading}
              className="flex h-7 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 text-[10px] font-medium text-[var(--color-negative)]/70 disabled:opacity-40 active:bg-[var(--color-card-hover)]"
            >
              <Trash2 className="h-3 w-3" />
              Hapus
            </button>
          </div>
        )}

        {/* Input bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ketik transaksi..."
            disabled={isLoading}
            id="chat-input"
            autoComplete="off"
            className="flex-1 bg-transparent py-1 text-[13px] text-white placeholder:text-[var(--color-tertiary)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Kirim"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-black transition-opacity disabled:opacity-20 active:opacity-75"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  )
}
