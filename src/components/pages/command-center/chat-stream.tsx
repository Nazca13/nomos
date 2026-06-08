'use client'

import { useChat } from '@ai-sdk/react'
import { useRef, useEffect, useState } from 'react'
import { Send, Check, X, ArrowDownLeft, ArrowUpRight, Trash2, RotateCcw, AlertTriangle, Camera, WifiOff, Globe } from 'lucide-react'
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
  const index = content.indexOf('[TX:')
  return (index !== -1 ? content.substring(0, index) : content).trim()
}

// ─── Local Offline Command Parser ───────────────────────────────────────────
function parseOfflineCommand(text: string): TxDraft | null {
  const normalized = text.toLowerCase()
  
  // Try to find numbers (e.g. 25000, 25k, 25rb, 1.5jt)
  const amountMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta|m|b)?\b/)
  if (!amountMatch) return null

  let base = parseFloat(amountMatch[1].replace(',', '.'))
  const suffix = amountMatch[2]

  if (suffix === 'k' || suffix === 'rb' || suffix === 'ribu') base *= 1000
  if (suffix === 'jt' || suffix === 'juta') base *= 1000000

  // Type detection
  const isIncome = normalized.includes('gaji') || normalized.includes('masuk') || normalized.includes('pemasukan') || normalized.includes('dapat') || normalized.includes('diberi')
  const type = isIncome ? 'INCOME' : 'EXPENSE'

  // Account detection
  let account = 'Cash'
  if (normalized.includes('gopay')) account = 'Gopay'
  else if (normalized.includes('ovo')) account = 'OVO'
  else if (normalized.includes('bca')) account = 'BCA'
  else if (normalized.includes('mandiri')) account = 'Mandiri'
  else if (normalized.includes('shopeepay') || normalized.includes('spay')) account = 'ShopeePay'

  // Category & description detection
  let category = 'Other'
  let description = text.replace(amountMatch[0], '')
  
  // Clean description from account names & prepositions
  description = description.replace(new RegExp(account, 'gi'), '')
  description = description.replace(/(pake|pakai|di|dari|ke|beli|bayar|buat)\b/gi, '')
  description = description.trim()
  
  if (!description) {
    description = isIncome ? 'Pemasukan Offline' : 'Pengeluaran Offline'
  } else {
    description = description.charAt(0).toUpperCase() + description.slice(1)
  }

  // Basic category matching
  if (normalized.includes('kopi') || normalized.includes('makan') || normalized.includes('minum') || normalized.includes('restoran') || normalized.includes('warung') || normalized.includes('cafe')) {
    category = 'Food'
  } else if (normalized.includes('grab') || normalized.includes('gojek') || normalized.includes('bensin') || normalized.includes('ojek') || normalized.includes('taxi') || normalized.includes('bus')) {
    category = 'Transport'
  } else if (normalized.includes('listrik') || normalized.includes('air') || normalized.includes('wifi') || normalized.includes('internet') || normalized.includes('pulsa')) {
    category = 'Utilities'
  } else if (normalized.includes('netflix') || normalized.includes('spotify') || normalized.includes('game') || normalized.includes('bioskop') || normalized.includes('nonton')) {
    category = 'Entertainment'
  } else if (normalized.includes('gaji') || normalized.includes('bonus') || normalized.includes('dividen')) {
    category = 'Salary'
  } else if (normalized.includes('saham') || normalized.includes('reksa') || normalized.includes('crypto') || normalized.includes('emas')) {
    category = 'Investment'
  }

  return {
    amount: base,
    type,
    account,
    category,
    description
  }
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isScanning, setIsScanning] = useState<boolean>(false)

  // Track online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const goOnline = () => {
      setIsOnline(true)
      toast.success('Koneksi terhubung kembali', {
        description: '[SYSTEM_NOTICE]: Online node active. Syncing queue...',
        icon: <Globe className="h-4 w-4 text-[var(--color-positive)]" />
      })
      syncOfflineQueue()
    }
    const goOffline = () => {
      setIsOnline(false)
      toast.error('Koneksi terputus', {
        description: '[SYSTEM_NOTICE]: Air-Gapped Mode engaged.',
        icon: <WifiOff className="h-4 w-4 text-[var(--color-negative)]" />
      })
    }

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading, isScanning])

  // Sync Offline Queue when returning online
  const syncOfflineQueue = async () => {
    try {
      const queueRaw = localStorage.getItem('nomos_offline_queue')
      if (!queueRaw) return
      const queue: string[] = JSON.parse(queueRaw)
      if (queue.length === 0) return

      toast('Sinkronisasi data', {
        description: `Memproses ${queue.length} transaksi tertunda...`
      })

      // Send to server one-by-one
      for (const query of queue) {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: query }] })
          })
          if (response.ok) {
            const botText = await response.text()
            const userMsgId = crypto.randomUUID()
            const botMsgId = crypto.randomUUID()
            
            // Append sync results to UI
            setMessages((prev) => [
              ...prev,
              { id: userMsgId, role: 'user', content: query },
              { id: botMsgId, role: 'assistant', content: `[SYSTEM_NOTICE]: Synced background payload.\n\n${botText}` }
            ])
          }
        } catch {}
      }

      // Clear local queue
      localStorage.setItem('nomos_offline_queue', JSON.stringify([]))
      toast.success('Sinkronisasi selesai', {
        description: 'Semua transaksi offline berhasil dicatat.'
      })
    } catch {}
  }

  // Intercept submit for Offline handling
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!isOnline) {
      const userMsgId = crypto.randomUUID()
      const botMsgId = crypto.randomUUID()
      
      const newMessages = [
        ...messages,
        { id: userMsgId, role: 'user' as const, content: input }
      ]
      setMessages(newMessages)

      // Try local parser
      const localDraft = parseOfflineCommand(input)
      let botContent = ''

      if (localDraft) {
        botContent = `[SYSTEM_NOTICE]: Offline node active. Transaction details parsed locally.\n\n[TX:${JSON.stringify(localDraft)}]`
      } else {
        // Push raw message to queue
        const queueRaw = localStorage.getItem('nomos_offline_queue')
        const queue = queueRaw ? JSON.parse(queueRaw) : []
        queue.push(input)
        localStorage.setItem('nomos_offline_queue', JSON.stringify(queue))

        botContent = `[SYSTEM_NOTICE]: Connection lost. Payload queued in local buffer. Will sync when online.`
      }

      // Append bot content
      setMessages([
        ...newMessages,
        { id: botMsgId, role: 'assistant' as const, content: botContent }
      ])
      
      // Clear input
      handleInputChange({ target: { value: '' } } as any)
      return
    }

    handleSubmit(e)
  }

  // Handle Photo/Image Upload & OCR Scanning
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isOnline) {
      toast.error('Scanning Gagal', {
        description: '[SYSTEM_NOTICE]: Vision scanning requires an active network node.'
      })
      return
    }

    setIsScanning(true)
    const tempUserMsgId = crypto.randomUUID()
    const tempBotMsgId = crypto.randomUUID()

    // Append synthetic upload logs
    const uploadMessages = [
      ...messages,
      { id: tempUserMsgId, role: 'user' as const, content: `[Attachment: ${file.name}]` },
      { id: tempBotMsgId, role: 'assistant' as const, content: `[SYSTEM_NOTICE]: Scanning payload via optical node...` }
    ]
    setMessages(uploadMessages)

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        const base64Data = reader.result as string

        // Call vision API
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data })
        })

        if (!response.ok) {
          throw new Error('Scanner backend reported an error')
        }

        const data = await response.json()

        // Replace the scanning placeholder with actual AI result
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempBotMsgId ? { ...msg, content: `[SYSTEM_NOTICE]: Transaction extracted!\n\n${data.text}` } : msg
          )
        )
        setIsScanning(false)
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempBotMsgId ? { ...msg, content: `[SYSTEM_NOTICE]: Optical scanner error. Code: ${err.message || 'unknown'}` } : msg
        )
      )
      setIsScanning(false)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setConfirmedIds(new Set())
    toast('Riwayat chat dihapus', { icon: <Trash2 size={13} /> })
  }

  const handleReload = () => {
    if (!messages.length) return
    reload()
    toast('Mengirim ulang pesan...', { icon: <RotateCcw size={13} /> })
  }

  const handleConfirm = (draft: TxDraft, msgId: string, rawPrompt?: string) => {
    setConfirmedIds((prev) => new Set(prev).add(msgId))
    addTransaction({ ...draft, accountName: draft.account, rawPrompt })
    toast.success('Transaksi berhasil dicatat', {
      description: `${draft.description} · ${formatCurrency(draft.amount)}`,
    })
  }

  const handleCancel = (msgId: string) => {
    setConfirmedIds((prev) => new Set(prev).add(msgId))
    toast('Draft transaksi dibatalkan', { icon: <X size={13} /> })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="flex items-center justify-center gap-1.5 bg-[var(--color-negative)]/10 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-negative)] border-b border-[var(--color-negative)]/20">
          <WifiOff className="h-3.5 w-3.5" />
          Air-Gapped Mode Active
        </div>
      )}

      {/* ── Messages area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-4">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center">
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
            const alreadyActioned = confirmedIds.has(msg.id)
            const isSystemLog = visibleText.startsWith('[SYSTEM_NOTICE]')

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
                        : isSystemLog
                          ? 'rounded-bl-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary)] font-mono text-[11px]'
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

          {/* Loading / Scanning indicator */}
          {(isLoading || isScanning) && (
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
              disabled={isLoading || isScanning}
              className="flex h-7 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 text-[10px] font-medium text-[var(--color-secondary)] disabled:opacity-40 active:bg-[var(--color-card-hover)]"
            >
              <RotateCcw className="h-3 w-3" />
              Ulangi
            </button>
            <button
              onClick={handleClearChat}
              disabled={isLoading || isScanning}
              className="flex h-7 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 text-[10px] font-medium text-[var(--color-negative)]/70 disabled:opacity-40 active:bg-[var(--color-card-hover)]"
            >
              <Trash2 className="h-3 w-3" />
              Hapus
            </button>
          </div>
        )}

        {/* Input bar */}
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
        >
          {/* Camera/OCR upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isScanning}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-secondary)] hover:text-white transition-colors disabled:opacity-40"
            aria-label="Kamera OCR"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={isOnline ? "Ketik transaksi..." : "Offline node active..."}
            disabled={isLoading || isScanning}
            id="chat-input"
            autoComplete="off"
            className="flex-1 bg-transparent py-1 text-[13px] text-white placeholder:text-[var(--color-tertiary)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isScanning}
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
