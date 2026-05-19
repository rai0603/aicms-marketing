# AICMS Marketing Site

AICMS 對外行銷 + 功能介紹頁，部署在 GitHub Pages。

🔗 **線上**: https://rai0603.github.io/aicms-marketing/

## 頁面

- `index.html` — 主站首頁，列出所有功能介紹
- `ai-chat-booking.html` — AI 客服 × 線上預約 功能介紹頁
- `screenshots/` — 真機截圖

## 開發

純 single-file HTML + inline CSS，無 build step。改完直接 push, GitHub Pages 自動部署 (~1 分鐘).

```bash
# 本機預覽
open index.html
```

## 之後加新功能頁

1. 把功能頁 HTML 放在根目錄, 例如 `mcp-gateway.html`
2. 在 `index.html` 的 `.feature-grid` 加新 `.feature-card` 連到該頁
3. push
