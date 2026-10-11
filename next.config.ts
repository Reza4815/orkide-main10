import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/uploads/:file", destination: "/api/public/media/:file" },
    ];
  },
};

export default nextConfig;
