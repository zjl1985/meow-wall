import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 猫图是无限流的随机图，每张都是一次新的转换：走 Vercel 图片优化会瞬间打满
    // 免费额度并让图片开始返 402，所以直接用原图。
    unoptimized: true,
  },
};

export default nextConfig;
