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
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // Modify experimental features
  experimental: {
    optimizeCss: false, // Disable CSS optimization temporarily
    scrollRestoration: true
  },
  // Add output configuration
  output: 'standalone'
}

module.exports = nextConfig
