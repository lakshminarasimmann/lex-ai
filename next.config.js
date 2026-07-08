/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during Vercel builds
  typescript: {
    ignoreBuildErrors: true,
  },


  // Security Headers for Vercel Edge
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data: https://blob.vercel-storage.com; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://vercel.live wss://ws-us3.pusher.com;",
          },
        ],
      },
    ];
  },

  // Rewrite Python API routes
  async rewrites() {
    return [
      {
        source: '/api/py/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/:path*'
            : '/api/:path*',
      },
    ];
  },

  // Webpack config for react-pdf
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },

  // External packages that shouldn't be bundled for server components
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  // Image domains for external images
  images: {
    domains: ['blob.vercel-storage.com'],
  },
};

module.exports = nextConfig;
