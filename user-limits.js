/*
═══════════════════════════════════════════════════════════════
  USER-LIMITS.JS - Free Tier Usage Tracking
  
  FEATURES:
  - Track translations per user
  - Daily limits (5 free translations)
  - Automatic reset at midnight
  - Upgrade prompts
  - Usage indicators
═══════════════════════════════════════════════════════════════
*/

// ========== CONFIGURATION ==========

const LIMITS_CONFIG = {
    free: {
      dailyTranslations: 5,
      resetHour: 0 // Midnight local time
    },
    premium: {
      dailyTranslations: Infinity // Unlimited
    }
  };
  
  // ========== LIMIT CHECKING ==========
  
  /**
   * Check if user can make more translations today
   * @param {string} userId - User identifier
   * @returns {Object} Limit status
   */
  function checkTranslationLimit(userId) {
    const count = getUserTranslationCount(userId);
    const tier = getUserTier(userId);
    const limit = LIMITS_CONFIG[tier].dailyTranslations;
    
    if (count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        limit: limit,
        resetTime: getNextMidnight(),
        tier: tier
      };
    }
    
    return {
      allowed: true,
      remaining: limit - count,
      limit: limit,
      resetTime: getNextMidnight(),
      tier: tier
    };
  }
  
  /**
   * Get user's current translation count for today
   */
  function getUserTranslationCount(userId) {
    const key = `trans_count_${userId}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      return 0;
    }
    
    try {
      const parsed = JSON.parse(data);
      const today = new Date().toDateString();
      
      // Check if data is from today
      if (parsed.date !== today) {
        // New day - reset count
        resetUserTranslationCount(userId);
        return 0;
      }
      
      return parsed.count || 0;
      
    } catch (error) {
      console.error('Error reading translation count:', error);
      return 0;
    }
  }
  
  /**
   * Increment user's translation count
   */
  function incrementTranslationCount(userId) {
    const count = getUserTranslationCount(userId);
    const today = new Date().toDateString();
    
    const data = {
      date: today,
      count: count + 1,
      lastTranslation: new Date().toISOString()
    };
    
    localStorage.setItem(`trans_count_${userId}`, JSON.stringify(data));
    
    console.log(`📊 User ${userId.substr(0, 8)}... translation count: ${data.count}`);
    
    return data.count;
  }
  
  /**
   * Reset user's translation count
   */
  function resetUserTranslationCount(userId) {
    const today = new Date().toDateString();
    
    const data = {
      date: today,
      count: 0,
      lastReset: new Date().toISOString()
    };
    
    localStorage.setItem(`trans_count_${userId}`, JSON.stringify(data));
  }
  
  /**
   * Get user's tier (free or premium)
   */
  function getUserTier(userId) {
    const tier = localStorage.getItem(`user_tier_${userId}`);
    return tier || 'free';
  }
  
  /**
   * Upgrade user to premium
   */
  function upgradeUserToPremium(userId) {
    localStorage.setItem(`user_tier_${userId}`, 'premium');
    localStorage.setItem(`premium_since_${userId}`, new Date().toISOString());
    
    console.log(`✨ User ${userId.substr(0, 8)}... upgraded to premium!`);
  }
  
  // ========== TIME UTILITIES ==========
  
  /**
   * Get next midnight (when limit resets)
   */
  function getNextMidnight() {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow;
  }
  
  /**
   * Get time until reset in human-readable format
   */
  function getTimeUntilReset() {
    const now = new Date();
    const midnight = getNextMidnight();
    const diff = midnight - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
  
  // ========== UI FUNCTIONS ==========
  
  /**
   * Show upgrade prompt when limit reached
   */
  function showUpgradePrompt(message, resetTime) {
    const timeUntil = getTimeUntilReset();
    
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal-overlay';
    modal.innerHTML = `
      <div class="upgrade-modal">
        <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
        
        <div class="modal-icon">🔒</div>
        
        <h2>Daily Limit Reached</h2>
        <p style="font-size: 1.1rem; margin: 1rem 0;">${message || 'You\'ve used your 5 free translations today!'}</p>
        
        <div class="limit-options">
          <div class="option premium">
            <h3>🌟 Go Premium</h3>
            <div class="price">$5<span>/month</span></div>
            <ul>
              <li>✅ Unlimited translations</li>
              <li>✅ No ads</li>
              <li>✅ Priority support</li>
              <li>✅ Advanced features</li>
            </ul>
            <a href="premium.html" class="btn btn-primary">Upgrade Now</a>
          </div>
          
          <div class="option free">
            <h3>🕐 Wait & Continue Free</h3>
            <p>Get 5 more free translations in:</p>
            <div class="countdown">${timeUntil}</div>
            <p style="font-size: 0.9rem; margin-top: 1rem;">
              You can still use our dictionary<br>with 100+ common phrases!
            </p>
            <button class="btn btn-secondary" onclick="this.closest('.upgrade-modal-overlay').remove()">
              Use Dictionary
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Track upgrade prompt shown
    trackEvent('upgrade_prompt_shown', {
      reason: 'daily_limit',
      timeUntilReset: timeUntil
    });
  }
  
  /**
   * Update usage indicator in UI
   */
  function updateUsageIndicator(remaining) {
    let indicator = document.getElementById('usage-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'usage-indicator';
      indicator.className = 'usage-indicator';
      document.getElementById('output').appendChild(indicator);
    }
    
    // Style based on remaining count
    if (remaining === 0) {
      indicator.className = 'usage-indicator limit-reached';
      indicator.innerHTML = `
        🔒 <strong>Last free translation used!</strong>
        <a href="premium.html" style="color: #667eea; font-weight: 600;">Upgrade for unlimited</a>
      `;
    } else if (remaining <= 2) {
      indicator.className = 'usage-indicator warning';
      indicator.innerHTML = `
        ⚠️ <strong>${remaining} free translations left today</strong>
        <a href="premium.html" style="color: #667eea;">Go unlimited →</a>
      `;
    } else {
      indicator.className = 'usage-indicator info';
      indicator.innerHTML = `
        ✅ ${remaining} free translations remaining today
      `;
    }
    
    indicator.style.display = 'block';
  }
  
  // ========== ANALYTICS ==========
  
  /**
   * Track events for analytics
   */
  function trackEvent(eventName, properties) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // Console log for debugging
    console.log(`📊 Event: ${eventName}`, properties);
  }
  
  // ========== EXPORT ==========
  
  window.USER_LIMITS = {
    checkTranslationLimit,
    incrementTranslationCount,
    getUserTranslationCount,
    resetUserTranslationCount,
    getUserTier,
    upgradeUserToPremium,
    showUpgradePrompt,
    updateUsageIndicator,
    getTimeUntilReset
  };
  
  console.log('✅ User limits module loaded');
  
  /*
  ═══════════════════════════════════════════════════════════════
    CSS STYLES TO ADD TO style.css
  ═══════════════════════════════════════════════════════════════
  
  .usage-indicator {
    text-align: center;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-size: 0.95rem;
    display: none;
  }
  
  .usage-indicator.info {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .usage-indicator.warning {
    background: #fff3cd;
    color: #856404;
    border: 2px solid #ffc107;
  }
  
  .usage-indicator.limit-reached {
    background: #ffebee;
    color: #c62828;
    border: 2px solid #f44336;
    font-weight: 600;
  }
  
  .upgrade-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  }
  
  .upgrade-modal {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }
  
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #999;
  }
  
  .modal-icon {
    font-size: 4rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .upgrade-modal h2 {
    text-align: center;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .limit-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .option {
    padding: 1.5rem;
    border-radius: 15px;
    border: 2px solid #ddd;
    text-align: center;
  }
  
  .option.premium {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  }
  
  .option h3 {
    color: #667eea;
    margin-bottom: 1rem;
  }
  
  .price {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
    margin: 1rem 0;
  }
  
  .price span {
    font-size: 1rem;
    color: #666;
  }
  
  .option ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    text-align: left;
  }
  
  .option ul li {
    padding: 0.5rem 0;
    color: #666;
  }
  
  .countdown {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    margin: 1rem 0;
  }
  
  ═══════════════════════════════════════════════════════════════

  */
