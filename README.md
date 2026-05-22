# AICMS Marketing Site

AICMS 對外行銷 + 功能介紹頁，部署在 Zeabur（Cloudflare DNS）。

🔗 **正式**: https://ai-cms.cc （2026-05-21 上線）
🔗 **備援**: https://rai0603.github.io/aicms-marketing/ （GitHub Pages，仍會 serve）

## 頁面

- `index.html` — 主站首頁，hero + 4 痛點 + 功能 grid + CTA
- `solution.html` — 三大服務 × 三方案定價（Starter / Pro / Custom）
- `about.html` — 關於 AICMS（技術 / 產品差異化）
- `privacy.html` — 隱私權政策
- `terms.html` — 服務條款
- `ai-chat-booking.html` — AI 客服 × 線上預約
- `geo-native-site.html` — GEO 原生網站
- `mcp-gateway.html` — MCP Gateway + LLM 支援現況
- `wordpress-import.html` — WordPress 一鍵匯入
- `screenshots/` — 水行者 dogfood 真機截圖

## 開發

純 single-file HTML + inline CSS，無 build step。改完直接 push，Zeabur 自動部署 (~1 分鐘)。

```bash
# 本機預覽
open index.html
```

## 之後加新功能頁

1. 把功能頁 HTML 放在根目錄, 例如 `mcp-gateway.html`
2. 截圖放 `screenshots/`
3. 改 `index.html` 的 `.feature-grid`：把對應「即將推出」卡片 `class="feature-card coming"` 改成 `class="feature-card" href="./xxx.html"`
4. push → Zeabur auto deploy

詳見 `CLAUDE.md`（含跟 AICMS 主平台的同步 workflow）。
