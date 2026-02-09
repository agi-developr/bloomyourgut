import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/webhooks/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/blog/:slug',
        destination: '/articles/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
