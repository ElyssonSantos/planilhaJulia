/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  // Desativar Turbopack forçadamente para compatibilidade com Webpack
  webpack: (config) => {
    return config;
  },
  // Configuração vazia de turbopack ajuda a silenciar avisos do Next 16
  experimental: {
    turbo: {},
  },
};

module.exports = withPWA(nextConfig);
