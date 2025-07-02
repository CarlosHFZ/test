import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'http://localhost:3001',
    'http://192.168.0.136:3001',
  ]
};

export default nextConfig;
