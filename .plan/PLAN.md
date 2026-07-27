# meow-wall — 随机猫猫头展示站

> 纯好玩项目。目标：打开就是一墙猫猫头，点一下换一批，能生成猫猫表情包，能收藏。
> 目录：`~/code/meow-wall`（独立仓库，已 `git init`，与 agent-hub 无任何依赖关系）

**已确认**：视觉走「可爱粘土风」（暖色渐变 + 厚阴影 + 弹跳动效）；本轮范围 = 猫墙 + 表情包 + 收藏 + 彩蛋音效**全做**；界面文案中文。

---

## 一、产品定义

一句话：**一个只做一件事的网站——让你无限刷猫猫头。**

不做的事（避免范围膨胀）：
- 不做用户系统 / 登录 / 数据库（收藏只存 localStorage）
- 不做移动端专门适配（桌面 Web 优先，栅格自然收缩即可）
- 不做后端持久化、不做付费、不做上传自己的猫

### 核心页面（单页 + 两个次级页）

| 路由 | 内容 |
|---|---|
| `/` | 猫墙主场：Hero 大猫 + 下方猫墙网格 |
| `/says` | 猫猫表情包生成器（输入文字，猫说话） |
| `/favorites` | 我的收藏（localStorage 读取） |

### 功能点

1. **Hero 随机大猫**
   - 页面正中一只大猫猫头，圆角卡片 + 轻微悬浮阴影
   - `换一只` 按钮；键盘 `Space` / `R` 也能换
   - 切换时 skeleton 占位 + 淡入动画，不要图片跳闪

2. **猫墙（Cat Wall）**
   - 一次拉 12 张，masonry-ish 网格（CSS columns 或 grid auto-rows）
   - `再来一波` 按钮追加 12 张；滚到底自动追加（IntersectionObserver）
   - 每张卡片 hover 显示两个动作：`❤️ 收藏`、`⬇️ 下载`
   - 点击图片 → Dialog 大图预览，左右方向键切换

3. **猫猫说话（/says）**
   - Input 输入文字 → 调 cataas `/cat/says/{text}` 生成图
   - 预设几个快捷短语按钮（"我不想上班"、"再来一杯"、"喵"…）
   - 生成结果可下载、可收藏

4. **收藏（/favorites）**
   - localStorage key: `cat-wall:favorites`，存 `{ id, url, addedAt }[]`
   - 支持取消收藏、清空全部
   - 空状态放一只可爱的 SVG 猫 + 引导文案

5. **好玩的彩蛋（本轮要做）**
   - 连点 `换一只` 10 次 → 页面下方跑过一排猫猫
   - `🔊` 按钮播放一声 meow（本地 mp3，默认静音，不自动播放）
   - 页面标题失焦时变成 `🐱 快回来...`

---

## 二、技术栈

沿用熟悉的组合，减少踩坑成本：

- **Next.js 16 App Router** + React 19 + TypeScript `strict`
- **Tailwind v4** + **shadcn/ui**（`Button` / `Card` / `Dialog` / `Input` / `Skeleton` / `Badge` / `Sonner`）
- **lucide-react** 图标
- 无数据库、无 ORM、无 auth
- 包管理 **pnpm**

### 猫图数据源（均已验证 200，无需 API key）

| 用途 | 接口 |
|---|---|
| 批量随机猫 | `https://api.thecatapi.com/v1/images/search?limit=12` |
| 单只随机猫（兜底） | `https://cataas.com/cat?json=true` |
| 猫说话表情包 | `https://cataas.com/cat/says/{text}?fontSize=40&fontColor=white` |

**关键约定**：所有外部请求走自己的 Route Handler 代理，前端只认自己的 API。
理由：统一错误处理、避免 CORS、方便加缓存和降级、以后换数据源不动 UI。

```
GET /api/cats?count=12   → { data: CatImage[], success: true }
GET /api/cats/says?text= → { data: CatImage, success: true }
```

- `CatImage = { id: string; url: string; width?: number; height?: number }`
- Route 用 Zod 校验 query（`count` 限 1–24，`text` 限 1–40 字）
- TheCatAPI 失败 → 自动降级到 cataas 逐张取；两个都挂 → 返回 503 + 友好文案
- `next.config.ts` 的 `images.remotePatterns` 放行 `cdn2.thecatapi.com`、`cataas.com`

