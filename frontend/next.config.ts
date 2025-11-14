import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  experimental: {
    appDir: true,
    outputStandalone: true,
  },
  basePath: '/tajheez',
  assetPrefix: '/tajheez/',
  srcDir: 'src',
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
