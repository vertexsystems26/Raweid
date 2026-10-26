import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only needed if/when next/image starts being used against Storage-hosted
    // images; the admin pages currently render uploads with plain <img>.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.app" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
    ],
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
