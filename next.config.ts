import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY ?? "";
const repoName = repository.split("/")[1] ?? "";
const isUserOrOrgSite = repoName.endsWith(".github.io");

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const autoBasePath =
  isGitHubActions && repoName && !isUserOrOrgSite ? `/${repoName}` : "";
const basePath = configuredBasePath || autoBasePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
};

export default nextConfig;
