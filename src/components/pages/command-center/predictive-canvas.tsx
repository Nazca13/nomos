'use client'

import { TrendingUp, AlertCircle } from 'lucide-react'
import { Sparkline } from '@/components/ui/sparkline'
import { formatCurrency } from '@/lib/utils'

const BAL = 13_620_000
const PROJ = [13.6, 13.2, 12.8, 12.4, 12.0, 11.8, 11.5, 11.2, 10.9, 10.6, 10.3, 10.1, 9.8, 9.6, 9.4, 9.2, 9.0, 8.8, 17.3, 16.9, 16.5, 16.1, 15.7, 15.3, 14.9, 14.5, 14.1, 13.7, 13.3, 12.9]
const projEnd = PROJ[PROJ.length - 1] * 1_000_000
const change = ((projEnd - BAL) / BAL * 100).toFixed(1)

const INSIGHTS = [
  { type: 'info' as const, msg: 'Gaji berikutnya diproyeksikan masuk tanggal 25.' },
  { type: 'warning' as const, msg: 'Budget Food tersisa 18%. Kurangi frekuensi makan luar.' },
]

export function PredictiveCanvas() {
  return (
    <div className="flex flex-col gap-4 px-5 animate-[fade-in_0.3s_ease]">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">Proyeksi 30 Hari</span>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">Saldo Saat Ini</span>
            <p className="font-financial text-[20px] font-bold text-white">{formatCurrency(BAL)}</p>
          </div>
          <span className={`font-financial text-[12px] font-bold ${projEnd >= BAL ? 'text-positive' : 'text-negative'}`}>
            {projEnd >= BAL ? '+' : ''}{change}%
          </span>
        </div>
        <div className="mt-3">
          <Sparkline data={PROJ} width={300} height={60} color="#fff" className="w-full" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[9px] text-[var(--color-tertiary)]">Today</span>
          <span className="text-[9px] text-[var(--color-tertiary)]">30 days</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-tertiary)]">AI Insights</span>
        {INSIGHTS.map((ins, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-3">
            <AlertCircle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${ins.type === 'warning' ? 'text-[var(--color-warning)]' : 'text-white'}`} />
            <span className="text-[12px] leading-relaxed text-[var(--color-secondary)]">{ins.msg}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] px-3 py-2">
        <span className="font-financial text-[9px] text-[var(--color-tertiary)]">B(t) = B₀ + ΣIᵢ(t) − ΣEⱼ(t) − (ω · M_avg · t)</span>
      </div>
    </div>
  )
}
