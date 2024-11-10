/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    unoptimized: true
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  experimental: {
    optimizeCss: false,
    scrollRestoration: true
  },
  output: 'standalone'
}

module.exports = nextConfig 