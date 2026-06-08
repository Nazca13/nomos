<div align="center">

<br />

<img src="public/icon-192x192.png" alt="NOMOS" width="80" height="80" style="border-radius: 20px" />

<br />
<br />

# NOMOS

**Personal Financial Intelligence — Mobile First**

A mobile-first PWA for tracking personal finances with an AI-powered command center. Record transactions in natural Bahasa Indonesia, visualize cash flow, and manage your budget — all from your phone.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-6-black?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square)

</div>

---

## Overview

NOMOS is a **mobile-first Progressive Web App** that serves as a personal finance command center. Instead of manually filling forms, users can type transactions in natural language ("Gaji masuk 8.5jt di BCA" or "abis beli kopi gopay 25rb") — the AI engine extracts the financial entities and presents a confirmation draft before saving.

---

## Features

### Command Center (AI Chat & Vision OCR Scanner)
- **Natural Language Parsing**: Type transactions in natural language (Bahasa Indonesia).
- **NOMOS Vision Module (AI OCR)**: Upload or take photos of receipts, invoices, or banking screenshots. The `google/gemini-2.5-flash` model parses details directly into structured transaction drafts.
- **Dynamic Draft Card**: Confirmation UI is rendered instantly from OCR or chat response before committing to the ledger.
- **Air-Gapped Protocol**: Full offline recording support. Features a client-side regex command parser fallback when offline, saving inputs in local sync queues.

### The Vault (Net Worth Aggregator)
- **Net Worth Aggregator**: Consolidate liquid cash from bank ledgers and custom assets (e.g. Gold, Crypto, Mutual Funds, Physical Assets) to track total wealth.
- **AI Portfolio Advisor**: Real-time evaluation of asset allocation with terminal-vibe advice on diversification and risk exposure.
- **Subscription Manager**: Set up recurring billing cycles (e.g. Netflix, Spotify, Internet) with auto-execution on due dates.

### AI Automated Audit Node
- **Anomaly Detection**: Scans transactions in the background to identify abnormal category spikes, outlying transactions, or micro-transaction subscription leaks.
- **Audit Console Logs**: High-fidelity terminal-styled security console on the dashboard displaying warnings and health flags.

### Dashboard & Smart Ledger
- **Vault Widget** — Total balance across all accounts with a 7-day sparkline.
- **Budget Radar** — Progress tracking of spending against category limits.
- **Cashflow Matrix** — 6-month visual bar chart comparing income vs. expenses.
- **Ledger** — Chronological audit trail with manual overrides and detail cards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 — vanilla CSS variables, no utility bloat |
| AI Runtime | Vercel AI SDK 6 — `streamText`, `generateText` |
| LLM Provider | OrcaRouter — Qwen 3.5 (Chat), Gemini 2.5 Flash (Vision OCR) |
| State | React Context + LocalStorage (Transactions & Subscriptions) |
| Icons | Lucide React |
| Charts | Recharts |
| Toast | Sonner |
| PWA | `@ducanh2912/next-pwa` |
| ORM | Prisma + PostgreSQL *(configured, database-ready)* |

---

## Project Structure

```
src/
├── app/
│   ├── api/chat/          # AI streaming endpoint
│   ├── dashboard/
│   ├── command-center/
│   ├── ledger/
│   └── layout.tsx         # TransactionProvider + Toaster
├── components/
│   ├── layout/            # AppShell, BottomNav
│   ├── pages/
│   │   ├── dashboard/     # VaultWidget, BudgetRadar, CashflowMatrix
│   │   ├── command-center/# ChatStream, DraftCard
│   │   └── ledger/        # LedgerPage, TransactionTable, Sheets
│   └── ui/                # BottomSheet, shared primitives
├── lib/
│   ├── transaction-store.tsx  # Global state (Context + localStorage)
│   └── utils.ts               # formatCurrency, cn, helpers
└── types/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [OrcaRouter](https://orcarouter.ai) account with a valid API key

### Installation

```bash
# Clone
git clone https://github.com/Nazca13/nomos.git
cd nomos

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
ORCAROUTER_API_KEY="sk-your-key-here"
```

> Get your API key from [orcarouter.ai](https://orcarouter.ai) — Dashboard → API Keys

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone or use Chrome DevTools mobile emulation (430px width recommended).

### Build

```bash
npm run build
npm start
```

---

## AI Architecture

The Command Center uses a **structured text protocol** instead of tool-calling, for maximum compatibility with OpenAI-compatible providers:

```
User: "abis bayar grab 32rb pake gopay"
         ↓
  OrcaRouter / Qwen 3.5 35B
         ↓
AI Response: "Transaksi tercatat.
              [TX:{"amount":32000,"type":"EXPENSE","account":"Gopay","category":"Transport","description":"Grab"}]"
         ↓
  Client parses [TX:...] marker
         ↓
  DraftCard rendered → User confirms → addTransaction()
```

This approach works with **any OpenAI-compatible provider** — no tool schema validation, no streaming format issues.

---

## Data Persistence

All financial data is stored in `localStorage` under the key `nomos_transactions_v1`. This means:

- Data is **local to the device and browser**
- No account or backend required to get started
- Prisma + PostgreSQL schema is included for future cloud sync

---

## Roadmap

- [ ] Export to CSV / PDF
- [ ] Search & Filter in Ledger
- [ ] Custom budget goal limits
- [ ] AI spending insights ("Analisis bulan ini")
- [x] Recurring transaction reminders
- [ ] Cloud sync via Prisma + PostgreSQL
- [ ] PWA push notifications for budget alerts

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with precision. Designed for clarity.

</div>
