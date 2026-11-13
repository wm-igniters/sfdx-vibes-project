import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: 'build',
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  reactStrictMode: false,
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true, // This flag is added for temporary. Ignores all TypeScript errors during `npm run build`
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