---

## 三、目录结构

```
meow-wall/
├── .plan/PLAN.md              # 本文件
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # 猫墙主场
│   │   ├── says/page.tsx
│   │   ├── favorites/page.tsx
│   │   └── api/cats/
│   │       ├── route.ts
│   │       └── says/route.ts
│   ├── components/
│   │   ├── ui/                # shadcn 生成，不手改
│   │   ├── cat-hero.tsx
│   │   ├── cat-wall.tsx
│   │   ├── cat-card.tsx
│   │   └── cat-lightbox.tsx
│   ├── hooks/
│   │   ├── use-cats.ts        # 拉图 + 追加 + AbortController
│   │   └── use-favorites.ts   # localStorage 读写
│   ├── lib/
│   │   ├── cat-source.ts      # 外部 API 封装 + 降级逻辑（纯函数）
│   │   ├── types.ts
│   │   └── utils.ts
│   └── styles/
└── public/sounds/meow.mp3
```

---

## 四、执行步骤

| # | 步骤 | 产出 |
|---|---|---|
| 1 | `create-next-app` 初始化（TS + Tailwind + App Router + ESLint） | 可跑的空壳 |
| 2 | `npx shadcn@latest init` + add 所需组件 | UI 基座 |
| 3 | `lib/cat-source.ts` + `lib/types.ts` + 两个 Route Handler | 后端能返数据 |
| 4 | `use-cats` / `use-favorites` hooks | 数据层 |
| 5 | `CatCard` → `CatWall` → `CatHero` → 首页组装 | 主页面可用 |
| 6 | Lightbox 预览 + 键盘交互 | 交互完整 |
| 7 | `/says` 页 | 表情包生成 |
| 8 | `/favorites` 页 + 空状态 | 收藏闭环 |
| 9 | 彩蛋 + 动效打磨 | 好玩度 |
| 10 | lint + typecheck + 测试 + 首个 commit | 可交付 |

**注意**：shadcn 组件必须用 `npx shadcn@latest add <x>`，不要用 `pnpm dlx shadcn`
（pnpm 严格 node_modules 会让 `@modelcontextprotocol/sdk` 解析到旧版 zod 而崩溃）。

---

## 五、测试策略

小项目不堆测试，只测会真出错的地方：

- **单元测试（vitest）**：`lib/cat-source.ts` 的降级逻辑（主源失败→兜底源→双挂报错）、Zod 边界值（count=0/25、text 空/超长）
- **API 测试**：两个 Route Handler 的 happy path + 非法参数 400，外部请求用 mock fetch
- **E2E（Playwright headless）**：一条关键路径——首页加载出 12 只猫 → 点收藏 → 跳 `/favorites` 能看到那只猫
- 纯视觉打磨不写测试

---

## 六、验收标准

- [ ] 首页 2 秒内出现猫墙，无布局跳动（图片有固定宽高比占位）
- [ ] 滚到底自动加载，重复点击不产生重复请求（AbortController + loading 锁）
- [ ] 外部 API 挂掉时页面不白屏，显示友好错误 + 重试按钮
- [ ] 刷新页面收藏不丢
- [ ] `pnpm lint` / `pnpm typecheck` 零报错
- [ ] 没有原生 `<button>` / `<input>` / `<select>`，全部走 shadcn
- [ ] 所有文案集中管理，不散落硬编码（中文单语，先不做 i18n）

---

## 七、视觉规范（粘土风）

- 底色：暖奶油渐变 `#FFF7ED → #FFE4CA`，卡片纯白
- 圆角：统一由 `--radius` 派生，卡片 `24px` 级别的大圆角
- 阴影：厚实低对比 `0 8px 0 rgba(0,0,0,.06)` + 柔光外阴影，模拟粘土的"捏"感
- 动效：hover 上浮 + 轻微旋转 1.5°，点击 scale 0.96 回弹（`transition: cubic-bezier(.34,1.56,.64,1)`）
- 字体：标题用圆润无衣线（Nunito / Baloo 2），正文系统字体
- 强调色：橘猫橙 `#FB923C`，辅助色 奶牛猫黑白 + 三花粉 `#FDA4AF`
