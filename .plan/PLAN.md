# meow-wall — 像素猫猫头展示站（纠偏）

> 目录：`~/code/meow-wall`
> **纠偏（2026-07-27）**：用户要的是 agent-hub 里的像素猫猫头（`mascot-art` / `<Mascot/>`），**不是** TheCatAPI / cataas 照片猫。

## 产品

展示、随机、收藏 agent-hub 同款像素猫猫头皮肤（`CAT_VARIANTS` ≈ 36 款）。

| 路由 | 内容 |
|---|---|
| `/` | Hero 随机一只 + 下方全皮肤墙（可打乱、可切表情） |
| `/says` | 选一只猫 + 输入文字 → 头顶说话泡泡 |
| `/favorites` | localStorage 收藏皮肤 id |

## 不做

- 外部猫图 API、下载代理、图片优化配置
- 用户系统 / 数据库

## 实现要点

1. 拷贝 `mascot-art.ts` + `mascot.tsx`（纯源码依赖，不 import agent-hub）
2. 删掉 `/api/cats*` 与 `cat-source` / 照片相关 hooks
3. Hero / 墙 / 收藏 / 说话页全部改渲染 `<Mascot/>`
4. 粘土风 UI 保留；文案改为「像素猫」语义
5. 测试改测变体列表与收藏逻辑；重新部署 Vercel
