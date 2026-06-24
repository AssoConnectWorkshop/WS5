import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "/home/user/WS5",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
