/* ─── LBM Lead Capture Popup ───
   Shows after 12s or 50% scroll (whichever first).
   Cookie prevents re-show for 7 days after dismiss, 30 days after CTA click.
   Coordinates with chat-widget.js via window.lbm shared state.
   Integrates with Mailchimp via list-manage endpoint.
*/
(function() {
  var COOKIE_NAME = 'lbm_popup_seen';
  var DELAY_MS = 12000;
  var SCROLL_THRESHOLD = 0.5;

  // Shared coordination state with chat widget
  window.lbm = window.lbm || {};
  window.lbm.popupReady = true;
  window.lbm.popupVisible = false;
  window.lbm.popupDismissedAt = 0;
  window.lbm.popupCTAClicked = false;

  // Check cookie
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  if (getCookie(COOKIE_NAME)) {
    window.lbm.popupSuppressed = true;
    return;
  }

  // Build popup HTML
  var overlay = document.createElement('div');
  overlay.id = 'lbm-popup-overlay';
  overlay.innerHTML = [
    '<div id="lbm-popup">',
    '  <button id="lbm-popup-close" aria-label="Close">&times;</button>',
    '  <div class="lbm-popup-tag">FREE TOOL</div>',
    '  <h2>How much is your business silently losing?</h2>',
    '  <p>90 seconds. 7 questions. Get your estimated blended CAC — then book a free call to verify it against your real data.</p>',
    '  <div class="lbm-popup-stats">',
    '    <div class="lbm-popup-stat"><span class="lbm-popup-num">$161K</span><span class="lbm-popup-label">found in 30 days</span></div>',
    '    <div class="lbm-popup-stat"><span class="lbm-popup-num">16&times;</span><span class="lbm-popup-label">net income growth</span></div>',
    '    <div class="lbm-popup-stat"><span class="lbm-popup-num">Free</span><span class="lbm-popup-label">no strings attached</span></div>',
    '  </div>',
    '  <a href="/calculator.html" id="lbm-popup-cta">Run the Free Blended CAC Calculator &rarr;</a>',
    '  <div class="lbm-popup-sub">Free. No email required. Takes 90 seconds.</div>',
    '</div>'
  ].join('\n');

  // Styles
  var style = document.createElement('style');
  style.textContent = [
    '#lbm-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity 0.3s ease;backdrop-filter:blur(4px)}',
    '#lbm-popup-overlay.active{opacity:1}',
    '#lbm-popup{background:#111;border:1px solid #1e1e1e;border-radius:20px;max-width:520px;width:100%;padding:40px 36px;position:relative;text-align:center;font-family:Inter,-apple-system,sans-serif;transform:translateY(20px);transition:transform 0.3s ease}',
    '#lbm-popup-overlay.active #lbm-popup{transform:translateY(0)}',
    '#lbm-popup-close{position:absolute;top:16px;right:16px;background:none;border:none;color:#6b6b6b;font-size:28px;cursor:pointer;line-height:1;padding:4px 8px;transition:color 0.2s}',
    '#lbm-popup-close:hover{color:#fff}',
    '.lbm-popup-tag{display:inline-block;background:rgba(200,246,90,0.1);border:1px solid rgba(200,246,90,0.25);color:#c8f65a;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:20px}',
    '#lbm-popup h2{font-size:clamp(22px,4vw,28px);font-weight:800;color:#fff;letter-spacing:-0.02em;line-height:1.2;margin-bottom:12px}',
    '#lbm-popup p{font-size:15px;color:#6b6b6b;line-height:1.65;margin-bottom:24px}',
    '.lbm-popup-stats{display:flex;justify-content:center;gap:24px;margin-bottom:28px;flex-wrap:wrap}',
    '.lbm-popup-stat{text-align:center}',
    '.lbm-popup-num{display:block;font-size:22px;font-weight:900;color:#c8f65a;letter-spacing:-0.02em;line-height:1}',
    '.lbm-popup-label{display:block;font-size:10px;color:#6b6b6b;text-transform:uppercase;letter-spacing:0.07em;margin-top:4px}',
    '#lbm-popup-cta{display:block;padding:16px 32px;background:#c8f65a;color:#0a0a0a;font-size:15px;font-weight:800;border-radius:10px;text-decoration:none;transition:all 0.2s;letter-spacing:0.01em}',
    '#lbm-popup-cta:hover{background:#d4f96a;transform:translateY(-2px);box-shadow:0 8px 24px rgba(200,246,90,0.25)}',
    '.lbm-popup-sub{font-size:12px;color:#444;margin-top:12px}',
    '@media(max-width:500px){#lbm-popup{padding:32px 24px} #lbm-popup h2{font-size:22px} .lbm-popup-stats{gap:16px}}'
  ].join('\n');
  document.head.appendChild(style);

  var shown = false;
  function showPopup() {
    if (shown) return;
    // Don't show if chat widget is open or chat proactive is visible
    if (window.lbmChatOpen) return;
    if (window.lbm && window.lbm.chatProactiveVisible) return;
    shown = true;
    window.lbm.popupVisible = true;
    document.body.appendChild(overlay);
    pushEvent('popup_shown');
    // Force reflow then add class
    overlay.offsetHeight;
    overlay.classList.add('active');
  }

  function closePopup(cookieDays, wasCTA) {
    overlay.classList.remove('active');
    window.lbm.popupVisible = false;
    window.lbm.popupDismissedAt = Date.now();
    if (wasCTA) {
      window.lbm.popupCTAClicked = true;
    }
    setTimeout(function() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
    setCookie(COOKIE_NAME, '1', cookieDays || 7);
  }

  // Trigger: delay
  var timer = setTimeout(showPopup, DELAY_MS);

  // Trigger: scroll depth
  function onScroll() {
    var scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (scrolled >= SCROLL_THRESHOLD) {
      showPopup();
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll);

  // GTM dataLayer push
  function pushEvent(event, params) {
    window.dataLayer = window.dataLayer || [];
    var data = { event: event, page_path: window.location.pathname };
    if (params) {
      for (var k in params) {
        if (params.hasOwnProperty(k)) data[k] = params[k];
      }
    }
    window.dataLayer.push(data);
  }

  // Close handlers
  document.addEventListener('click', function(e) {
    if (e.target.id === 'lbm-popup-close' || e.target.id === 'lbm-popup-overlay') {
      pushEvent('popup_dismissed');
      closePopup(7, false);
    }
    if (e.target.id === 'lbm-popup-cta') {
      pushEvent('popup_cta_clicked', { destination: '/calculator.html' });
      closePopup(30, true);
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && window.lbm.popupVisible) closePopup(7, false);
  });
})();
