import type { NextConfig } from "next"

import createMDX from "@next/mdx"
import remarkGfm from "remark-gfm"

const nextConfig: NextConfig = {
  /* config options here */

  // Configuration pour MDX
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "designmodo.com",
      },
      ...(process.env.NEXT_PUBLIC_UPLOADTHING_URL
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.NEXT_PUBLIC_UPLOADTHING_URL,
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "nexty.dev",
      },
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
})

// Combine MDX and Next.js config
export default withMDX(nextConfig)
