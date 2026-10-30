# Changelog

## 2026-10-30（彩笔）

### 更改

- 插画与标题统一使用「彩笔」SVG 滤镜（`src/components/crayon-filter.tsx`）：细颗粒、略毛糙的边缘，保持很淡

## 2026-10-30

### 新增

- **朴实小动物 `/`**：新的默认首页，展示五张手绘纸上墨线图标（小兔、小鸡、小熊、小狗、小猫）；原图存于 `art/humble-animals/`，网页用 640px WebP
- `scripts/optimize-humble-animals.mjs`：用 Next 自带的 sharp 从原图生成 WebP

### 更改

- 原猫墙移到 `/wall`，导航顺序：朴实小动物 · 猫墙 · 捏猫 · 说话 · 收藏
- 全站视觉改为纸张风格：暖白纸面 + 细微纸纹、低对比墨色、细线、EB Garamond / 宋体衬线标题、去掉阴影与弹跳，只保留缓慢淡入；默认主题更名为「纸 / Paper」

## 2026-07-27

### 新增

- **捏猫工坊 `/studio`**：调色板 8 槽 + 配饰 + 表情，随机生成，保存到本地猫墙，可导出 SVG
- **彩蛋专属区**：首页突出 Nicole / Goodman / Simon / Zero；连换 10 只时的游行改为真实像素猫，不再用 emoji
- **GitHub 仓库入口**：导航与页脚均链到 `github.com/zjl1985/meow-wall`

### 更改

- 视觉重做为深色画廊：去粘土阴影与弹跳、Syne + DM Sans、锐利边框与作品集排版
- 全站去掉 emoji（含 thinking 气泡），文案改为克制的 Index / Studio / Specials 风格
- 猫墙优先展示自制猫，再是彩蛋专属，再是其余皮肤
