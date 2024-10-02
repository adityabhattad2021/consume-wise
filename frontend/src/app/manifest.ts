import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ConsumeWise v0.1',
    short_name: 'Consumewise',
    background_color: '#000',
    theme_color: '#16a34a',
    description: 'ConsumeWise is an AI-powered product review catalog and consumption tracker that helps users make informed decisions about healthier FMCG food alternatives',
    start_url: '/',
    display: 'standalone',
    id: 'ConsumeWise',
    icons: [
      {
        src: '/images/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/android-chrome-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
    ],
  }
}