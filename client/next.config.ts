import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  turbopack: {
    root: __dirname,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;