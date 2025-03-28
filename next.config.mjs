/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
      serverComponentsExternalPackages: ["mongoose", "socket.io", "socket.io-client"],
    },
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
      
      // Support for WebSockets
      if (!config.isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          net: false,
          tls: false,
          fs: false,
        };
      }
      
      return config
    },
    // Define custom server script
    devServer: {
      command: 'node server.js',
      port: 3000,
    }
  }
  
  export default nextConfig