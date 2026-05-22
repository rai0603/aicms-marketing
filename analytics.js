/**
 * AICMS Analytics tracker — vanilla JS for static ai-cms.cc marketing site.
 *
 * 行為:
 *  - 進每一頁送 'pageview' beacon
 *  - 離開頁面 (pagehide / visibility hidden / unload) 送 'page_leave' 含 duration_ms
 *  - utm_* / fbclid 從 URL query 帶上
 *  - session_id 存 sessionStorage (關 tab 重置)
 *
 * 跟 AICMS public-site analytics-tracker.tsx 邏輯一致, 多帶 tenant_slug 讓後端走外站 fallback.
 * 後端 /api/track 用 is_internal + Origin 驗證 (見 apps/public-site/app/api/track/route.ts).
 *
 * 部署: 6 個 HTML 頁面 <script src="./analytics.js" defer></script>
 */
(function () {
  'use strict';

  // ── Config ──
  var ENDPOINT = 'https://waterman-sports.cc/api/track';
  var TENANT_SLUG = 'aicms-marketing';
  var SESSION_KEY = '_aicms_sid';

  // ── Session ID ──
  function getSessionId() {
    try {
      var sid = sessionStorage.getItem(SESSION_KEY);
      if (!sid) {
        sid = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(SESSION_KEY, sid);
      }
      return sid;
    } catch (e) {
      return 's_nocache_' + Date.now().toString(36);
    }
  }

  // ── Beacon ──
  function send(payload) {
    try {
      payload.tenant_slug = TENANT_SLUG;
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(ENDPOINT, blob);
      } else {
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true,
          mode: 'cors',
        }).catch(function () {});
      }
    } catch (e) {
      // 完全失敗也吞掉
    }
  }

  // 全域 helper, 給 inline script / 其他 module 呼叫
  window.trackEvent = function (type, meta) {
    send({
      type: type,
      path: location.pathname,
      referer: document.referrer || null,
      session_id: getSessionId(),
      meta: meta,
    });
  };

  // ── Pageview ──
  var params = new URLSearchParams(location.search);
  var fbclid = params.get('fbclid');
  var utm_source = params.get('utm_source') || (fbclid ? 'facebook' : null);

  send({
    type: 'pageview',
    path: location.pathname,
    referer: document.referrer || null,
    utm_source: utm_source,
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
    session_id: getSessionId(),
    screen_w: window.screen && window.screen.width,
    screen_h: window.screen && window.screen.height,
  });

  // ── Page leave (duration tracking) ──
  var enterTs = Date.now();
  var sent = false;
  function sendLeave() {
    if (sent) return;
    sent = true;
    send({
      type: 'page_leave',
      path: location.pathname,
      session_id: getSessionId(),
      duration_ms: Date.now() - enterTs,
    });
  }
  // pagehide 比 beforeunload 在 mobile/safari 可靠
  window.addEventListener('pagehide', sendLeave);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') sendLeave();
  });
})();
