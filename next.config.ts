import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the project root to silence the inferred root warning
    root: __dirname,
  },
};

export default nextConfig;
