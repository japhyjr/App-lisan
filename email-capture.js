/*
═══════════════════════════════════════════════════════════════
  EMAIL-CAPTURE.JS - Multi-language + Page-specific Triggers
  
  TRIGGERS:
  1. Landing Page: Exit intent
  2. Premium Page: Exit intent
  3. Index/App Page: Translation limit reached
═══════════════════════════════════════════════════════════════
*/

// ========== CONFIGURATION ==========

const EMAIL_CONFIG = {
  netlify: {
    endpoint: '/.netlify/functions/subscribe',
    enabled: true
  },
  triggers: {
    translationLimit: 5,    // Free translations per day
    exitIntent: true,        // Show on exit (LP & Premium)
    limitReached: true       // Show when limit hit (App)
  }
};

// ========== PAGE DETECTION ==========

function detectCurrentPage() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  
  if (filename.includes('landing') || path === '/' || filename === '') {
    return 'landing';
  } else if (filename.includes('premium')) {
    return 'premium';
  } else if (filename.includes('index') || filename.includes('app')) {
    return 'app';
  }
  
  return 'unknown';
}

// ========== EMAIL VALIDATION ==========

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ========== EMAIL CAPTURE ==========

async function captureEmail(email, source = 'unknown') {
  if (!validateEmail(email)) {
    return {
      success: false,
      error: window.t ? window.t('error') : 'Invalid email format'
    };
  }
  
  if (localStorage.getItem('userEmail') === email) {
    return {
      success: true,
      message: 'Already registered',
      duplicate: true
    };
  }
  
  localStorage.setItem('userEmail', email);
  localStorage.setItem('emailCaptureDate', new Date().toISOString());
  localStorage.setItem('emailCaptureSource', source);
  
  if (EMAIL_CONFIG.netlify.enabled) {
    try {
      const result = await sendToNetlify(email);
      
      if (result.success) {
        console.log('✅ Email successfully added to waitlist!');
        trackEvent('email_captured', { source, method: 'netlify' });
      }
      
      return result;
      
    } catch (error) {
      console.error('Netlify function error:', error);
      trackEvent('email_captured_offline', { source, method: 'local_only' });
    }
  }
  
  trackEvent('email_captured', { source, method: 'local' });
  
  return {
    success: true,
    message: 'Email captured successfully',
    storedLocally: true
  };
}

