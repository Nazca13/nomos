import withPWAInit from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // <-- Tambahkan baris ini untuk membungkam eror Next.js 16
}

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
})

export default withPWA(nextConfig)