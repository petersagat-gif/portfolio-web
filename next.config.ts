import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  devIndicators: false, // keeps dev screenshots clean
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(), // a stray package-lock.json in the home folder otherwise confuses root detection
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    optimizePackageImports: ["@react-three/drei"],
    // The root layout lives under app/[lang], so unmatched URLs need a global 404 (app/global-not-found.tsx).
    globalNotFound: true,
  },
  // English is served from the root, Slovak from /sk. Routes live under app/[lang].
  // afterFiles: public files (e.g. /work/stepra.svg) win over the rewrite.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: "/work/:slug", destination: "/en/work/:slug" },
      ],
      fallback: [],
    };
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
