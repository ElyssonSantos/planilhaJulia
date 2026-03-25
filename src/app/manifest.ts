import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Piggy Bank Personal Finance',
    short_name: 'Piggy Bank',
    description: 'A modern PWA for personal financial management',
    start_url: '/',
    display: 'standalone',
    background_color: '#16a34a',
    theme_color: '#16a34a',
    icons: [
      {
        src: '/piggy.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/piggy.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
