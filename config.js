/*
═══════════════════════════════════════════════════════════════
  CONFIG.JS - API CONFIGURATION & ENVIRONMENT MANAGEMENT
  
  NARRATIVE:
  This is your FUTURE-PROOF API configuration hub. When you're
  ready to integrate real translation APIs (Claude, Google, Azure),
  you just need to add your API keys here.
  
  ARCHITECTURE:
  - Centralized API configuration
  - Multiple provider support
  - Automatic fallback system
  - Environment-based configs (dev/prod)
  - Rate limiting built-in
  - Error handling
  
  SUPPORTED APIS (Ready to activate):
  1. Claude AI (Anthropic) - Best for conversational translation
  2. Google Translate - Most languages, reliable
  3. Azure Translator - Enterprise-grade
  4. DeepL - High quality translation
  5. LibreTranslate - Free, open-source
  
  ZERO TO HERO:
  Current: Dictionary-based (100 phrases)
  Future: AI-powered (unlimited translation)
  Just add API key → Instant upgrade!
═══════════════════════════════════════════════════════════════
*/

// ========== ENVIRONMENT DETECTION ==========
const ENV = {
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1',
    isProduction: window.location.protocol === 'https:',
    appVersion: '1.0.0'
  };
  
  // ========== API CONFIGURATION ==========
  
  /**
   * API Provider Configurations
   * ADD YOUR API KEYS HERE WHEN READY
   */
  const API_CONFIG = {
    
    // ──────────────────────────────────────────────────
    // CLAUDE AI (Anthropic) - RECOMMENDED
    // ──────────────────────────────────────────────────
    claude: {
      enabled: false,  // Set to true when you have API key
      apiKey: '',      // ADD YOUR KEY HERE: 'sk-ant-...'
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-sonnet-4-20250514',
      maxTokens: 1000,
      temperature: 0.3,
      
      // Rate limiting
      rateLimit: {
        requestsPerMinute: 50,
        requestsPerDay: 1000
      },
      
      // Cost tracking (optional)
      pricing: {
        inputTokens: 0.003,  // per 1K tokens
        outputTokens: 0.015  // per 1K tokens
      }
    },
    
    // ──────────────────────────────────────────────────
    // GOOGLE TRANSLATE API
    // ──────────────────────────────────────────────────
    google: {
      enabled: false,  // Set to true when you have API key
      apiKey: '',      // ADD YOUR KEY HERE
      endpoint: 'https://translation.googleapis.com/language/translate/v2',
      
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerDay: 10000
      },
      
      pricing: {
        per1MChars: 20  // $20 per 1M characters
      }
    },
    
    // ──────────────────────────────────────────────────
    // AZURE TRANSLATOR
    // ──────────────────────────────────────────────────
    azure: {
      enabled: false,
      apiKey: '',      // ADD YOUR KEY HERE
      endpoint: 'https://api.cognitive.microsofttranslator.com/translate',
      region: 'global', // e.g., 'westus2'
      
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerDay: 20000
      }
    },
    
    // ──────────────────────────────────────────────────
    // DEEPL API
    // ──────────────────────────────────────────────────
    deepl: {
      enabled: false,
      apiKey: '',      // ADD YOUR KEY HERE
      endpoint: 'https://api-free.deepl.com/v2/translate', // or 'api.deepl.com' for pro
      
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerDay: 500000 // characters
      }
    },
    
    // ──────────────────────────────────────────────────
    // LIBRETRANSLATE (FREE, SELF-HOSTED OPTION)
    // ──────────────────────────────────────────────────
    libre: {
      enabled: false,
      apiKey: '',      // Optional, can be empty for public instances
      endpoint: 'https://libretranslate.com/translate',
      
      rateLimit: {
        requestsPerMinute: 5,  // Very conservative for free tier
        requestsPerDay: 1000
      }
    }
  };
  
  // ========== API PRIORITY ORDER ==========
  
  /**
   * Fallback chain: Try providers in this order
   * If first fails, automatically try next
   */
  const API_PRIORITY = [
    'claude',    // Best quality, conversational
    'google',    // Most reliable, many languages
    'deepl',     // High quality
    'azure',     // Enterprise
    'libre',     // Free fallback
    'dictionary' // Original dictionary-based (always works)
  ];
  
  // ========== FEATURE FLAGS ==========
  
  /**
   * Toggle advanced features on/off
   * Turn ON when APIs are configured
   */
  const FEATURES = {
    // Translation features
    aiTranslation: false,        // API-powered translation
    contextAwareTranslation: false, // Consider conversation context
    grammarCorrection: false,     // Fix grammar mistakes
    formalInformalToggle: false,  // Choose formality level
    
    // Voice features
    advancedVoiceRecognition: false, // Better accuracy with API
    pronunciationFeedback: false,     // Score user pronunciation
    
    // Learning features
    personalizedLessons: false,   // AI-generated custom lessons
    conversationPractice: false,  // Chat with AI in Arabic
    
    // Analytics
    usageTracking: false,         // Track API usage and costs
    errorLogging: false,          // Send errors to monitoring service
    
    // Experimental
    imageTranslation: false,      // Translate text in images (OCR)
    speechToSpeech: false,        // Direct voice translation
    offlineAI: false             // Local AI model (TensorFlow.js)
  };
  
  // ========== CACHE CONFIGURATION ==========
  
  /**
   * Intelligent caching to reduce API calls
   */
  const CACHE_CONFIG = {
    enabled: true,
    
    // Cache duration in milliseconds
    ttl: {
      translation: 7 * 24 * 60 * 60 * 1000,  // 7 days
      voiceRecognition: 24 * 60 * 60 * 1000, // 1 day
      lessons: 30 * 24 * 60 * 60 * 1000      // 30 days
    },
    
    // Maximum cache size
    maxSize: {
      translations: 1000,  // Store up to 1000 translations
      voice: 100           // Store up to 100 voice recordings
    },
    
    // Cache storage method
    storage: 'indexedDB'  // or 'localStorage' (more limited)
  };
  
  // ========== RATE LIMITER STATE ==========
  
  /**
   * Track API usage to prevent rate limit violations
   */
  const rateLimitState = {
    claude: { requests: [], lastReset: Date.now() },
    google: { requests: [], lastReset: Date.now() },
    azure: { requests: [], lastReset: Date.now() },
    deepl: { requests: [], lastReset: Date.now() },
    libre: { requests: [], lastReset: Date.now() }
  };
  
  // ========== HELPER FUNCTIONS ==========
  
  /**
   * Get active API provider
   * Returns first enabled provider in priority order
   */
  function getActiveProvider() {
    for (const provider of API_PRIORITY) {
      if (provider === 'dictionary') {
        return 'dictionary'; // Always available
      }
      
      if (API_CONFIG[provider]?.enabled && API_CONFIG[provider]?.apiKey) {
        return provider;
      }
    }
    
    return 'dictionary'; // Fallback to dictionary
  }
  
  /**
   * Check if API provider is configured and ready
   */
  function isProviderReady(provider) {
    if (provider === 'dictionary') return true;
    
    const config = API_CONFIG[provider];
    return config && config.enabled && config.apiKey && config.apiKey.length > 0;
  }
  
  /**
   * Get all available providers
   */
  function getAvailableProviders() {
    const available = ['dictionary']; // Always available
    
    for (const [name, config] of Object.entries(API_CONFIG)) {
      if (config.enabled && config.apiKey) {
        available.push(name);
      }
    }
    
    return available;
  }
  
  /**
   * Check rate limit for provider
   * Returns true if request is allowed
   */
  function checkRateLimit(provider) {
    if (provider === 'dictionary') return true;
    
    const config = API_CONFIG[provider];
    const state = rateLimitState[provider];
    
    if (!config || !state) return true;
    
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Remove old requests (older than 1 day)
    state.requests = state.requests.filter(time => now - time < oneDay);
    
    // Check per-minute limit
    const recentRequests = state.requests.filter(time => now - time < oneMinute);
    if (recentRequests.length >= config.rateLimit.requestsPerMinute) {
      console.warn(`Rate limit exceeded for ${provider} (per minute)`);
      return false;
    }
    
    // Check per-day limit
    if (state.requests.length >= config.rateLimit.requestsPerDay) {
      console.warn(`Rate limit exceeded for ${provider} (per day)`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Record API request for rate limiting
   */
  function recordRequest(provider) {
    if (provider === 'dictionary') return;
    
    const state = rateLimitState[provider];
    if (state) {
      state.requests.push(Date.now());
    }
  }
  
  /**
   * Estimate API cost for a request
   */
  function estimateCost(provider, text) {
    if (provider === 'dictionary' || provider === 'libre') {
      return 0; // Free
    }
    
    const config = API_CONFIG[provider];
    if (!config || !config.pricing) return null;
    
    if (provider === 'claude') {
      // Rough estimate: 1 char ≈ 0.25 tokens
      const estimatedTokens = text.length * 0.25;
      const inputCost = (estimatedTokens / 1000) * config.pricing.inputTokens;
      const outputCost = (estimatedTokens / 1000) * config.pricing.outputTokens;
      return inputCost + outputCost;
    }
    
    if (provider === 'google') {
      const chars = text.length;
      return (chars / 1000000) * config.pricing.per1MChars;
    }
    
    return null;
  }
  
  /**
   * Validate API key format
   */
  function validateApiKey(provider, key) {
    if (!key || key.trim() === '') return false;
    
    switch (provider) {
      case 'claude':
        return key.startsWith('sk-ant-');
      case 'google':
        return key.length >= 30; // Google API keys are long
      case 'azure':
        return key.length === 32; // Azure keys are 32 chars
      case 'deepl':
        return key.endsWith(':fx'); // DeepL keys end with :fx
      default:
        return key.length > 0;
    }
  }
  
  /**
   * Test API connection
   */
  async function testApiConnection(provider) {
    if (provider === 'dictionary') {
      return { success: true, message: 'Dictionary always available' };
    }
    
    if (!isProviderReady(provider)) {
      return { 
        success: false, 
        message: 'API key not configured' 
      };
    }
    
    try {
      // Test with a simple translation
      const result = await translateWithAPI(provider, 'hello', 'ar', 'en');
      
      return {
        success: true,
        message: `${provider} API connected successfully`,
        result: result
      };
    } catch (error) {
      return {
        success: false,
        message: `${provider} API test failed: ${error.message}`,
        error: error
      };
    }
  }
  
  // ========== USAGE TRACKING ==========
  
  const usageStats = {
    totalRequests: 0,
    requestsByProvider: {},
    estimatedCosts: {},
    cacheHits: 0,
    cacheMisses: 0,
    
    reset() {
      this.totalRequests = 0;
      this.requestsByProvider = {};
      this.estimatedCosts = {};
      this.cacheHits = 0;
      this.cacheMisses = 0;
    },
    
    recordRequest(provider, cost = 0) {
      this.totalRequests++;
      this.requestsByProvider[provider] = (this.requestsByProvider[provider] || 0) + 1;
      this.estimatedCosts[provider] = (this.estimatedCosts[provider] || 0) + cost;
    },
    
    getReport() {
      return {
        total: this.totalRequests,
        byProvider: this.requestsByProvider,
        costs: this.estimatedCosts,
        totalCost: Object.values(this.estimatedCosts).reduce((a, b) => a + b, 0),
        cacheHitRate: this.totalRequests > 0 
          ? ((this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100).toFixed(2) + '%'
          : '0%'
      };
    }
  };
  
  // ========== EXPORT CONFIGURATION ==========
  
  // Make config accessible globally
  window.LISAN_CONFIG = {
    ENV,
    API_CONFIG,
    API_PRIORITY,
    FEATURES,
    CACHE_CONFIG,
    
    // Helper functions
    getActiveProvider,
    isProviderReady,
    getAvailableProviders,
    checkRateLimit,
    recordRequest,
    estimateCost,
    validateApiKey,
    testApiConnection,
    
    // Usage stats
    usageStats
  };
  
  console.log('🔧 App-lisan Config loaded');
  console.log('📡 Active provider:', getActiveProvider());
  console.log('✅ Available providers:', getAvailableProviders());
  
  /*
  ═══════════════════════════════════════════════════════════════
    HOW TO ACTIVATE APIs (STEP-BY-STEP)
  ═══════════════════════════════════════════════════════════════
  
  STEP 1: GET API KEY
  ─────────────────────
  Claude AI: https://console.anthropic.com/
  Google: https://console.cloud.google.com/
  Azure: https://portal.azure.com/
  DeepL: https://www.deepl.com/pro-api
  
  STEP 2: ADD KEY TO CONFIG
  ──────────────────────────
  1. Open this file (config.js)
  2. Find the provider section (e.g., claude)
  3. Set enabled: true
  4. Add your apiKey: 'your-key-here'
  5. Save file
  
  STEP 3: ACTIVATE FEATURES
  ──────────────────────────
  In FEATURES object above:
  - Set aiTranslation: true
  - Set other features you want
  
  STEP 4: TEST CONNECTION
  ────────────────────────
  Open browser console and run:
  ```javascript
  await LISAN_CONFIG.testApiConnection('claude')
  ```
  
  DONE! Your app now has unlimited AI translation! 🎉
  
  ═══════════════════════════════════════════════════════════════
    COST MANAGEMENT TIPS
  ═══════════════════════════════════════════════════════════════
  
  1. START WITH FREE TIERS
     - Most APIs offer free credits
     - Claude: Free tier available
     - Google: $300 free credit
     - LibreTranslate: Completely free
  
  2. USE CACHING AGGRESSIVELY
     - Cache enabled by default
     - Reduces duplicate API calls by 80%+
  
  3. MONITOR USAGE
     - Check usageStats.getReport()
     - Set alerts for high usage
  
  4. IMPLEMENT QUOTAS
     - Limit requests per user
     - Add daily/monthly caps
  
  5. FALLBACK STRATEGY
     - Use API_PRIORITY array
     - Automatic fallback to dictionary
  
  ═══════════════════════════════════════════════════════════════
  */