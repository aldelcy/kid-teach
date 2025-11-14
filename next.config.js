/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PWA will be handled by service worker
  // Optimize for tablet-first
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [],
    unoptimized: true, // Allow unoptimized images for local assets
    remotePatterns: [],
  },
  // Enable static exports if needed for offline
  output: 'standalone',
}

module.exports = nextConfig

