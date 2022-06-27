/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: function (config, options) {
    if (!options.isServer) {
      config.resolve.fallback = {
        fs: false,
        events: require.resolve('events')
      }
    }
    config.experiments = { asyncWebAssembly: true };
    return config;
  },
}

module.exports = {
  nextConfig,
  eslint: {
    ignoreDuringBuilds: true,
  }
}
