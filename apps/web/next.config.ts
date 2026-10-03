import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  async redirects() {
    // The Works page used to be advertised at /work; keep old links and search results working.
    return [{ source: "/work", destination: "/works", permanent: true }];
  },
};

export default nextConfig;
