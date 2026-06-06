'use client'

import { useState, useCallback } from 'react'
import { Terminal, ArrowRight, Loader2 } from 'lucide-react'

export function QuickCommand() {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastResult, setLastResult] = useState<string | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return
    setIsProcessing(true)
    setLastResult(null)
    await new Promise((r) => setTimeout(r, 1200))
    setLastResult(`"${input.trim()}"`)
    setInput('')
    setIsProcessing(false)
  }, [input, isProcessing])

  return (
    <div className="px-5">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
          <Terminal className="h-4 w-4 shrink-0 text-[var(--color-tertiary)]" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="beli kopi 25rb pake gopay..."
            disabled={isProcessing}
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-[var(--color-tertiary)] focus:outline-none disabled:opacity-50"
            id="quick-command-input"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-opacity disabled:opacity-20"
            aria-label="Submit"
          >
            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
      {lastResult && (
        <p className="mt-2 px-1 animate-[fade-in_0.3s_ease] font-financial text-[11px] text-[var(--color-positive)]">
          ✓ Recorded: {lastResult}
        </p>
      )}
    </div>
  )
}
