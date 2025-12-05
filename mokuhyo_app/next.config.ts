import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker で `.next/standalone` を使うために standalone 出力を有効化
  output: "standalone",
};

export default nextConfig;