async function sendToNetlify(email) {
  try {
    const response = await fetch(EMAIL_CONFIG.netlify.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return {
      success: true,
      message: data.message || 'Added to email list'
    };
    
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ========== TRANSLATION LIMIT TRACKING ==========

function getTranslationCount() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('translationStats');
  
  if (!stored) {
    return { count: 0, date: today };
  }
  
  const stats = JSON.parse(stored);
  
  // Reset if different day
  if (stats.date !== today) {
    return { count: 0, date: today };
  }
  
  return stats;
}

function incrementTranslationCount() {
  const stats = getTranslationCount();
  stats.count += 1;
  
  localStorage.setItem('translationStats', JSON.stringify(stats));
  
  // Check if limit reached
  if (stats.count >= EMAIL_CONFIG.triggers.translationLimit) {
    onTranslationLimitReached();
  }
  
  return stats;
}

function onTranslationLimitReached() {
  // Only show if user hasn't subscribed
  if (!localStorage.getItem('userEmail')) {
    // Small delay for better UX
    setTimeout(() => {
      showEmailPopup('limit_reached');
    }, 1000);
  }
}

// ========== EMAIL POPUP ==========

function showEmailPopup(trigger = 'manual') {
  if (localStorage.getItem('userEmail')) {
    return;
  }
  
  // Don't show too often
  const lastShown = localStorage.getItem('emailPopupLastShown');
  if (lastShown) {
    const hoursSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      return;
    }
  }
  
  // Get translated text
  const t = window.t || ((key) => key);
  
  // Messages based on trigger and page
  const currentPage = detectCurrentPage();
  let title, message;
  
  if (trigger === 'exit_intent' && currentPage === 'landing') {
    title = t('popup_exit_title');
    message = t('popup_exit_message');
  } else if (trigger === 'exit_intent' && currentPage === 'premium') {
    title = t('popup_exit_title');
    message = t('popup_exit_message');
  } else if (trigger === 'limit_reached') {
    title = t('popup_limit_title');
    message = t('popup_limit_message');
  } else {
    title = t('popup_exit_title');
    message = t('popup_exit_message');
  }
  
  const popup = document.createElement('div');
  popup.className = 'email-popup-overlay';
  popup.innerHTML = `
    <div class="email-popup">
      <button class="popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
      
      <h2>${title}</h2>
      <p style="font-size: 1.1rem; margin: 1rem 0;">
        ${message}
      </p>
      
      <form onsubmit="handleEmailSubmit(event, '${trigger}')" class="email-form">
        <input 
          type="email" 
          id="popup-email" 
          placeholder="${t('email_placeholder')}" 
          required
          autofocus
        >
        <button type="submit" class="btn btn-primary">
          ${t('join_waitlist')}
        </button>
      </form>
      
      <p style="font-size: 0.85rem; color: #666; margin-top: 1rem;">
        ✅ ${currentPage === 'premium' ? t('premium_features') : t('get_started')}<br>
        ✅ ${t('popup_success_note')}
      </p>
      
      <button 
        onclick="this.parentElement.parentElement.remove()" 
        style="background: none; border: none; color: #999; cursor: pointer; margin-top: 1rem;"
      >
        ${t('maybe_later')}
      </button>
    </div>
  `;
  
  document.body.appendChild(popup);
  localStorage.setItem('emailPopupLastShown', Date.now().toString());
  trackEvent('email_popup_shown', { trigger, page: currentPage });
}

async function handleEmailSubmit(event, source) {
  event.preventDefault();
  
  const t = window.t || ((key) => key);
  const email = document.getElementById('popup-email').value;
  const button = event.target.querySelector('button[type="submit"]');
  
  button.disabled = true;
  button.textContent = t('loading');
  
  const result = await captureEmail(email, source);
  
  if (result.success) {
    event.target.closest('.email-popup').innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
        <h2>${t('popup_success_title')}</h2>
        <p style="font-size: 1.1rem; margin: 1rem 0;">
          ${t('popup_success_message')}
        </p>
        <p style="color: #666;">
          ${t('popup_success_note')}
        </p>
        <button 
          onclick="this.closest('.email-popup-overlay').remove()" 
          class="btn btn-primary"
          style="margin-top: 1.5rem;"
        >
          ${t('continue_learning')}
        </button>
      </div>
    `;
  } else {
    button.disabled = false;
    button.textContent = t('try_again');
    alert(result.error || t('error'));
  }
}

// ========== EXIT INTENT ==========

function initExitIntent() {
  const currentPage = detectCurrentPage();
  
  // Only on landing and premium pages
  if (currentPage !== 'landing' && currentPage !== 'premium') {
    return;
  }
  
  if (!EMAIL_CONFIG.triggers.exitIntent) return;
  if (localStorage.getItem('userEmail')) return;
  
  let exitShown = false;
  
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !exitShown) {
      exitShown = true;
      showEmailPopup('exit_intent');
    }
  });
  
  console.log(`✅ Exit intent enabled for ${currentPage} page`);
}

// ========== ANALYTICS ==========

function trackEvent(eventName, properties) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, properties);
  }
  console.log(`📊 Event: ${eventName}`, properties);
}

// ========== INITIALIZATION ==========

function initEmailCapture() {
  const currentPage = detectCurrentPage();
  
  console.log(`📄 Current page: ${currentPage}`);
  
  // Init exit intent for landing & premium
  if (currentPage === 'landing' || currentPage === 'premium') {
    initExitIntent();
  }
  
  // Init translation tracking for app page
  if (currentPage === 'app') {
    console.log('✅ Translation limit tracking enabled');
    // Translation count will be incremented by your translate function
  }
  
  console.log('✅ Email capture initialized (Multi-language ready)');
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmailCapture);
} else {
  initEmailCapture();
}

// ========== EXPORT ==========

window.EMAIL_CAPTURE = {
  captureEmail,
  showEmailPopup,
  validateEmail,
  incrementTranslationCount,
  getTranslationCount
};

// Make handleEmailSubmit global for inline onclick
window.handleEmailSubmit = handleEmailSubmit;

console.log('✅ Email capture module loaded (Multi-language + Page-specific triggers)');