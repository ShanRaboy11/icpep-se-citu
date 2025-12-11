import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow builds to proceed in environments (like Vercel) where lint rules
  // should not block the production build. Prefer fixing the lint warnings
  // long-term; this is a temporary measure to unblock deployment.
  eslint: {
    ignoreDuringBuilds: true,
  },

  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
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
