import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // WARNING: Allows all domains. Better to list specific ones like 'i.imgur.com'
      },
    ],
  },
};

export default nextConfig;