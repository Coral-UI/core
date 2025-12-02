/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@reallygoodwork/coral-core',
    '@reallygoodwork/coral-to-html',
    '@reallygoodwork/coral-to-react',
    '@reallygoodwork/react-to-coral',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
