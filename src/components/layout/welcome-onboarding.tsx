'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useUser } from '@/lib/user-store'

export function WelcomeOnboarding() {
  const { isNewUser, setUserName } = useUser()
  const [name, setName] = useState('')
  const [step, setStep] = useState<'welcome' | 'name'>('welcome')

  if (!isNewUser) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_0.3s_ease] p-6">
      <div className="w-full max-w-[360px] rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl animate-[scale-in_0.3s_ease]">
        {step === 'welcome' ? (
          <div className="flex flex-col items-center gap-5 text-center">
            {/* Logo */}
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-lg">
              <Image src="/logo1.png" alt="NOMOS" fill className="object-cover" />
            </div>

            <div>
              <h2 className="text-[22px] font-bold text-[var(--color-foreground)] tracking-tight">
                Selamat Datang! 👋
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-secondary)]">
                NOMOS bantu kamu mencatat keuangan dengan mudah. Cukup ketik atau foto struk, sisanya biar AI yang urus.
              </p>
            </div>

            <button
              onClick={() => setStep('name')}
              className="w-full rounded-2xl bg-[var(--color-foreground)] py-3.5 text-[14px] font-bold text-[var(--color-background)] transition-opacity active:opacity-80"
            >
              Mulai Sekarang
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-[var(--color-foreground)] tracking-tight">
                Siapa nama kamu? 😊
              </h2>
              <p className="mt-1 text-[13px] text-[var(--color-secondary)]">
                Biar NOMOS bisa menyapa kamu
              </p>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik nama kamu..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) setUserName(name)
              }}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-tertiary)] focus:outline-none focus:border-[var(--color-border-hover)]"
            />

            <button
              onClick={() => { if (name.trim()) setUserName(name) }}
              disabled={!name.trim()}
              className="w-full rounded-2xl bg-[var(--color-foreground)] py-3.5 text-[14px] font-bold text-[var(--color-background)] transition-opacity disabled:opacity-30 active:opacity-80"
            >
              Lanjut →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
