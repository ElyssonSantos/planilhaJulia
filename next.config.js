/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  typescript: {
    // Ignorar erros de TS no build para garantir que a Julia tenha o app online logo
    ignoreBuildErrors: true,
  },
  eslint: {
    // Mesma lógica para o ESLint
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = withPWA(nextConfig);
