import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = {
  // GitHub Pages needs static export + /squish subdirectory
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/squish" : "",
  assetPrefix: isGitHubPages ? "/squish" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
