import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  serverExternalPackages: ["better-sqlite3"],
};
export default nextConfig;
