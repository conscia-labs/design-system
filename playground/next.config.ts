import type { NextConfig } from "next";

const staticExport = process.env.PLAYGROUND_STATIC_EXPORT === "true";
const basePath = staticExport ? process.env.NEXT_PUBLIC_BASE_PATH || "/design-system" : "";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        basePath,
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
  transpilePackages: ["@conscia-labs/design-system"],
};

export default nextConfig;
