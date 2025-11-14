import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  experimental: {
  },
  basePath: '/tajheez',
  assetPrefix: '/tajheez/',
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
