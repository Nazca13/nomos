import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const orcarouter = createOpenAI({
  baseURL: 'https://api.orcarouter.ai/v1',
  apiKey: process.env.ORCAROUTER_API_KEY!,
  compatibility: 'compatible',
} as any)

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Clean base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

    const result = await generateText({
      model: orcarouter('google/gemini-2.5-flash') as any,
      system: `Kamu adalah NOMOS OCR Engine. Deteksi dan ekstrak detail transaksi dari gambar struk, nota, atau screenshot mutasi bank.

Kembalikan informasi tersebut DALAM SATU BARIS FORMAT MARKER BERIKUT SAJA (jangan ada penjelasan lain):
[TX:{"amount":jumlah_uang_tanpa_simbol,"type":"INCOME_ATAU_EXPENSE","account":"Nama_Akun_Bank_Atau_Ewallet","category":"Kategori_Pengeluaran","description":"Deskripsi_Singkat_Transaksi"}]

Rules:
- amount: angka bulat positif (contoh: 25000)
- type: 'INCOME' untuk pemasukan/transfer masuk, atau 'EXPENSE' untuk pengeluaran/belanja/cicilan/transfer keluar
- account: coba tebak nama bank/e-wallet (Gopay, OVO, BCA, Mandiri, Cash, dll). Jika tidak ada petunjuk, default ke 'Gopay' untuk e-money atau 'Cash' jika struk fisik.
- category: pilih kategori yang relevan (Food, Transport, Utilities, Entertainment, Shopping, Salary, Investment, Bills, dll)
- description: deskripsi singkat barang/merchant (contoh: 'Starbucks Coffee', 'Grab Ride', dll)

Jika gambar sama sekali tidak mengandung transaksi keuangan, balas dengan:
[SYSTEM_NOTICE]: Scan gagal. Payload tidak mengandung data keuangan valid.`,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Scan gambar ini dan ekstrak transaksinya.',
            },
            {
              type: 'image',
              image: base64Data,
            },
          ],
        },
      ],
    })

    return new Response(JSON.stringify({ text: result.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('OCR Scan error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
