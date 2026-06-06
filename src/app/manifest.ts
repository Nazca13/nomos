import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NOMOS Financial System',
    short_name: 'NOMOS',
    description: 'Autonomous Financial Intelligence System',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#06b6d4',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
