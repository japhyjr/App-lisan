/*
═══════════════════════════════════════════════════════════════
  EMAIL-CAPTURE.JS - Secure Netlify Function Integration
  
  FEATURES:
  - Email capture with validation
  - Secure backend integration (NO API keys exposed!)
  - Progressive engagement triggers
  - Thank you flow
  - Analytics tracking
  
  SECURITY: Uses Netlify serverless function to protect API keys
═══════════════════════════════════════════════════════════════
*/

// ========== CONFIGURATION ==========

const EMAIL_CONFIG = {
  netlify: {
    endpoint: '/.netlify/functions/subscribe', // Netlify function endpoint
    enabled: true // Always true - uses secure backend
  },
  triggers: {
    afterTranslations: 10, // Ask after 10 translations
    afterLessons: 5,       // Ask after 5 lessons
    onExit: true,          // Show exit intent popup
    onLimit: true          // Show when daily limit reached
  }
};

// ========== EMAIL VALIDATION ==========

/**
 * Validate email format
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ========== EMAIL CAPTURE ==========

/**
 * Capture email via secure Netlify function
 */
async function captureEmail(email, source = 'unknown') {
  // Validate email
  if (!validateEmail(email)) {
    return {
      success: false,
      error: 'Invalid email format'
    };
  }
  
  // Check if already captured
  if (localStorage.getItem('userEmail') === email) {
    return {
      success: true,
      message: 'Already registered',
      duplicate: true
    };
  }
  
  // Store locally first (backup, always works)
  localStorage.setItem('userEmail', email);
  localStorage.setItem('emailCaptureDate', new Date().toISOString());
  localStorage.setItem('emailCaptureSource', source);
  
  // Send to secure Netlify function
  if (EMAIL_CONFIG.netlify.enabled) {
    try {
      const result = await sendToNetlify(email);
      
      if (result.success) {
        console.log('✅ Email added to Resend via Netlify');
        trackEvent('email_captured', {
          source: source,
          method: 'netlify'
        });
      }
      
      return result;
      
    } catch (error) {
      console.error('Netlify function error:', error);
      // Continue - we already have email stored locally
      trackEvent('email_captured_offline', {
        source: source,
        method: 'local_only'
      });
    }
  }
  
  // Track local save
  trackEvent('email_captured', {
    source: source,
    method: 'local'
  });
  
  return {
    success: true,
    message: 'Email captured successfully',
    storedLocally: true
  };
}

/**
 * Send email to Netlify serverless function
 */
