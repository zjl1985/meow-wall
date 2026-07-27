# 喵喵墙 meow-wall

一个只做一件事的网站：展示 agent-hub 同款**像素猫猫头**。纯好玩，没有登录、没有数据库、不拉外网猫图。

线上地址：<https://meow-wall.vercel.app>

## 有什么

- **猫墙**（`/`）：Hero + **彩蛋专属区**（Nicole / Goodman / Simon / Zero）+ 全皮肤墙
- **捏猫**（`/studio`）：调色 / 配饰 / 表情，随机生成，存进本地猫墙，可导出 SVG
- **猫猫说话**（`/says`）：头顶冒泡
- **收藏**（`/favorites`）：localStorage
- **彩蛋游行**：连换 10 只 → 四只专属像素猫横穿屏幕（不是 emoji）


## 技术栈

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui

## 部署到 Vercel

通过 **GitHub → Vercel** 自动部署，不需要本地 `vercel --prod`。

- 仓库：https://github.com/zjl1985/meow-wall
- 生产域名：https://meow-wall.vercel.app
- 生产分支：`main`（push 即触发 Production）
- 不需要任何环境变量，也没有数据库

```bash
git push origin main   # 自动部署
```

本机若开了 7897 代理，偶尔用 CLI 查部署状态时先清掉代理变量（CLI 对 `ALL_PROXY` 有 bug）：

```bash
env -u ALL_PROXY -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy npx vercel ls
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
