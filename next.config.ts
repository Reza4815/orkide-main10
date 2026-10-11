import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // برای رفع خطای HMR state update
  images: {
    remotePatterns: [
      {protocol: "https", hostname: "**.supabase.co"},
      {protocol: "https", hostname: "*.public.blob.vercel-storage.com"},
    ],
    unoptimized: true, // برای رفع 400 تصاویر لوکال
  },
};

export default nextConfig;
