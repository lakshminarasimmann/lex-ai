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
