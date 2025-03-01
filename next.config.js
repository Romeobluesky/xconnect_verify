/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  poweredByHeader: false,
  experimental: {
    // 실험적 기능 비활성화
    esmExternals: false
  }
};

module.exports = nextConfig;