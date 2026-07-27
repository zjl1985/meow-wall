# 喵喵墙 meow-wall

一个只做一件事的网站：展示 agent-hub 同款**像素猫猫头**。纯好玩，没有登录、没有数据库、不拉外网猫图。

线上地址：<https://meow-wall.vercel.app>

## 有什么

- **猫墙**（`/`）：Hero 随机一只像素猫（空格 / R 换猫换表情）+ 下方全皮肤墙，可打乱、可点开切换表情、可收藏
- **猫猫说话**（`/says`）：选一只像素猫，输入一句话，头顶冒泡
- **我的收藏**（`/favorites`）：存在 localStorage，刷新不丢
- **彩蛋**：连换 10 只猫会有猫猫大游行；点喇叭听一声合成的喵；切走标签页标题会喊你回来

像素猫源码来自 agent-hub 的 `mascot-art.ts` / `<Mascot/>`（约 36 款皮肤 + 6 种表情）。

## 技术栈

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui

## 部署到 Vercel

不需要任何环境变量，也没有数据库，导入仓库点 Deploy 就能上线。

```bash
# 本机若开了 7897 代理，跑 vercel CLI 前先清掉代理变量（CLI 对 ALL_PROXY 有 bug）
env -u ALL_PROXY -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy npx vercel --prod
```

## 开发

```bash
pnpm install
pnpm dev          # http://localhost:3000

pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e:smoke
```
