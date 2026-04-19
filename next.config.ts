import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - Kita gunakan ini agar TypeScript mengabaikan pengecekan baris bawahnya
  allowedDevOrigins: ['192.168.1.3'], 
};

export default nextConfig;