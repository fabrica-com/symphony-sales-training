/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow cross-origin requests from localhost for local development
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
}

export default nextConfig
