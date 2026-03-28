import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      fs: { browser: "" },
      path: { browser: "" },
      crypto: { browser: "" },
    },
  },
  serverExternalPackages: ["onnxruntime-web"],
  async headers() {
    const securityHeaders = [
      { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    if (isProd) {
      securityHeaders.push(
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      );
    }

    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
