'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Landmark, Sparkles } from 'lucide-react'
import { useTransactions } from '@/lib/transaction-store'
import { useSubscriptions, type Subscription } from '@/lib/subscription-store'
import { getVaultAssets, createVaultAsset as createDbAsset, deleteVaultAsset as deleteDbAsset } from '@/app/actions'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface CustomAsset {
  id: string
  name: string
  type: 'Crypto' | 'Emas' | 'Reksadana' | 'Fisik' | 'Lainnya'
  value: number
}

export function VaultPage() {
  const { totalBalance } = useTransactions()
  const { subscriptions, addSubscription, deleteSubscription, toggleSubscription } = useSubscriptions()

  const [assets, setAssets] = useState<CustomAsset[]>([])
  const [showAddAsset, setShowAddAsset] = useState(false)
  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState<CustomAsset['type']>('Emas')
  const [assetValue, setAssetValue] = useState('')

  const [showAddSub, setShowAddSub] = useState(false)
  const [subName, setSubName] = useState('')
  const [subAmount, setSubAmount] = useState('')
  const [subAccount, setSubAccount] = useState('Gopay')
  const [subCategory, setSubCategory] = useState('Entertainment')
  const [subBillingDate, setSubBillingDate] = useState('1')

  // Hydrate custom assets from DB
  useEffect(() => {
    async function fetchAssets() {
      try {
        const data = await getVaultAssets()
        setAssets(data as CustomAsset[])
      } catch (e) {
        console.error(e)
      }
    }
    fetchAssets()
  }, [])

  // Add Custom Asset
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assetName || !assetValue) return

    const val = parseFloat(assetValue.replace(/[^0-9]/g, ''))
    if (isNaN(val)) return

    const newAsset: CustomAsset = {
      id: crypto.randomUUID(),
      name: assetName,
      type: assetType,
      value: val,
    }

    const next = [...assets, newAsset]
    setAssets(next)
    createDbAsset({ name: assetName, type: assetType, value: val }).catch(console.error)
    setAssetName('')
    setAssetValue('')
    setShowAddAsset(false)
    toast.success('Aset ditambahkan ke Vault')
  }

  // Delete Custom Asset
  const handleDeleteAsset = (id: string) => {
    const next = assets.filter((a) => a.id !== id)
    setAssets(next)
    deleteDbAsset(id).catch(console.error)
    toast('Aset dihapus dari Vault')
  }

  // Add Subscription
  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subName || !subAmount || !subBillingDate) return

    const amt = parseFloat(subAmount.replace(/[^0-9]/g, ''))
    const date = parseInt(subBillingDate)

    if (isNaN(amt) || isNaN(date) || date < 1 || date > 31) {
      toast.error('Data tagihan tidak valid')
      return
    }

    addSubscription({
      name: subName,
      amount: amt,
      type: 'EXPENSE',
      account: subAccount,
      category: subCategory,
      billingDate: date,
    })

    setSubName('')
    setSubAmount('')
    setSubBillingDate('1')
    setShowAddSub(false)
    toast.success('Tagihan rutin berhasil dibuat')
  }

  // Calculations
  const totalCustomAssets = assets.reduce((sum, a) => sum + a.value, 0)
  const netWorth = totalBalance + totalCustomAssets

  const liquidPercent = netWorth > 0 ? (totalBalance / netWorth) * 100 : 0
  const customPercent = netWorth > 0 ? (totalCustomAssets / netWorth) * 100 : 0

  // Asset group allocation
  const cryptoVal = assets.filter(a => a.type === 'Crypto').reduce((sum, a) => sum + a.value, 0)
  const emasVal = assets.filter(a => a.type === 'Emas').reduce((sum, a) => sum + a.value, 0)
  const reksaVal = assets.filter(a => a.type === 'Reksadana').reduce((sum, a) => sum + a.value, 0)
  const fisikVal = assets.filter(a => a.type === 'Fisik' || a.type === 'Lainnya').reduce((sum, a) => sum + a.value, 0)

  const cryptoPercent = netWorth > 0 ? (cryptoVal / netWorth) * 100 : 0
  const emasPercent = netWorth > 0 ? (emasVal / netWorth) * 100 : 0
  const reksaPercent = netWorth > 0 ? (reksaVal / netWorth) * 100 : 0
  const fisikPercent = netWorth > 0 ? (fisikVal / netWorth) * 100 : 0

  // Heuristic Portfolio Advisor
  let portfolioAdvice = ''
  let adviceType: 'info' | 'warning' = 'info'

  if (liquidPercent > 60) {
    portfolioAdvice = `Aset likuid (Cash) Anda saat ini cukup tinggi (${liquidPercent.toFixed(0)}%). Disarankan untuk memindahkan sebagian (misal 15-20%) ke Emas atau Reksadana untuk menjaga nilai aset Anda dari gerusan inflasi.`
  } else if (cryptoPercent > 30) {
    portfolioAdvice = `[WARNING]: Alokasi aset Kripto Anda sangat tinggi (${cryptoPercent.toFixed(0)}%). Kripto memiliki volatilitas ekstrem. Pertimbangkan untuk merealisasikan sebagian keuntungan dan diversifikasi ke aset yang lebih stabil seperti Emas.`
    adviceType = 'warning'
  } else if (liquidPercent < 15) {
    portfolioAdvice = `[WARNING]: Aset likuid (Cash) Anda terlalu rendah (${liquidPercent.toFixed(0)}%). Pastikan dana darurat Anda mencukupi (minimal 3-6 bulan pengeluaran rutin) sebelum berinvestasi lebih lanjut.`
    adviceType = 'warning'
  } else {
    portfolioAdvice = `Alokasi portofolio Anda seimbang. Anda memiliki proteksi likuiditas yang baik (${liquidPercent.toFixed(0)}% Cash) dikombinasikan dengan aset lindung nilai dan pertumbuhan.`
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-14 pb-24 animate-[fade-in_0.3s_ease]">
      {/* Header */}
      <div>
        <p className="text-[12px] text-[var(--color-secondary)]">Net Worth Vault</p>
        <h1 className="text-[20px] font-bold tracking-tight text-[var(--color-foreground)]">The Vault</h1>
      </div>

      {/* Net Worth Core Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-foreground)]/[0.01] to-transparent pointer-events-none" />
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-tertiary)] mb-1">
          <Landmark className="h-3.5 w-3.5" />
          Kekayaan Bersih (Net Worth)
        </div>
        <p className="font-financial text-[28px] font-bold text-[var(--color-foreground)] tracking-tight leading-none mb-3">
          {formatCurrency(netWorth)}
        </p>
        
        {/* Simple allocation bar */}
        <div className="h-2 w-full rounded-full bg-[var(--color-foreground)]/[0.04] overflow-hidden flex gap-[2px] mb-2">
          {liquidPercent > 0 && <div className="bg-[var(--color-foreground)] h-full" style={{ width: `${liquidPercent}%` }} />}
          {emasPercent > 0 && <div className="bg-amber-400 h-full" style={{ width: `${emasPercent}%` }} />}
          {cryptoPercent > 0 && <div className="bg-purple-500 h-full" style={{ width: `${cryptoPercent}%` }} />}
          {reksaPercent > 0 && <div className="bg-emerald-400 h-full" style={{ width: `${reksaPercent}%` }} />}
          {fisikPercent > 0 && <div className="bg-blue-400 h-full" style={{ width: `${fisikPercent}%` }} />}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[10px] text-[var(--color-secondary)] font-medium">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[var(--color-foreground)]" />
            Cash ({liquidPercent.toFixed(0)}%)
          </div>
          {emasPercent > 0 && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Emas ({emasPercent.toFixed(0)}%)
            </div>
          )}
          {cryptoPercent > 0 && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Crypto ({cryptoPercent.toFixed(0)}%)
            </div>
          )}
          {reksaPercent > 0 && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Reksadana ({reksaPercent.toFixed(0)}%)
            </div>
          )}
        </div>
      </div>

      {/* AI Advisor Panel */}
      <div className={`rounded-xl border p-4 text-[12px] leading-relaxed font-mono ${
        adviceType === 'warning'
          ? 'border-[var(--color-negative)]/20 bg-[var(--color-negative)]/5 text-[var(--color-negative)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)]'
      }`}>
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1.5 text-[var(--color-foreground)]">
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
          AI Portfolio Advisor
        </div>
        <p>{portfolioAdvice}</p>
      </div>

      {/* Custom Assets List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-[var(--color-foreground)]">Daftar Aset Vault</h2>
          <button
            onClick={() => setShowAddAsset(!showAddAsset)}
            className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1 text-[10px] font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)]"
          >
            <Plus className="h-3 w-3" /> Tambah
          </button>
        </div>

        {/* Add Asset Form */}
        {showAddAsset && (
          <form onSubmit={handleAddAsset} className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 flex flex-col gap-3 animate-[slide-up_0.2s_ease]">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Aset (misal: Bitcoin)"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                required
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-border-hover)]"
              />
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as any)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-foreground)] focus:outline-none"
              >
                <option value="Emas">Emas</option>
                <option value="Crypto">Crypto</option>
                <option value="Reksadana">Reksadana</option>
                <option value="Fisik">Fisik (Motor/Laptop)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nilai Aset (Rp)"
                value={assetValue}
                onChange={(e) => setAssetValue(e.target.value)}
                required
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-border-hover)]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[var(--color-foreground)] px-4 text-[12px] font-bold text-[var(--color-background)]"
              >
                Simpan
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between rounded-xl bg-[var(--color-foreground)]/[0.02] p-3 text-[13px] border border-[var(--color-border)]">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-[var(--color-foreground)]" />
              <span className="font-medium text-[var(--color-foreground)]">Likuiditas (Cash Ledger)</span>
            </div>
            <span className="font-financial font-bold text-[var(--color-foreground)]">{formatCurrency(totalBalance)}</span>
          </div>

          {assets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between rounded-xl bg-[var(--color-card)] p-3 text-[13px] border border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${
                  asset.type === 'Emas' ? 'bg-amber-400' :
                  asset.type === 'Crypto' ? 'bg-purple-500' :
                  asset.type === 'Reksadana' ? 'bg-emerald-400' : 'bg-blue-400'
                }`} />
                <div className="flex flex-col">
                  <span className="font-medium text-[var(--color-foreground)]">{asset.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--color-tertiary)]">{asset.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-financial font-bold text-[var(--color-foreground)]">{formatCurrency(asset.value)}</span>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="text-[var(--color-tertiary)] hover:text-[var(--color-negative)] transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Manager */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-[var(--color-foreground)]">Tagihan Rutin</h2>
          <button
            onClick={() => setShowAddSub(!showAddSub)}
            className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1 text-[10px] font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)]"
          >
            <Plus className="h-3 w-3" /> Tambah
          </button>
        </div>

        {/* Add Subscription Form */}
        {showAddSub && (
          <form onSubmit={handleAddSub} className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 flex flex-col gap-3 animate-[slide-up_0.2s_ease]">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Tagihan (e.g. Kosan)"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                required
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-foreground)] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Nominal (Rp)"
                value={subAmount}
                onChange={(e) => setSubAmount(e.target.value)}
                required
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-foreground)] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={subAccount}
                onChange={(e) => setSubAccount(e.target.value)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 text-[12px] text-[var(--color-foreground)] focus:outline-none"
              >
                <option value="Gopay">Gopay</option>
                <option value="BCA">BCA</option>
                <option value="Cash">Cash</option>
                <option value="Mandiri">Mandiri</option>
              </select>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 text-[12px] text-[var(--color-foreground)] focus:outline-none"
              >
                <option value="Entertainment">Hiburan</option>
                <option value="Utilities">Utilitas</option>
                <option value="Food">Makanan</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5">
              <span className="text-[12px] text-[var(--color-secondary)] whitespace-nowrap">Jatuh Tempo: Tgl</span>
              <input
                type="number"
                placeholder="1-31"
                min="1"
                max="31"
                value={subBillingDate}
                onChange={(e) => setSubBillingDate(e.target.value)}
                required
                className="w-full bg-transparent text-[12px] text-[var(--color-foreground)] focus:outline-none font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--color-foreground)] py-1.5 text-[12px] font-bold text-[var(--color-background)]"
            >
              Buat Tagihan
            </button>
          </form>
        )}

        <div className="flex flex-col gap-1.5">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between rounded-xl bg-[var(--color-card)] p-3 text-[13px] border border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSubscription(sub.id)}
                  className="text-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
                >
                  {sub.isActive ? (
                    <ToggleRight className="h-7 w-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-[var(--color-tertiary)]" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span className={cn('font-medium text-[var(--color-foreground)]', !sub.isActive && 'line-through text-[var(--color-tertiary)]')}>{sub.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--color-tertiary)]">
                    Tiap tanggal {sub.billingDate} via {sub.account}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-financial font-bold text-[var(--color-foreground)]">{formatCurrency(sub.amount)}</span>
                <button
                  onClick={() => deleteSubscription(sub.id)}
                  className="text-[var(--color-tertiary)] hover:text-[var(--color-negative)] transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
