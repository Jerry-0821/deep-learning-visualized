import type { NextConfig } from "next";

// Pages that only exist to be embedded inside /topic/* lessons. Search engines should not list
// them on their own ("noindex"), but may still count their content as part of the lesson page
// that embeds them ("indexifembedded").
// ":path+" needs at least one segment, so the real /mindmap page itself is not affected.
const embeddedOnlyPaths = ["/topic-design-previews/:path+", "/prototypes/:path+", "/mindmap/:path+"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return embeddedOnlyPaths.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, indexifembedded" }],
    }));
  },
  async redirects() {
    return [
      // The original Attention animation was replaced by the guided lesson (October 2026).
      {
        source: "/prototypes/attention-mechanism-intuition.html",
        destination: "/topic/attention-mechanism-intuition",
        permanent: true,
      },
      // The original Pooling animation was replaced by the guided lesson (October 2026).
      {
        source: "/prototypes/pooling.html",
        destination: "/topic/pooling",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
