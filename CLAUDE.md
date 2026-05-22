# aicms-marketing — AICMS 對外行銷站

> 這個 repo 只放靜態 HTML 行銷頁，跟 AICMS 主平台 repo 分開維護。
> AICMS 主 repo 是 private，這裡是 public，純對外曝光用。

---

## 線上資訊

- **正式網址**: https://ai-cms.cc（2026-05-21 上線）
- **備援網址**: https://rai0603.github.io/aicms-marketing/（GitHub Pages，仍會 serve）
- **GitHub repo**: https://github.com/rai0603/aicms-marketing （public）
- **部署**: Zeabur（AI-CMS project → `aicms-marketing` service），auto deploy from `main`
- **DNS**: Cloudflare（DNS only，不開 proxy），A record `@ → 43.156.127.84`

---

## 跟 AICMS 主平台的關係

**這個 repo 不知道平台內部，但要持續反映平台的能力。**

| 角色 | 路徑 |
|------|------|
| AICMS 主平台（private, source of truth） | `/Users/waterman/Developer/AICMS/` |
| 主平台變動紀錄 | `~/Developer/AICMS/PROGRESS.md` |
| 主平台技術備忘 | `~/Developer/AICMS/CLAUDE.md` |
| 主平台早期功能頁草稿 | `~/Developer/AICMS/docs/*-feature.html` |
| Marketing 站（本 repo） | `~/Developer/aicms-marketing/` |

### 改版 workflow（每次要動 marketing 內容前）

1. **先讀 AICMS 主平台最近的變動**
   ```bash
   git -C ~/Developer/AICMS log --oneline -20
   cat ~/Developer/AICMS/PROGRESS.md | head -100
   ```
   重點看：有沒有新功能 / API / tool / 整合上線。

2. **比對 marketing 是否需要同步**
   - 新增功能 → 是否要加新功能頁
   - 既有功能變化 → 對應頁面更新文案、demo、截圖
   - 平台架構變動 → 影響「適合誰」「對照表」「workflow」section

3. **改在這個 repo 直接做**（不再像舊 SOP 在 AICMS/docs 寫完再複製）
   - 4 個功能頁源檔已經在這 repo 的 root
   - AICMS/docs 底下的 `*-feature.html` 視為**歷史版本**，不再同步維護

4. **commit + push → Zeabur 自動 deploy ~1 分鐘**

---

## 檔案結構

```
aicms-marketing/
├── index.html              # 首頁（hero + 功能 grid + 適合誰 + CTA）
├── ai-chat-booking.html    # AI 客服 × 預約功能頁
├── geo-native-site.html    # GEO 原生網站功能頁
├── mcp-gateway.html        # MCP Gateway + LLM 支援現況
├── wordpress-import.html   # WordPress 一鍵匯入
└── screenshots/            # 水行者 dogfood 真機截圖
```

加新功能頁 SOP：
1. 在 root 加 `{feature-slug}.html`
2. 截圖放 `screenshots/`
3. 改 `index.html` `.feature-grid`：
   - 把對應「即將推出」卡片 `class="feature-card coming"` 改成 `class="feature-card" href="./{slug}.html"`
4. push → Zeabur auto deploy

---

## 設計 tokens（所有頁面共用）

```
brand: #4f46e5
accent: #06b6d4
gradient: linear-gradient(135deg, #4f46e5 → #06b6d4)
font: Inter + PingFang TC
card: 14px radius, 1px line border, shadow-sm
h1 mobile clamp: clamp(30px, 6vw, 64px)
```

mobile 排版注意點（避免重蹈 5/20 修正）：
- nav.top 在 <720px 隱藏中間 `.links`，縮 padding + cta 字級
- h1 在 mobile 390px viewport 不要超過 30px 起跳

---

## 不要做的事

- ❌ 不要把 AICMS 主平台的內部資訊（環境變數、Supabase project ref、API key 結構）寫進這 repo — public repo
- ❌ 不要直接連結到 client-admin 後台（app.waterman-sports.cc 之類），對外只連 ai-cms.cc 自己
- ❌ 不要修 AICMS/docs/*-feature.html — 那已是 deprecated 草稿，本 repo 才是 source of truth
- ❌ DNS 不要改成 proxied（橘雲）— 會擋 Zeabur Let's Encrypt 簽 cert
