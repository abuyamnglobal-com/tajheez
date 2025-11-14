import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  experimental: {},
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
