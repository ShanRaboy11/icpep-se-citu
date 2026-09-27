import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // The dashboard used to live at a role-named URL each; old bookmarks and
  // links land on the single /dashboard now.
  async redirects() {
    return [
      { source: "/dashboard/officer", destination: "/dashboard", permanent: true },
      { source: "/dashboard/student", destination: "/dashboard", permanent: true },
    ];
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
    // File-change events don't reach the container under Docker on Windows/Mac,
    // so docker-compose turns polling on; everywhere else the default is better.
    if (!isServer && process.env.WATCHPACK_POLLING === "true") {
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
