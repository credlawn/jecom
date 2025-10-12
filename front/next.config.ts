import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
    API_PATH: process.env.API_PATH,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.29.184",
        port: "8000",
        pathname: "/files/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/files/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "credlawn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
