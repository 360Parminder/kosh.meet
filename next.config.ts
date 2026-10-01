import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@360parminder/db", "@360parminder/auth"],
};

export default nextConfig;
