# Changelog

## 2026-07-27

### 更改

- 适配 Vercel 部署：图片改用原图不走 Vercel 图片优化，`/api/cats` 强制动态并返回 `no-store`，上游猫图请求加 6 秒超时（下载代理 8 秒），避免 serverless 函数被拖到超时


### 新增

- 猫墙首页：Hero 随机大猫（空格 / R 换猫）+ 无限滚动猫卡网格，滚到底自动续猫
- 猫卡交互：收藏、下载、点图开大图预览，方向键左右翻猫
- 猫猫说话页：输入文字生成猫咪表情包，带预设短语，可下载可收藏
- 收藏页：localStorage 持久化，支持取消单只和清空全部，带空状态引导
- 彩蛋：连换 10 只猫触发猫猫大游行、WebAudio 合成喵叫、切换标签页标题变召唤语
- 猫图 API 代理：`/api/cats`、`/api/cats/says`、`/api/cats/download`，主源 TheCatAPI 失败自动降级 cataas，下载代理只放行白名单域名
- 粘土风视觉层：暖色渐变底、厚实阴影、弹跳动效，尊重 `prefers-reduced-motion`
