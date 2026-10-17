import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // The original Attention animation was replaced by the guided lesson (October 2026).
      {
        source: "/prototypes/attention-mechanism-intuition.html",
        destination: "/topic/attention-mechanism-intuition",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
