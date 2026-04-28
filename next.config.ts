import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Mengizinkan akses HMR dari IP jaringan lokal untuk pengembangan mobile/tablet
  allowedDevOrigins: ['192.168.1.3', '192.168.1.6'], 
};

export default nextConfig;