

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CORS configuration for API routes
  async headers() {
    return [
      {
        source: "/api/(.*)", // Apply to all API routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins for testing (should be restricted in production)
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.externals.push({
      bufferutil: "commonjs bufferutil",
      "commonjs utf-8-validate": "utf-8-validate",
    })

    return config
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https", // The protocol is HTTPS
        hostname: "jiby591fud.ufs.sh", // The hostname where images are hosted
        port: "",
        pathname: "/**", // Allow all paths on the server
      },
      {
        protocol: "https", // The protocol for utfs.io
        hostname: "utfs.io", // The hostname for utfs.io
        port: "",
        pathname: "/**", // Allow all paths on the server
      },
    ],
  },
};

export default nextConfig;