async function sendToNetlify(email) {
  try {
    const response = await fetch(EMAIL_CONFIG.netlify.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

// ========== PROGRESSIVE ENGAGEMENT ==========

/**
 * Check if should show email prompt based on usage
 */
function shouldShowEmailPrompt() {
  // Already captured?
  if (localStorage.getItem('userEmail')) {
    return false;
  }
  
  // Get usage stats
  const translationCount = parseInt(localStorage.getItem('totalTranslations') || '0');
  const lessonCount = parseInt(localStorage.getItem('lessonsCompleted') || '0');
  
  // Check triggers
  if (translationCount >= EMAIL_CONFIG.triggers.afterTranslations) {
    return 'after_translations';
  }
  
  if (lessonCount >= EMAIL_CONFIG.triggers.afterLessons) {
    return 'after_lessons';
  }
  
  return false;
}

/**
 * Show email capture popup
 */
function showEmailPopup(trigger = 'manual', customMessage = null) {
  // Don't show if already captured
  if (localStorage.getItem('userEmail')) {
    return;
  }
  
  // Don't show too often
  const lastShown = localStorage.getItem('emailPopupLastShown');
  if (lastShown) {
    const hoursSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      return; // Don't show more than once per day
    }
  }
  
  // Messages based on trigger
  const messages = {
    after_translations: {
      title: '🎉 You\'re on a roll!',
      message: 'You\'ve used 10 translations! Want unlimited access?'
    },
    after_lessons: {
      title: '📚 Great progress!',
      message: 'You\'ve completed 5 lessons! Join our waitlist for premium features.'
    },
    limit_reached: {
      title: '🔒 Daily Limit Reached',
      message: 'Get notified when premium launches with unlimited translations!'
    },
    exit_intent: {
      title: '👋 Before you go...',
      message: 'Join our list and get early access to premium features!'
    }
  };
  
  const content = messages[trigger] || messages.after_translations;
  
  const popup = document.createElement('div');
  popup.className = 'email-popup-overlay';
  popup.innerHTML = `
    <div class="email-popup">
      <button class="popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
      
      <h2>${content.title}</h2>
      <p style="font-size: 1.1rem; margin: 1rem 0;">
        ${customMessage || content.message}
      </p>
      
      <form onsubmit="handleEmailSubmit(event, '${trigger}')" class="email-form">
        <input 
          type="email" 
          id="popup-email" 
          placeholder="your@email.com" 
          required
          autofocus
        >
        <button type="submit" class="btn btn-primary">
          Join Waitlist 🔔
        </button>
      </form>
      
      <p style="font-size: 0.85rem; color: #666; margin-top: 1rem;">
        ✅ Get early access pricing<br>
        ✅ No spam, unsubscribe anytime
      </p>
      
      <button 
        onclick="this.parentElement.parentElement.remove()" 
        style="background: none; border: none; color: #999; cursor: pointer; margin-top: 1rem;"
      >
        Maybe later
      </button>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Record that we showed popup
  localStorage.setItem('emailPopupLastShown', Date.now().toString());
  
  trackEvent('email_popup_shown', { trigger: trigger });
}

/**
 * Handle email form submission
 */
async function handleEmailSubmit(event, source) {
  event.preventDefault();
  
  const email = document.getElementById('popup-email').value;
  const button = event.target.querySelector('button[type="submit"]');
  
  // Disable button
  button.disabled = true;
  button.textContent = 'Adding...';
  
  // Capture email
  const result = await captureEmail(email, source);
  
  if (result.success) {
    // Show success message
    event.target.closest('.email-popup').innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
        <h2>You're In!</h2>
        <p style="font-size: 1.1rem; margin: 1rem 0;">
          Thanks for joining the waitlist!
        </p>
        <p style="color: #666;">
          We'll notify you about premium launch with special pricing!
        </p>
        <button 
          onclick="this.closest('.email-popup-overlay').remove()" 
          class="btn btn-primary"
          style="margin-top: 1.5rem;"
        >
          Continue Learning →
        </button>
      </div>
    `;
  } else {
    // Show error
    button.disabled = false;
    button.textContent = 'Try Again';
    alert(result.error || 'Failed to add email. Please try again.');
  }
}

// ========== EXIT INTENT ==========

/**
 * Show popup when user tries to leave
 */
function initExitIntent() {
  if (!EMAIL_CONFIG.triggers.onExit) return;
  if (localStorage.getItem('userEmail')) return;
  
  let exitShown = false;
  
  document.addEventListener('mouseleave', (e) => {
    // Mouse left viewport at top
    if (e.clientY < 10 && !exitShown) {
      exitShown = true;
      showEmailPopup('exit_intent');
    }
  });
}

// ========== AUTO-TRIGGER SYSTEM ==========

/**
 * Check and show email prompt if appropriate
 */
function checkAndShowEmailPrompt() {
  const trigger = shouldShowEmailPrompt();
  
  if (trigger) {
    // Small delay for better UX
    setTimeout(() => {
      showEmailPopup(trigger);
    }, 2000);
  }
}

// ========== ANALYTICS ==========

function trackEvent(eventName, properties) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, properties);
  }
  console.log(`📊 Event: ${eventName}`, properties);
}

// ========== INITIALIZATION ==========

/**
 * Initialize email capture system
 */
function initEmailCapture() {
  // Set up exit intent
  initExitIntent();
  
  // Check if should show popup (after page load)
  setTimeout(checkAndShowEmailPrompt, 3000);
  
  console.log('✅ Email capture initialized (Secure Netlify mode)');
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
  shouldShowEmailPrompt,
  checkAndShowEmailPrompt
};

console.log('✅ Email capture module loaded (Secure mode - No API keys exposed!)');

/*
═══════════════════════════════════════════════════════════════
  SECURITY NOTES:
  
  ✅ NO API KEYS in this file!
  ✅ Uses Netlify serverless function
  ✅ API keys stored securely in Netlify environment variables
  ✅ Safe to commit to GitHub
  
═══════════════════════════════════════════════════════════════
*/