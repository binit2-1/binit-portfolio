import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  async redirects() {
    // v1 URLs that no longer exist; keep old links and search results working.
    return [
      { source: "/work", destination: "/works", permanent: true },
      { source: "/about", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
