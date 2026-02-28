/**
 * LBM Abandon Tracking Library
 * Detects abandonment behavior for known contacts and tags them in Mailchimp
 * via the /api/tag Worker endpoint.
 *
 * Supports 4 abandon types:
 *   1. Calculator Abandon — started calculator but didn't submit email gate
 *   2. Booking Abandon   — clicked Koalendar link but didn't complete booking
 *   3. Browse Engage      — visited 2+ pages without converting
 *   4. Site Abandon       — single page, under 30s bounce (known contact)
 *
 * Requires: lbm_known_email cookie (set by chat-widget.js or calculator.html)
 */
(function () {
  'use strict';

  // ── CONFIG ──
  var API_BASE = 'https://lbm-chatbot.thewizard-dd8.workers.dev';
  var COOKIE_NAME = 'lbm_known_email';
  var SESSION_KEY = 'lbm_abandon_session';
  var CALC_STARTED_KEY = 'lbm_calc_started';
  var CALC_COMPLETED_KEY = 'lbm_calc_completed';
  var BOOKING_CLICKED_KEY = 'lbm_booking_clicked';
  var BOOKING_COMPLETED_KEY = 'lbm_booking_completed';

  // Timeouts (ms)
  var CALCULATOR_ABANDON_DELAY = 10 * 60 * 1000; // 10 minutes
  var BOOKING_ABANDON_DELAY = 30 * 60 * 1000;    // 30 minutes
  var SITE_ABANDON_THRESHOLD = 30 * 1000;         // 30 seconds
  var BROWSE_INACTIVITY_DELAY = 60 * 60 * 1000;  // 1 hour of no new page views

  // ── HELPERS ──

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getEmail() {
    return getCookie(COOKIE_NAME);
  }

  function sendTag(email, tag) {
    if (!email || !tag) return;
    try {
      // Use sendBeacon for reliability on page unload, fall back to fetch
      var payload = JSON.stringify({ email: email, tags: [tag] });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API_BASE + '/api/tag', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch(API_BASE + '/api/tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(function () { /* silent */ });
      }
    } catch (e) { /* silent */ }
  }

  // Session storage helpers
  function getSession() {
    try {
      var data = sessionStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  }

  function setSession(data) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch (e) { /* silent */ }
  }

  function getFlag(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function setFlag(key, val) {
    try { sessionStorage.setItem(key, val || '1'); } catch (e) { /* silent */ }
  }

  // ── SESSION TRACKING (for browse & site abandon) ──

  function initSession() {
    var session = getSession();
    var now = Date.now();

    if (!session) {
      session = {
        startTime: now,
        pages: [window.location.pathname],
        lastActivity: now,
      };
    } else {
      // Add current page if not already tracked
      if (session.pages.indexOf(window.location.pathname) === -1) {
        session.pages.push(window.location.pathname);
      }
      session.lastActivity = now;
    }

    setSession(session);
    return session;
  }

  // ── 1. CALCULATOR ABANDON ──
  // Listens for calculator_started event (set by calculator.html)
  // If no calculator_lead_captured within 10 minutes → tag

  function initCalculatorAbandon(email) {
    // Only run on calculator page
    if (window.location.pathname.indexOf('calculator') === -1) return;

    // Listen for calculator start (custom event from calculator.html)
    window.addEventListener('lbm:calculator_started', function () {
      setFlag(CALC_STARTED_KEY);

      // Set a timeout — if they don't complete, tag as abandoned
      setTimeout(function () {
        if (!getFlag(CALC_COMPLETED_KEY)) {
          sendTag(email, 'calculator-abandoned');
        }
      }, CALCULATOR_ABANDON_DELAY);
    });

    // Listen for completion
    window.addEventListener('lbm:calculator_completed', function () {
      setFlag(CALC_COMPLETED_KEY);
    });
  }

  // ── 2. BOOKING ABANDON ──
  // Intercepts clicks on Koalendar booking links
  // If booking_completed doesn't fire within 30 minutes → tag

  function initBookingAbandon(email) {
    // Intercept clicks on Koalendar links anywhere on the site
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (!link) return;

      var href = link.getAttribute('href') || '';
      if (href.indexOf('koalendar.com') !== -1) {
        setFlag(BOOKING_CLICKED_KEY, Date.now().toString());

        // Check after delay if booking was completed
        setTimeout(function () {
          if (!getFlag(BOOKING_COMPLETED_KEY)) {
            sendTag(email, 'booking-abandoned');
          }
        }, BOOKING_ABANDON_DELAY);
      }
    });

    // Listen for booking completion (set by thank-you page or Koalendar redirect)
    window.addEventListener('lbm:booking_completed', function () {
      setFlag(BOOKING_COMPLETED_KEY);
    });
  }

  // ── 3. BROWSE ENGAGE ──
  // Known contact visits 2+ pages without calculator start or chat contact

  function initBrowseEngage(email, session) {
    // Only tag if they've visited 2+ pages and haven't converted
    if (session.pages.length < 2) return;

    // Check on page unload — if they haven't started calculator or given contact info
    window.addEventListener('beforeunload', function () {
      var calcStarted = getFlag(CALC_STARTED_KEY);
      var calcCompleted = getFlag(CALC_COMPLETED_KEY);
      var bookingClicked = getFlag(BOOKING_CLICKED_KEY);

      // Only tag if they browsed without converting
      if (!calcStarted && !calcCompleted && !bookingClicked) {
        sendTag(email, 'browse-engaged');
      }
    });
  }

  // ── 4. SITE ABANDON ──
  // Known contact, single page view, under 30 seconds

  function initSiteAbandon(email, session) {
    // Only applies to single-page sessions
    if (session.pages.length > 1) return;

    window.addEventListener('beforeunload', function () {
      var timeOnPage = Date.now() - session.startTime;

      // Only tag if under threshold AND they didn't convert
      if (timeOnPage < SITE_ABANDON_THRESHOLD) {
        var calcStarted = getFlag(CALC_STARTED_KEY);
        var calcCompleted = getFlag(CALC_COMPLETED_KEY);
        var bookingClicked = getFlag(BOOKING_CLICKED_KEY);

        if (!calcStarted && !calcCompleted && !bookingClicked) {
          sendTag(email, 'site-abandon');
        }
      }
    });
  }

  // ── INIT ──

  function init() {
    var email = getEmail();

    // Only track known contacts (have the cookie)
    if (!email) return;

    var session = initSession();

    // Initialize all abandon trackers
    initCalculatorAbandon(email);
    initBookingAbandon(email);
    initBrowseEngage(email, session);
    initSiteAbandon(email, session);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
