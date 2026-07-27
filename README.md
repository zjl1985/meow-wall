# 喵喵墙 meow-wall

一个只做一件事的网站：让你无限刷猫猫头。纯好玩，没有登录、没有数据库。

线上地址：<https://meow-wall.vercel.app>

## 有什么

- **猫墙**（`/`）：Hero 大猫（空格 / R 换猫）+ 无限滚动的猫卡网格，卡片可收藏、下载、点开看大图（方向键翻页）
- **猫猫说话**（`/says`）：输入一句话，猫替你说出来，可下载可收藏
- **我的收藏**（`/favorites`）：存在 localStorage，刷新不丢
- **彩蛋**：连换 10 只猫会有猫猫大游行；点喇叭听一声合成的喵；切走标签页标题会喊你回来

## 技术栈

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui（base-nova）

猫图来自 [TheCatAPI](https://thecatapi.com/) 和 [cataas](https://cataas.com/)，都不需要 API key。
所有外部请求走本地 Route Handler 代理（`/api/cats`、`/api/cats/says`、`/api/cats/download`），
主源失败会自动降级到备用源，下载代理只放行白名单域名。

## 部署到 Vercel

不需要任何环境变量，也没有数据库，导入仓库点 Deploy 就能上线。

```bash
# 命令行部署
npx vercel        # 预览环境
npx vercel --prod # 生产环境
```

Vercel 上会自动识别 Next.js，构建命令和安装命令都用默认值即可。几个已经处理好的点：

- **图片不走 Vercel 图片优化**（`images.unoptimized`）：猫图是无限流的随机图，每张都算一次转换，开优化会立刻打满免费额度
- **`/api/cats` 强制动态 + `no-store`**：否则 CDN 会把某一批随机猫缓存给所有人
- **上游请求 6 秒超时**：Hobby 版函数上限 10 秒，猫图源卡住时自己先断，降级到备用源而不是等到 504
- **`pnpm-workspace.yaml` 同时写了 `allowBuilds` 和 `onlyBuiltDependencies`**：本地 pnpm 11 认前者，Vercel 按 `lockfileVersion: 9.0` 选 pnpm 10 认后者

## 开发

```bash
pnpm install
pnpm dev          # http://localhost:3000

pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm test         # 单元 + API 测试
pnpm test:e2e:smoke   # headless Playwright
```
