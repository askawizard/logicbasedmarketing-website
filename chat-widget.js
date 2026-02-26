/**
 * LBM Live Chat Widget
 * Self-contained IIFE - vanilla JS, injects CSS + HTML, matches site dark theme
 *
 * Usage: <script src="/chat-widget.js" defer></script>
 *
 * Features:
 * - Contact form captures name/email/phone BEFORE chat starts
 * - Proactive trigger (12s delay or 60% scroll)
 * - Qualification conversation via Claude API
 * - Time slot picker for booking
 * - Booking confirmation with Google Meet link
 * - Session persistence (sessionStorage)
 * - GTM dataLayer events
 * - Coordinates with email-popup.js
 */

(function() {
  'use strict';

  // -- CONFIG --
  var API_URL = 'https://lbm-chatbot.thewizard-dd8.workers.dev';
  var PROACTIVE_DELAY = 12000;
  var PROACTIVE_SCROLL = 0.6;
  var DISMISS_COOKIE = 'lbm_chat_dismissed';
  var SESSION_KEY = 'lbm_chat_session';
  var CONTACT_KEY = 'lbm_chat_contact';

  // Excluded pages (sales tools)
  var EXCLUDED = ['/one-pager.html', '/pricing.html', '/proposal.html'];
  var path = window.location.pathname;
  for (var i = 0; i < EXCLUDED.length; i++) {
    if (path.indexOf(EXCLUDED[i]) !== -1) return;
  }

  // -- STYLES --
  var CSS = '\
#lbm-chat-bubble {\
  position: fixed; bottom: 24px; right: 24px; z-index: 9990;\
  width: 56px; height: 56px; border-radius: 50%;\
  background: #c8f65a; border: none; cursor: pointer;\
  display: flex; align-items: center; justify-content: center;\
  box-shadow: 0 4px 20px rgba(200,246,90,0.3);\
  transition: transform 0.2s, box-shadow 0.2s;\
}\
#lbm-chat-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(200,246,90,0.4); }\
#lbm-chat-bubble svg { width: 26px; height: 26px; fill: #0a0a0a; }\
#lbm-chat-bubble.open svg.chat-icon { display: none; }\
#lbm-chat-bubble.open svg.close-icon { display: block; }\
#lbm-chat-bubble:not(.open) svg.close-icon { display: none; }\
\
#lbm-chat-proactive {\
  position: fixed; bottom: 92px; right: 24px; z-index: 9989;\
  background: #161616; border: 1px solid #1e1e1e; border-radius: 14px;\
  padding: 18px 20px; max-width: 300px;\
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);\
  font-family: Inter, -apple-system, sans-serif;\
  display: none; animation: lbmSlideUp 0.3s ease;\
}\
#lbm-chat-proactive.visible { display: block; }\
#lbm-chat-proactive p {\
  font-size: 13px; color: #efefef; line-height: 1.55; margin: 0 0 14px;\
}\
#lbm-chat-proactive .lbm-pro-cta {\
  display: inline-block; padding: 9px 18px; background: #c8f65a;\
  color: #0a0a0a; font-size: 13px; font-weight: 700;\
  border-radius: 7px; border: none; cursor: pointer;\
  transition: background 0.2s;\
}\
#lbm-chat-proactive .lbm-pro-cta:hover { background: #d4f96a; }\
#lbm-chat-proactive .lbm-pro-close {\
  position: absolute; top: 8px; right: 10px;\
  background: none; border: none; color: #6b6b6b; font-size: 18px;\
  cursor: pointer; padding: 4px;\
}\
\
#lbm-chat-window {\
  position: fixed; bottom: 92px; right: 24px; z-index: 9991;\
  width: 380px; height: 520px;\
  background: #0a0a0a; border: 1px solid #1e1e1e; border-radius: 16px;\
  display: none; flex-direction: column;\
  box-shadow: 0 12px 48px rgba(0,0,0,0.6);\
  font-family: Inter, -apple-system, sans-serif;\
  overflow: hidden; animation: lbmSlideUp 0.25s ease;\
}\
#lbm-chat-window.open { display: flex; }\
\
.lbm-chat-header {\
  padding: 16px 18px; background: #111;\
  border-bottom: 1px solid #1e1e1e;\
  display: flex; align-items: center; gap: 12px;\
}\
.lbm-chat-avatar {\
  width: 36px; height: 36px; border-radius: 50%;\
  background: rgba(200,246,90,0.15); border: 1px solid rgba(200,246,90,0.3);\
  display: flex; align-items: center; justify-content: center;\
  font-size: 14px; font-weight: 800; color: #c8f65a;\
}\
.lbm-chat-header-text { flex: 1; }\
.lbm-chat-header-name { font-size: 14px; font-weight: 700; color: #fff; }\
.lbm-chat-header-status { font-size: 11px; color: #6b6b6b; }\
.lbm-chat-header-status .dot {\
  display: inline-block; width: 6px; height: 6px;\
  background: #c8f65a; border-radius: 50%; margin-right: 4px;\
  animation: lbmPulse 2s infinite;\
}\
\
.lbm-chat-messages {\
  flex: 1; overflow-y: auto; padding: 16px;\
  display: flex; flex-direction: column; gap: 10px;\
}\
.lbm-chat-messages::-webkit-scrollbar { width: 4px; }\
.lbm-chat-messages::-webkit-scrollbar-track { background: transparent; }\
.lbm-chat-messages::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }\
\
.lbm-msg {\
  max-width: 85%; padding: 10px 14px;\
  font-size: 13px; line-height: 1.55; border-radius: 14px;\
  word-wrap: break-word;\
}\
.lbm-msg.bot {\
  align-self: flex-start; background: #161616;\
  border: 1px solid #1e1e1e; color: #efefef;\
  border-bottom-left-radius: 4px;\
}\
.lbm-msg.user {\
  align-self: flex-end; background: #c8f65a;\
  color: #0a0a0a; font-weight: 500;\
  border-bottom-right-radius: 4px;\
}\
\
.lbm-typing {\
  align-self: flex-start; background: #161616;\
  border: 1px solid #1e1e1e; border-radius: 14px;\
  padding: 12px 18px; display: flex; gap: 5px;\
}\
.lbm-typing span {\
  width: 6px; height: 6px; background: #6b6b6b;\
  border-radius: 50%; animation: lbmBounce 1.4s infinite;\
}\
.lbm-typing span:nth-child(2) { animation-delay: 0.2s; }\
.lbm-typing span:nth-child(3) { animation-delay: 0.4s; }\
\
.lbm-slots-container {\
  align-self: flex-start; max-width: 95%; width: 100%;\
}\
.lbm-slots-label {\
  font-size: 11px; color: #6b6b6b; text-transform: uppercase;\
  letter-spacing: 0.06em; margin-bottom: 8px; font-weight: 600;\
}\
.lbm-slots {\
  display: flex; flex-wrap: wrap; gap: 6px;\
}\
.lbm-slot {\
  padding: 8px 14px; background: #161616;\
  border: 1px solid #1e1e1e; border-radius: 8px;\
  color: #efefef; font-size: 12px; font-weight: 600;\
  cursor: pointer; transition: all 0.15s;\
  font-family: Inter, -apple-system, sans-serif;\
}\
.lbm-slot:hover {\
  border-color: #c8f65a; background: rgba(200,246,90,0.08);\
  color: #c8f65a;\
}\
.lbm-slot.selected {\
  border-color: #c8f65a; background: rgba(200,246,90,0.15);\
  color: #c8f65a;\
}\
\
.lbm-booking-card {\
  align-self: flex-start; max-width: 90%;\
  background: #161616; border: 1px solid rgba(200,246,90,0.3);\
  border-radius: 14px; padding: 16px; margin-top: 4px;\
}\
.lbm-booking-card .lbm-bc-check {\
  font-size: 20px; margin-bottom: 8px;\
}\
.lbm-booking-card .lbm-bc-title {\
  font-size: 14px; font-weight: 700; color: #c8f65a; margin-bottom: 10px;\
}\
.lbm-booking-card .lbm-bc-row {\
  font-size: 12px; color: #efefef; margin-bottom: 4px; line-height: 1.5;\
}\
.lbm-booking-card .lbm-bc-row span { color: #6b6b6b; }\
.lbm-booking-card .lbm-bc-link {\
  display: inline-block; margin-top: 10px; padding: 7px 14px;\
  background: rgba(200,246,90,0.1); border: 1px solid rgba(200,246,90,0.2);\
  border-radius: 6px; color: #c8f65a; font-size: 12px;\
  font-weight: 600; text-decoration: none;\
}\
.lbm-booking-card .lbm-bc-link:hover { background: rgba(200,246,90,0.18); }\
\
.lbm-chat-input-area {\
  padding: 12px 14px; background: #111; border-top: 1px solid #1e1e1e;\
  display: flex; gap: 10px; align-items: center;\
}\
.lbm-chat-input-area input {\
  flex: 1; background: #0a0a0a; border: 1px solid #1e1e1e;\
  border-radius: 10px; padding: 10px 14px;\
  color: #efefef; font-size: 13px;\
  font-family: Inter, -apple-system, sans-serif;\
  outline: none; transition: border-color 0.2s;\
}\
.lbm-chat-input-area input:focus { border-color: #c8f65a; }\
.lbm-chat-input-area input::placeholder { color: #6b6b6b; }\
.lbm-chat-input-area button {\
  width: 38px; height: 38px; border-radius: 10px;\
  background: #c8f65a; border: none; cursor: pointer;\
  display: flex; align-items: center; justify-content: center;\
  transition: background 0.2s; flex-shrink: 0;\
}\
.lbm-chat-input-area button:hover { background: #d4f96a; }\
.lbm-chat-input-area button:disabled { opacity: 0.4; cursor: not-allowed; }\
.lbm-chat-input-area button svg { width: 18px; height: 18px; fill: #0a0a0a; }\
\
.lbm-contact-form {\
  flex: 1; padding: 24px 20px; display: flex; flex-direction: column;\
  justify-content: center; gap: 14px;\
}\
.lbm-contact-form h3 {\
  font-size: 16px; font-weight: 700; color: #fff; margin: 0 0 4px;\
}\
.lbm-contact-form p {\
  font-size: 12px; color: #6b6b6b; margin: 0 0 8px; line-height: 1.5;\
}\
.lbm-contact-form input {\
  background: #161616; border: 1px solid #1e1e1e; border-radius: 10px;\
  padding: 11px 14px; color: #efefef; font-size: 13px;\
  font-family: Inter, -apple-system, sans-serif;\
  outline: none; transition: border-color 0.2s; width: 100%;\
  box-sizing: border-box;\
}\
.lbm-contact-form input:focus { border-color: #c8f65a; }\
.lbm-contact-form input::placeholder { color: #6b6b6b; }\
.lbm-contact-form .lbm-form-btn {\
  padding: 12px 20px; background: #c8f65a; color: #0a0a0a;\
  font-size: 14px; font-weight: 700; border: none; border-radius: 10px;\
  cursor: pointer; transition: background 0.2s; margin-top: 4px;\
  font-family: Inter, -apple-system, sans-serif;\
}\
.lbm-contact-form .lbm-form-btn:hover { background: #d4f96a; }\
.lbm-contact-form .lbm-form-btn:disabled { opacity: 0.4; cursor: not-allowed; }\
.lbm-contact-form .lbm-form-error {\
  font-size: 11px; color: #ff6b6b; margin: 0; display: none;\
}\
\
@keyframes lbmSlideUp {\
  from { opacity: 0; transform: translateY(16px); }\
  to { opacity: 1; transform: translateY(0); }\
}\
@keyframes lbmBounce {\
  0%, 60%, 100% { transform: translateY(0); }\
  30% { transform: translateY(-4px); }\
}\
@keyframes lbmPulse {\
  0%, 100% { opacity: 1; }\
  50% { opacity: 0.4; }\
}\
\
@media (max-width: 480px) {\
  #lbm-chat-window {\
    top: 0; left: 0; right: 0; bottom: 0;\
    width: 100%; height: 100%;\
    border-radius: 0; border: none;\
  }\
  #lbm-chat-bubble { bottom: 16px; right: 16px; }\
  #lbm-chat-proactive { bottom: 84px; right: 16px; left: 16px; max-width: none; }\
}\
';

  // -- STATE --
  var chatOpen = false;
  var messages = []; // { role: 'user'|'assistant', content: string }
  var sending = false;
  var proactiveDismissed = false;
  var proactiveShown = false;
  var contactInfo = null; // { name, email, phone }
  var contactFormSubmitted = false;

  // DOM refs
  var bubble, chatWindow, messagesEl, inputEl, sendBtn, proactiveEl, typingEl;
  var contactFormEl, chatBody;

  // -- INIT --
  function init() {
    // Inject CSS
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Restore session
    restoreSession();

    // Build DOM
    createBubble();
    createProactive();
    createChatWindow();

    // Setup proactive trigger
    if (!isDismissed() && messages.length === 0) {
      setupProactiveTrigger();
    }

    // If we have existing messages, render them and skip form
    if (messages.length > 0) {
      showChatView();
      messages.forEach(function(m) {
        appendMessage(m.role === 'user' ? 'user' : 'bot', m.content);
      });
    }
  }

  // -- DOM CREATION --

  function createBubble() {
    bubble = document.createElement('button');
    bubble.id = 'lbm-chat-bubble';
    bubble.setAttribute('aria-label', 'Open chat');
    bubble.innerHTML = '\
      <svg class="chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>\
      <svg class="close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    bubble.addEventListener('click', toggleChat);
    document.body.appendChild(bubble);
  }

  function createProactive() {
    proactiveEl = document.createElement('div');
    proactiveEl.id = 'lbm-chat-proactive';
    proactiveEl.innerHTML = '\
      <button class="lbm-pro-close" aria-label="Dismiss">&times;</button>\
      <p>Most businesses lose $8K-$30K/month in hidden revenue leaks. Want to find out if yours is one of them?</p>\
      <button class="lbm-pro-cta">Find out now</button>';

    proactiveEl.querySelector('.lbm-pro-close').addEventListener('click', function(e) {
      e.stopPropagation();
      dismissProactive();
    });
    proactiveEl.querySelector('.lbm-pro-cta').addEventListener('click', function() {
      hideProactive();
      openChat('proactive_popup');
    });
    document.body.appendChild(proactiveEl);
  }

  function createChatWindow() {
    chatWindow = document.createElement('div');
    chatWindow.id = 'lbm-chat-window';
    chatWindow.innerHTML = '\
      <div class="lbm-chat-header">\
        <div class="lbm-chat-avatar">LB</div>\
        <div class="lbm-chat-header-text">\
          <div class="lbm-chat-header-name">Logic Based Marketing</div>\
          <div class="lbm-chat-header-status"><span class="dot"></span>Online</div>\
        </div>\
      </div>\
      <div class="lbm-contact-form" id="lbm-contact-form">\
        <h3>Before we chat...</h3>\
        <p>So we can give you the most relevant advice and follow up if needed.</p>\
        <input type="text" id="lbm-cf-name" placeholder="Your name" autocomplete="name" />\
        <input type="email" id="lbm-cf-email" placeholder="Email address" autocomplete="email" />\
        <input type="tel" id="lbm-cf-phone" placeholder="Phone number" autocomplete="tel" />\
        <p class="lbm-form-error" id="lbm-cf-error">Please fill in all fields.</p>\
        <button class="lbm-form-btn" id="lbm-cf-submit">Start chatting</button>\
      </div>\
      <div class="lbm-chat-messages" style="display:none;"></div>\
      <div class="lbm-chat-input-area" style="display:none;">\
        <input type="text" placeholder="Type a message..." autocomplete="off" />\
        <button aria-label="Send" disabled>\
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>\
        </button>\
      </div>';

    contactFormEl = chatWindow.querySelector('#lbm-contact-form');
    messagesEl = chatWindow.querySelector('.lbm-chat-messages');
    chatBody = chatWindow.querySelector('.lbm-chat-input-area');
    inputEl = chatBody.querySelector('input');
    sendBtn = chatBody.querySelector('button');

    // Contact form submission
    var cfSubmit = chatWindow.querySelector('#lbm-cf-submit');
    var cfError = chatWindow.querySelector('#lbm-cf-error');

    cfSubmit.addEventListener('click', function() {
      var name = chatWindow.querySelector('#lbm-cf-name').value.trim();
      var email = chatWindow.querySelector('#lbm-cf-email').value.trim();
      var phone = chatWindow.querySelector('#lbm-cf-phone').value.trim();

      if (!name || !email || !phone) {
        cfError.style.display = 'block';
        return;
      }

      // Basic email validation
      if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        cfError.textContent = 'Please enter a valid email address.';
        cfError.style.display = 'block';
        return;
      }

      cfError.style.display = 'none';
      contactInfo = { name: name, email: email, phone: phone };
      contactFormSubmitted = true;
      saveContact();

      // Push to Mailchimp immediately (don't wait for response)
      fetch(API_URL + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo),
      }).catch(function() { /* silent fail, chat still works */ });

      pushEvent('chat_contact_captured', { method: 'form' });

      // Switch to chat view
      showChatView();

      // Start conversation with contact info prepended to first message
      startConversation();
    });

    // Allow Enter key on form fields
    var formInputs = contactFormEl.querySelectorAll('input');
    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].addEventListener('keydown', function(e) {
        if (e.key === 'Enter') cfSubmit.click();
      });
    }

    inputEl.addEventListener('input', function() {
      sendBtn.disabled = !inputEl.value.trim() || sending;
    });
    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !sendBtn.disabled) sendMessage();
    });
    sendBtn.addEventListener('click', sendMessage);

    document.body.appendChild(chatWindow);
  }

  function showChatView() {
    contactFormEl.style.display = 'none';
    messagesEl.style.display = 'flex';
    chatBody.style.display = 'flex';
  }

  // -- CHAT LOGIC --

  function toggleChat() {
    if (chatOpen) {
      closeChat();
    } else {
      openChat('bubble_click');
    }
  }

  function openChat(trigger) {
    chatOpen = true;
    window.lbmChatOpen = true;
    chatWindow.classList.add('open');
    bubble.classList.add('open');
    hideProactive();

    pushEvent('chat_opened', { trigger: trigger || 'bubble_click' });

    // If contact already submitted (restored from session), show chat view
    if (contactFormSubmitted && messages.length === 0) {
      showChatView();
      startConversation();
    } else if (contactFormSubmitted) {
      showChatView();
      inputEl.focus();
    } else {
      // Show form, focus first field
      var nameField = chatWindow.querySelector('#lbm-cf-name');
      if (nameField) setTimeout(function() { nameField.focus(); }, 100);
    }
  }

  function closeChat() {
    chatOpen = false;
    window.lbmChatOpen = false;
    chatWindow.classList.remove('open');
    bubble.classList.remove('open');
  }

  function startConversation() {
    if (messages.length > 0) return;

    // Send a hidden first message with contact info so the bot knows who they are
    var contactMsg = '[CONTACT: name=' + contactInfo.name + ', email=' + contactInfo.email + ', phone=' + contactInfo.phone + ']';
    messages.push({ role: 'user', content: contactMsg });
    // Don't render this message visually, it's just for the bot

    showTyping();
    sending = true;

    fetch(API_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages }),
    })
    .then(function(resp) {
      if (!resp.ok) throw new Error('API error ' + resp.status);
      return resp.json();
    })
    .then(function(data) {
      hideTyping();
      sending = false;

      if (data.reply) {
        messages.push({ role: 'assistant', content: data.reply });
        appendMessage('bot', data.reply);
      }

      if (data.action) {
        handleAction(data.action);
      }

      saveSession();
      inputEl.focus();
    })
    .catch(function(err) {
      hideTyping();
      sending = false;
      console.error('LBM Chat error:', err);
      var firstName = contactInfo.name.split(' ')[0];
      var greeting = "Hey " + firstName + ", thanks for reaching out. What kind of business are you running?";
      messages.push({ role: 'assistant', content: greeting });
      appendMessage('bot', greeting);
      saveSession();
    });
  }

  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || sending) return;

    inputEl.value = '';
    sendBtn.disabled = true;

    // Add user message
    messages.push({ role: 'user', content: text });
    appendMessage('user', text);
    saveSession();
    pushEvent('chat_message_sent');

    // Show typing indicator
    showTyping();
    sending = true;

    // Send to API
    fetch(API_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages }),
    })
    .then(function(resp) {
      if (!resp.ok) throw new Error('API error ' + resp.status);
      return resp.json();
    })
    .then(function(data) {
      hideTyping();
      sending = false;

      if (data.reply) {
        messages.push({ role: 'assistant', content: data.reply });
        appendMessage('bot', data.reply);
      }

      // Handle special actions
      if (data.action) {
        handleAction(data.action);
      }

      saveSession();
      inputEl.focus();
      sendBtn.disabled = !inputEl.value.trim();
    })
    .catch(function(err) {
      hideTyping();
      sending = false;
      console.error('LBM Chat error:', err);
      var errMsg = "I'm having a connection issue. You can reach Tyler directly at tyler@logicbasedmarketing.com or book here: https://koalendar.com/e/revenue-challenge";
      messages.push({ role: 'assistant', content: errMsg });
      appendMessage('bot', errMsg);
      saveSession();
      sendBtn.disabled = !inputEl.value.trim();
    });
  }

  function handleAction(action) {
    if (action.type === 'show_slots' && action.data && action.data.slots) {
      pushEvent('chat_booking_initiated');
      renderSlots(action.data.slots);
    } else if (action.type === 'booking_confirmed' && action.data) {
      pushEvent('chat_booking_confirmed');
      renderBookingCard(action.data);
    }
  }

  // -- RENDERING --

  function appendMessage(type, text) {
    var div = document.createElement('div');
    div.className = 'lbm-msg ' + type;

    // Convert URLs in text to links
    var escaped = escapeHtml(text);
    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">$1</a>');
    // Convert newlines to <br>
    escaped = escaped.replace(/\n/g, '<br>');
    div.innerHTML = escaped;

    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function renderSlots(slots) {
    var container = document.createElement('div');
    container.className = 'lbm-slots-container';

    var label = document.createElement('div');
    label.className = 'lbm-slots-label';
    label.textContent = 'Available times';
    container.appendChild(label);

    var slotsDiv = document.createElement('div');
    slotsDiv.className = 'lbm-slots';

    slots.forEach(function(slot) {
      var btn = document.createElement('button');
      btn.className = 'lbm-slot';
      btn.textContent = slot.display;
      btn.addEventListener('click', function() {
        // Deselect others
        slotsDiv.querySelectorAll('.lbm-slot').forEach(function(s) { s.classList.remove('selected'); });
        btn.classList.add('selected');

        // Send the selection as a user message
        var msg = "I'd like " + slot.display;
        inputEl.value = msg;
        sendMessage();
      });
      slotsDiv.appendChild(btn);
    });

    container.appendChild(slotsDiv);
    messagesEl.appendChild(container);
    scrollToBottom();
  }

  function renderBookingCard(data) {
    var card = document.createElement('div');
    card.className = 'lbm-booking-card';
    var html = '<div class="lbm-bc-check">\u2705</div>';
    html += '<div class="lbm-bc-title">You\'re booked!</div>';
    html += '<div class="lbm-bc-row"><span>When:</span> ' + escapeHtml(data.start) + '</div>';
    html += '<div class="lbm-bc-row"><span>What:</span> ' + escapeHtml(data.summary) + '</div>';
    if (data.meetLink) {
      html += '<a class="lbm-bc-link" href="' + escapeHtml(data.meetLink) + '" target="_blank" rel="noopener">\uD83D\uDCF9 Google Meet Link</a>';
    }
    html += '<div class="lbm-bc-row" style="margin-top:8px;font-size:11px;color:#6b6b6b;">A calendar invite has been sent to your email.</div>';
    card.innerHTML = html;
    messagesEl.appendChild(card);
    scrollToBottom();
  }

  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'lbm-typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typingEl);
    scrollToBottom();
  }

  function hideTyping() {
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
    typingEl = null;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // -- PROACTIVE TRIGGER --

  function setupProactiveTrigger() {
    var triggered = false;

    function trigger() {
      if (triggered || chatOpen || proactiveDismissed) return;
      // Don't show if email popup is visible
      var emailOverlay = document.getElementById('email-popup-overlay');
      if (emailOverlay && emailOverlay.classList.contains('visible')) return;
      triggered = true;
      showProactive();
    }

    // Delay trigger
    setTimeout(trigger, PROACTIVE_DELAY);

    // Scroll trigger
    window.addEventListener('scroll', function() {
      var scrollPct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPct >= PROACTIVE_SCROLL) trigger();
    });
  }

  function showProactive() {
    if (proactiveShown) return;
    proactiveShown = true;
    proactiveEl.classList.add('visible');
  }

  function hideProactive() {
    proactiveEl.classList.remove('visible');
  }

  function dismissProactive() {
    hideProactive();
    proactiveDismissed = true;
    // Set cookie for 24 hours
    var expires = new Date(Date.now() + 86400000).toUTCString();
    document.cookie = DISMISS_COOKIE + '=1;expires=' + expires + ';path=/;SameSite=Lax';
  }

  function isDismissed() {
    return document.cookie.indexOf(DISMISS_COOKIE + '=1') !== -1;
  }

  // -- SESSION PERSISTENCE --

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
      if (contactInfo) {
        sessionStorage.setItem(CONTACT_KEY, JSON.stringify(contactInfo));
      }
    } catch (e) { /* quota exceeded */ }
  }

  function saveContact() {
    try {
      if (contactInfo) {
        sessionStorage.setItem(CONTACT_KEY, JSON.stringify(contactInfo));
      }
    } catch (e) { /* quota exceeded */ }
  }

  function restoreSession() {
    try {
      var stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        messages = JSON.parse(stored);
      }
      var storedContact = sessionStorage.getItem(CONTACT_KEY);
      if (storedContact) {
        contactInfo = JSON.parse(storedContact);
        contactFormSubmitted = true;
      }
    } catch (e) {
      messages = [];
    }
  }

  // -- GTM EVENTS --

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

  // -- HELPERS --

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // -- BOOT --
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
