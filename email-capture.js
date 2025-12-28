/*
═══════════════════════════════════════════════════════════════
  EMAIL-CAPTURE.JS - Resend API Integration
  
  FEATURES:
  - Email capture with validation
  - Resend API integration
  - Progressive engagement triggers
  - Thank you flow
  - Analytics tracking
═══════════════════════════════════════════════════════════════
*/

// ========== CONFIGURATION ==========

const EMAIL_CONFIG = {
    resend: {
      apiKey: 'YOUR_RESEND_API_KEY', // Add your key here
      audienceId: 'YOUR_AUDIENCE_ID', // Add your audience ID
      endpoint: 'https://api.resend.com/audiences',
      enabled: false // Set to true when configured
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
   * Capture email and add to Resend
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
    
    // Store locally first (always works)
    localStorage.setItem('userEmail', email);
    localStorage.setItem('emailCaptureDate', new Date().toISOString());
    localStorage.setItem('emailCaptureSource', source);
    
    // Try Resend API if configured
    if (EMAIL_CONFIG.resend.enabled && EMAIL_CONFIG.resend.apiKey) {
      try {
        const result = await addToResend(email);
        
        if (result.success) {
          console.log('✅ Email added to Resend');
          trackEvent('email_captured', {
            source: source,
            method: 'resend'
          });
        }
        
        return result;
        
      } catch (error) {
        console.error('Resend API error:', error);
        // Continue - we already have email stored locally
      }
    }
    
    // Track even if Resend not configured
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
   * Add email to Resend audience
   */
  async function addToResend(email) {
    const url = `${EMAIL_CONFIG.resend.endpoint}/${EMAIL_CONFIG.resend.audienceId}/contacts`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_CONFIG.resend.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          unsubscribed: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        contactId: data.id,
        message: 'Added to email list'
      };
      
    } catch (error) {
      console.error('Resend error:', error);
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
            Check your email for confirmation.
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
    
    console.log('✅ Email capture initialized');
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
  
  console.log('✅ Email capture module loaded');
  
  /*
  ═══════════════════════════════════════════════════════════════
    CSS STYLES TO ADD TO style.css
  ═══════════════════════════════════════════════════════════════
  
  .email-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
    animation: fadeIn 0.3s ease;
  }
  
  .email-popup {
    background: white;
    border-radius: 20px;
    padding: 2.5rem;
    max-width: 500px;
    width: 100%;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
  }
  
  .popup-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
  }
  
  .popup-close:hover {
    color: #333;
  }
  
  .email-popup h2 {
    color: #667eea;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .email-popup .email-form {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .email-popup .email-form input {
    padding: 1rem;
    border: 2px solid #ddd;
    border-radius: 50px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  .email-popup .email-form input:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .email-popup .email-form button {
    padding: 1rem 2rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, background 0.3s;
  }
  
  .email-popup .email-form button:hover {
    background: #5568d3;
    transform: scale(1.02);
  }
  
  .email-popup .email-form button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(50px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 600px) {
    .email-popup {
      padding: 2rem 1.5rem;
    }
  }
  
  ═══════════════════════════════════════════════════════════════
  
  HOW TO CONFIGURE RESEND:
  
  1. Create Resend account: https://resend.com/
  2. Get API key: Dashboard → API Keys → Create
  3. Create audience: Dashboard → Audiences → Create
  4. Update EMAIL_CONFIG above with your keys
  5. Set enabled: true
  
  FREE TIER: 3,000 emails/month, 100/day
  
  ═══════════════════════════════════════════════════════════════
  */