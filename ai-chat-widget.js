/**
 * AICMS AI Chat widget loader — vanilla JS for static ai-cms.cc marketing site.
 *
 * 行為:
 *  - 進頁面就掛一個 floating 氣泡按鈕 (右下角)
 *  - click 氣泡 → 注入 iframe 載入 AICMS embed widget
 *  - iframe 內 widget 按 × → postMessage('aicms-chat-close') → 移除 iframe + 重顯氣泡
 *
 * AICMS 端對應:
 *  - SSR page: /embed/ai-chat?tenant=<slug> 驗 Referer host in tenant.domains
 *  - API: /api/ai-chat/turn 等 body 帶 tenant_slug 走 is_internal 解析路徑
 *  (細節見 ~/Developer/AICMS/apps/public-site/lib/ai-chat/external-tenant.ts)
 *
 * 部署: 9 個 HTML 頁面 <script src="./ai-chat-widget.js" defer></script>
 */
(function () {
  'use strict';

  // ── Config ──
  var ENDPOINT_ORIGIN = 'https://waterman-sports.cc';
  var TENANT_SLUG = 'aicms-marketing';
  var BUBBLE_LABEL = 'AI 客服';
  var PRIMARY_COLOR = '#4f46e5'; // aicms-marketing brand color
  var WIDGET_ID = 'aicms-chat-root';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.getElementById(WIDGET_ID)) return; // 已掛, 避免重複載入

  // ── Build container ──
  var root = document.createElement('div');
  root.id = WIDGET_ID;
  root.style.cssText = [
    'position:fixed',
    'right:16px',
    'bottom:16px',
    'z-index:2147483646', // 一級最高 (留一個給 modal lightbox)
    'font-family:system-ui,-apple-system,"PingFang TC","Microsoft JhengHei",sans-serif',
  ].join(';');

  // ── Bubble button ──
  var bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.setAttribute('aria-label', BUBBLE_LABEL);
  bubble.innerHTML =
    '<span style="font-size:20px;line-height:1;margin-right:6px">💬</span>' +
    '<span style="font-size:14px;font-weight:500">' + BUBBLE_LABEL + '</span>';
  bubble.style.cssText = [
    'display:inline-flex',
    'align-items:center',
    'gap:6px',
    'padding:12px 18px',
    'border:none',
    'border-radius:9999px',
    'background:' + PRIMARY_COLOR,
    'color:white',
    'cursor:pointer',
    'box-shadow:0 6px 20px rgba(79,70,229,0.35)',
    'transition:transform .15s ease, box-shadow .15s ease',
  ].join(';');
  bubble.addEventListener('mouseenter', function () {
    bubble.style.transform = 'translateY(-1px)';
    bubble.style.boxShadow = '0 10px 24px rgba(79,70,229,0.45)';
  });
  bubble.addEventListener('mouseleave', function () {
    bubble.style.transform = 'translateY(0)';
    bubble.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)';
  });

  // ── Iframe (lazy) ──
  var iframe = null;

  function openChat() {
    if (iframe) return;
    bubble.style.display = 'none';

    iframe = document.createElement('iframe');
    iframe.src =
      ENDPOINT_ORIGIN +
      '/embed/ai-chat?tenant=' +
      encodeURIComponent(TENANT_SLUG);
    iframe.title = BUBBLE_LABEL;
    iframe.setAttribute('allow', 'clipboard-write');
    // RWD: 桌機 360x560 浮窗, 手機填滿底部
    var isNarrow = window.matchMedia('(max-width: 480px)').matches;
    iframe.style.cssText = [
      'border:none',
      'background:white',
      'border-radius:16px',
      'box-shadow:0 20px 50px rgba(0,0,0,0.18)',
      'display:block',
      isNarrow ? 'width:calc(100vw - 32px)' : 'width:360px',
      isNarrow ? 'height:70vh' : 'height:560px',
      isNarrow ? 'max-height:600px' : '',
    ]
      .filter(Boolean)
      .join(';');

    root.appendChild(iframe);

    // 紀錄一筆 chat_open (沿用 analytics-tracker 的 helper)
    try {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('chat_open');
      }
    } catch (e) {
      // ignore
    }
  }

  function closeChat() {
    if (!iframe) return;
    try {
      root.removeChild(iframe);
    } catch (e) {
      // ignore
    }
    iframe = null;
    bubble.style.display = 'inline-flex';
  }

  bubble.addEventListener('click', openChat);

  // 收 iframe 來的 postMessage(× 關閉)
  window.addEventListener('message', function (ev) {
    // 來源驗證: 必須是 ENDPOINT_ORIGIN
    if (ev.origin !== ENDPOINT_ORIGIN) return;
    var data = ev.data;
    if (data && data.type === 'aicms-chat-close') {
      closeChat();
    }
  });

  // ── Mount ──
  function mount() {
    root.appendChild(bubble);
    document.body.appendChild(root);
  }
  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  }
})();
