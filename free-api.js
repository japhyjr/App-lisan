/*
═══════════════════════════════════════════════════════════════
  FREE-API.JS - MyMemory Translation API Integration
  
  FEATURES:
  - Free MyMemory API (50,000 words/day)
  - No API key required
  - Automatic fallback to dictionary
  - Error handling
  - Quality checking
═══════════════════════════════════════════════════════════════
*/

// ========== API CONFIGURATION ==========

const FREE_API_CONFIG = {
    myMemory: {
      endpoint: 'https://api.mymemory.translated.net/get',
      email: 'your-email@app-lisan.com', // Change this to your email for 50k/day
      dailyWordLimit: 50000,
      enabled: true
    }
  };
  
  // ========== MAIN TRANSLATION FUNCTION ==========
  
  /**
   * Translate using MyMemory free API
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language code ('ar' or 'en')
   * @param {string} targetLang - Target language code ('ar' or 'en')
   * @returns {Promise<Object>} Translation result
   */
  async function translateWithMyMemory(text, sourceLang, targetLang) {
    if (!FREE_API_CONFIG.myMemory.enabled) {
      return null;
    }
    
    // Build API URL
    const url = new URL(FREE_API_CONFIG.myMemory.endpoint);
    url.searchParams.append('q', text);
    url.searchParams.append('langpair', `${sourceLang}|${targetLang}`);
    
    // Add email to get 50k words/day instead of 5k
    if (FREE_API_CONFIG.myMemory.email) {
      url.searchParams.append('de', FREE_API_CONFIG.myMemory.email);
    }
    
    try {
      console.log('🌐 Calling MyMemory API...');
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check response status
      if (data.responseStatus !== 200) {
        throw new Error(data.responseDetails || 'Translation failed');
      }
      
      // Extract translation data
      const translation = data.responseData.translatedText;
      const match = data.responseData.match; // Confidence score (0-1)
      
      console.log(`✅ MyMemory translation successful (match: ${match})`);
      
      return {
        success: true,
        translation: translation,
        confidence: parseFloat(match),
        provider: 'MyMemory',
        source: 'free-api'
      };
      
    } catch (error) {
      console.error('❌ MyMemory API error:', error.message);
      
      return {
        success: false,
        error: error.message,
        provider: 'MyMemory'
      };
    }
  }
  
  // ========== SMART TRANSLATION WITH FALLBACK ==========
  
  /**
   * Try free API first, fallback to dictionary
   * This is the function your app should call
   */
  async function smartFreeTranslate(text, sourceLang, targetLang) {
    // First, check user's daily limit
    const userId = getUserId();
    const limitCheck = checkTranslationLimit(userId);
    
    if (!limitCheck.allowed) {
      return {
        success: false,
        limitReached: true,
        remaining: 0,
        resetTime: limitCheck.resetTime,
        message: 'Daily free translation limit reached. Upgrade to premium for unlimited!'
      };
    }
    
    // Try MyMemory API
    const apiResult = await translateWithMyMemory(text, sourceLang, targetLang);
    
    if (apiResult && apiResult.success) {
      // Success! Increment user count
      incrementTranslationCount(userId);
      
      return {
        success: true,
        translation: apiResult.translation,
        confidence: apiResult.confidence,
        provider: 'MyMemory Free',
        remaining: limitCheck.remaining - 1,
        usedFreeAPI: true
      };
    }
    
    // API failed, try dictionary fallback
    console.log('⚠️ API failed, falling back to dictionary...');
    
    const dictionaryResult = translateWithDictionary(text, sourceLang, targetLang);
    
    if (dictionaryResult) {
      // Don't count dictionary translations against limit
      return {
        success: true,
        translation: dictionaryResult.translation,
        pronunciation: dictionaryResult.pronunciation,
        provider: 'Dictionary',
        remaining: limitCheck.remaining,
        usedFreeAPI: false
      };
    }
    
    // Both failed
    return {
      success: false,
      error: 'Translation not found',
      remaining: limitCheck.remaining
    };
  }
  
  // ========== DICTIONARY FALLBACK ==========
  
  /**
   * Fallback to local dictionary
   * (Uses existing phrases.js data)
   */
  function translateWithDictionary(text, sourceLang, targetLang) {
    const normalized = text.toLowerCase().trim();
    
    // Check if phrases object exists (from phrases.js)
    if (typeof phrases === 'undefined') {
      console.error('Phrases dictionary not loaded');
      return null;
    }
    
    if (sourceLang === 'ar' && targetLang === 'en') {
      const match = phrases[normalized];
      if (match && match.en) {
        return {
          translation: match.en,
          pronunciation: match.pron,
          confidence: 1.0
        };
      }
    } else if (sourceLang === 'en' && targetLang === 'ar') {
      const match = phrases[normalized];
      if (match && match.ar) {
        return {
          translation: match.ar,
          pronunciation: match.pron,
          confidence: 1.0
        };
      }
    }
    
    return null;
  }
  
  // ========== HELPER FUNCTIONS ==========
  
  /**
   * Get or create unique user ID
   */
  function getUserId() {
    let userId = localStorage.getItem('lisanUserId');
    
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('lisanUserId', userId);
    }
    
    return userId;
  }
  
  // ========== EXPORT ==========
  
  // Make functions available globally
  window.FREE_API = {
    translateWithMyMemory,
    smartFreeTranslate,
    translateWithDictionary
  };
  
  console.log('✅ Free API module loaded');
  
  /*
  ═══════════════════════════════════════════════════════════════
    USAGE EXAMPLE
  ═══════════════════════════════════════════════════════════════
  
  // In your translate.js, replace translateText() function with:
  
  async function translateText(direction) {
    const input = document.getElementById('input').value.trim();
    
    if (!input) {
      showOutput('Please enter some text...');
      return;
    }
    
    showOutput('<div class="loading"></div> Translating...', 'loading');
    
    const [sourceLang, targetLang] = direction.split('-');
    
    try {
      // Use smart free translate
      const result = await window.FREE_API.smartFreeTranslate(
        input, 
        sourceLang, 
        targetLang
      );
      
      if (result.limitReached) {
        showUpgradePrompt(result.message, result.resetTime);
        return;
      }
      
      if (result.success) {
        displayTranslation(result);
        updateUsageIndicator(result.remaining);
      } else {
        showError('Translation not available for this phrase.');
      }
      
    } catch (error) {
      console.error('Translation error:', error);
      showError('An error occurred. Please try again.');
    }
  }
  
  ═══════════════════════════════════════════════════════════════
  */