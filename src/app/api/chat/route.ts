import { createOpenAI } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'

// OrcaRouter client pointing to Qwen 3.5 35B
const orcarouter = createOpenAI({
  baseURL: 'https://api.orcarouter.ai/v1',
  apiKey: process.env.ORCAROUTER_API_KEY!,
  compatibility: 'compatible',
})

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: orcarouter('qwen/qwen3.5-35b-a3b'),
    system: `Kamu adalah NOMOS AI, asisten keuangan pribadi yang kaku, efisien, dan presisi.
Tugas utamamu adalah mendeteksi transaksi keuangan dari chat pengguna.
Jika pengguna memasukkan data transaksi (pemasukan atau pengeluaran), kamu WAJIB menggunakan tool 'trackTransaction'.
Jika obrolan biasa, balas dengan singkat dan profesional bergaya terminal tech.
Selalu jawab dalam Bahasa Indonesia.`,
    messages,
    tools: {
      trackTransaction: tool({
        description:
          'Mencatat transaksi keuangan baik pemasukan maupun pengeluaran',
        parameters: z.object({
          amount: z
            .number()
            .describe('Nominal uang dalam angka saja, contoh: 50000'),
          type: z
            .enum(['INCOME', 'EXPENSE'])
            .describe(
              'Jenis transaksi: INCOME (pemasukan) atau EXPENSE (pengeluaran)'
            ),
          account: z
            .string()
            .describe(
              'Nama akun/dompet yang digunakan, contoh: BCA, Gopay, Cash'
            ),
          category: z
            .string()
            .describe(
              'Kategori logis seperti Food, Transport, Utilities, Entertainment, Gadget'
            ),
          description: z
            .string()
            .describe(
              'Deskripsi singkat transaksi, contoh: Beli kopi Starbucks'
            ),
        }),
        execute: async (args) => {
          // TODO: Connect to Prisma database for real persistence
          // For now, return draft data for UI confirmation card
          return {
            status: 'draft',
            data: args,
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
