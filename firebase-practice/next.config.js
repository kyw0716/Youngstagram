/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
}

module.exports = nextConfig
