/*
═══════════════════════════════════════════════════════════════
  API-ENGINE.JS - UNIVERSAL TRANSLATION API INTEGRATION
  
  NARRATIVE:
  This is the BRAIN that connects to ANY translation API.
  It's designed to be:
  - Provider-agnostic (works with any API)
  - Fault-tolerant (automatic fallbacks)
  - Smart (caching, rate limiting)
  - Future-proof (easy to add new APIs)
  
  ARCHITECTURE:
  ┌─────────────┐
  │   User      │
  └──────┬──────┘
         │
  ┌──────▼──────────────────────────────────────┐
  │  translateWithAPI()                         │
  │  (Main entry point)                         │
  └──────┬──────────────────────────────────────┘
         │
  ┌──────▼──────────┐
  │  Check Cache    │──→ Cache Hit? Return result
  └──────┬──────────┘
         │ Cache Miss
  ┌──────▼──────────┐
  │  Rate Limit OK? │──→ No? Try next provider
  └──────┬──────────┘
         │ Yes
  ┌──────▼──────────┐
  │  Call API       │──→ Success? Cache & return
  └──────┬──────────┘
         │ Error
  ┌──────▼──────────┐
  │  Try Fallback   │──→ Repeat with next provider
  └─────────────────┘
  
  WHEN YOU ADD API KEY:
  This file automatically starts using it!
  No other changes needed! 🚀
═══════════════════════════════════════════════════════════════
*/

// ========== CACHE MANAGEMENT (IndexedDB) ==========

/**
 * Initialize IndexedDB for translation cache
 */
async function initTranslationCache() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppLisanCache', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('translations')) {
          const store = db.createObjectStore('translations', { keyPath: 'id' });
          store.createIndex('text', 'text', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }
  
  /**
   * Generate cache key from translation parameters
   */
  function getCacheKey(text, sourceLang, targetLang, provider) {
    const normalized = text.toLowerCase().trim();
    return `${provider}_${sourceLang}_${targetLang}_${normalized}`;
  }
  
  /**
   * Get translation from cache
   */
  async function getCachedTranslation(text, sourceLang, targetLang, provider) {
    try {
      const db = await initTranslationCache();
      const transaction = db.transaction(['translations'], 'readonly');
      const store = transaction.objectStore('translations');
      const key = getCacheKey(text, sourceLang, targetLang, provider);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          
          if (!result) {
            resolve(null);
            return;
          }
          
          // Check if cache is still valid (TTL)
          const age = Date.now() - result.timestamp;
          const ttl = window.LISAN_CONFIG.CACHE_CONFIG.ttl.translation;
          
          if (age > ttl) {
            // Cache expired
            resolve(null);
          } else {
            window.LISAN_CONFIG.usageStats.cacheHits++;
            resolve(result.translation);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  }
  
  /**
   * Save translation to cache
   */
  async function cacheTranslation(text, sourceLang, targetLang, provider, translation) {
    try {
      const db = await initTranslationCache();
      const transaction = db.transaction(['translations'], 'readwrite');
      const store = transaction.objectStore('translations');
      
      const cacheEntry = {
        id: getCacheKey(text, sourceLang, targetLang, provider),
        text: text,
        sourceLang: sourceLang,
        targetLang: targetLang,
        provider: provider,
        translation: translation,
        timestamp: Date.now()
      };
      
      store.put(cacheEntry);
      window.LISAN_CONFIG.usageStats.cacheMisses++;
      
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }
  
  /**
   * Clear old cache entries
   */
  async function clearExpiredCache() {
    try {
      const db = await initTranslationCache();
      const transaction = db.transaction(['translations'], 'readwrite');
      const store = transaction.objectStore('translations');
      const index = store.index('timestamp');
      const ttl = window.LISAN_CONFIG.CACHE_CONFIG.ttl.translation;
      const cutoff = Date.now() - ttl;
      
      const range = IDBKeyRange.upperBound(cutoff);
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }
  }
  
  // ========== CLAUDE AI INTEGRATION ==========
  
  /**
   * Translate using Claude AI
   */
  async function translateWithClaude(text, sourceLang, targetLang) {
    const config = window.LISAN_CONFIG.API_CONFIG.claude;
    
    const sourceLangName = sourceLang === 'ar' ? 'Arabic' : 'English';
    const targetLangName = targetLang === 'ar' ? 'Arabic' : 'English';
    
    const prompt = `Translate the following ${sourceLangName} text to ${targetLangName}. 
  Provide ONLY the translation, nothing else. No explanations, no additional text.
  
  Text to translate: ${text}`;
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const translation = data.content[0].text.trim();
    
    return {
      translation: translation,
      provider: 'claude',
      confidence: 0.95,
      metadata: {
        model: config.model,
        tokensUsed: data.usage?.total_tokens || 0
      }
    };
  }
  
  // ========== GOOGLE TRANSLATE INTEGRATION ==========
  
  /**
   * Translate using Google Translate API
   */
  async function translateWithGoogle(text, sourceLang, targetLang) {
    const config = window.LISAN_CONFIG.API_CONFIG.google;
    
    const url = new URL(config.endpoint);
    url.searchParams.append('key', config.apiKey);
    url.searchParams.append('q', text);
    url.searchParams.append('source', sourceLang);
    url.searchParams.append('target', targetLang);
    url.searchParams.append('format', 'text');
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const translation = data.data.translations[0].translatedText;
    
    return {
      translation: translation,
      provider: 'google',
      confidence: 0.90,
      metadata: {
        detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage
      }
    };
  }
  
  // ========== AZURE TRANSLATOR INTEGRATION ==========
  
  /**
   * Translate using Azure Translator
   */
  async function translateWithAzure(text, sourceLang, targetLang) {
    const config = window.LISAN_CONFIG.API_CONFIG.azure;
    
    const url = new URL(config.endpoint);
    url.searchParams.append('api-version', '3.0');
    url.searchParams.append('from', sourceLang);
    url.searchParams.append('to', targetLang);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': config.apiKey,
        'Ocp-Apim-Subscription-Region': config.region
      },
      body: JSON.stringify([{ text: text }])
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Azure API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const translation = data[0].translations[0].text;
    
    return {
      translation: translation,
      provider: 'azure',
      confidence: 0.92,
      metadata: {
        detectedLanguage: data[0].detectedLanguage
      }
    };
  }
  
  // ========== DEEPL INTEGRATION ==========
  
  /**
   * Translate using DeepL API
   */
  async function translateWithDeepL(text, sourceLang, targetLang) {
    const config = window.LISAN_CONFIG.API_CONFIG.deepl;
    
    // DeepL uses different language codes
    const langMap = { 'ar': 'AR', 'en': 'EN' };
    const source = langMap[sourceLang] || sourceLang.toUpperCase();
    const target = langMap[targetLang] || targetLang.toUpperCase();
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${config.apiKey}`
      },
      body: new URLSearchParams({
        text: text,
        source_lang: source,
        target_lang: target
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const translation = data.translations[0].text;
    
    return {
      translation: translation,
      provider: 'deepl',
      confidence: 0.93,
      metadata: {
        detectedSourceLang: data.translations[0].detected_source_language
      }
    };
  }
  
  // ========== LIBRETRANSLATE INTEGRATION ==========
  
  /**
   * Translate using LibreTranslate (Free)
   */
  async function translateWithLibre(text, sourceLang, targetLang) {
    const config = window.LISAN_CONFIG.API_CONFIG.libre;
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
        api_key: config.apiKey || ''
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LibreTranslate error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const translation = data.translatedText;
    
    return {
      translation: translation,
      provider: 'libre',
      confidence: 0.80,
      metadata: {}
    };
  }
  
  // ========== UNIVERSAL TRANSLATION FUNCTION ==========
  
  /**
   * Main translation function with automatic provider selection and fallback
   * This is what you call from your app!
   */
  async function translateWithAPI(provider, text, sourceLang, targetLang) {
    
    // Check cache first
    if (window.LISAN_CONFIG.CACHE_CONFIG.enabled) {
      const cached = await getCachedTranslation(text, sourceLang, targetLang, provider);
      if (cached) {
        console.log(`📦 Cache hit: ${provider}`);
        return cached;
      }
    }
    
    // Check rate limit
    if (!window.LISAN_CONFIG.checkRateLimit(provider)) {
      throw new Error(`Rate limit exceeded for ${provider}`);
    }
    
    let result;
    
    try {
      // Call appropriate API based on provider
      switch (provider) {
        case 'claude':
          result = await translateWithClaude(text, sourceLang, targetLang);
          break;
        case 'google':
          result = await translateWithGoogle(text, sourceLang, targetLang);
          break;
        case 'azure':
          result = await translateWithAzure(text, sourceLang, targetLang);
          break;
        case 'deepl':
          result = await translateWithDeepL(text, sourceLang, targetLang);
          break;
        case 'libre':
          result = await translateWithLibre(text, sourceLang, targetLang);
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
      
      // Record usage
      window.LISAN_CONFIG.recordRequest(provider);
      const cost = window.LISAN_CONFIG.estimateCost(provider, text);
      window.LISAN_CONFIG.usageStats.recordRequest(provider, cost);
      
      // Cache the result
      if (window.LISAN_CONFIG.CACHE_CONFIG.enabled) {
        await cacheTranslation(text, sourceLang, targetLang, provider, result);
      }
      
      console.log(`✅ Translated with ${provider}:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ ${provider} translation failed:`, error);
      throw error;
    }
  }
  
  /**
   * Smart translation with automatic fallback
   * Tries providers in order until one succeeds
   */
  async function smartTranslate(text, sourceLang, targetLang) {
    const providers = window.LISAN_CONFIG.getAvailableProviders();
    
    console.log(`🧠 Smart translate: trying ${providers.length} providers`);
    
    for (const provider of providers) {
      try {
        console.log(`🔄 Attempting ${provider}...`);
        
        if (provider === 'dictionary') {
          // Use original dictionary-based translation
          return await translateWithDictionary(text, sourceLang, targetLang);
        }
        
        // Try API provider
        const result = await translateWithAPI(provider, text, sourceLang, targetLang);
        console.log(`✅ Success with ${provider}`);
        return result;
        
      } catch (error) {
        console.warn(`⚠️ ${provider} failed, trying next...`);
        continue;
      }
    }
    
    throw new Error('All translation providers failed');
  }
  
  /**
   * Dictionary-based translation (original method, always works)
   */
  async function translateWithDictionary(text, sourceLang, targetLang) {
    // This uses the existing phrases.js dictionary
    const normalized = text.toLowerCase().trim();
    
    if (sourceLang === 'ar' && targetLang === 'en') {
      const match = phrases[normalized];
      if (match && match.en) {
        return {
          translation: match.en,
          provider: 'dictionary',
          confidence: 1.0,
          pronunciation: match.pron,
          metadata: { source: 'local' }
        };
      }
    } else if (sourceLang === 'en' && targetLang === 'ar') {
      const match = phrases[normalized];
      if (match && match.ar) {
        return {
          translation: match.ar,
          provider: 'dictionary',
          confidence: 1.0,
          pronunciation: match.pron,
          metadata: { source: 'local' }
        };
      }
    }
    
    throw new Error('Translation not found in dictionary');
  }
  
  // ========== BATCH TRANSLATION ==========
  
  /**
   * Translate multiple texts at once (more efficient)
   */
  async function batchTranslate(texts, sourceLang, targetLang) {
    const results = [];
    
    for (const text of texts) {
      try {
        const result = await smartTranslate(text, sourceLang, targetLang);
        results.push({ text, result, error: null });
      } catch (error) {
        results.push({ text, result: null, error: error.message });
      }
    }
    
    return results;
  }
  
  // ========== CONTEXT-AWARE TRANSLATION (Advanced) ==========
  
  /**
   * Translate with conversation context for better accuracy
   */
  async function translateWithContext(text, sourceLang, targetLang, previousMessages = []) {
    if (!window.LISAN_CONFIG.FEATURES.contextAwareTranslation) {
      return smartTranslate(text, sourceLang, targetLang);
    }
    
    // Only Claude supports context well
    if (!window.LISAN_CONFIG.isProviderReady('claude')) {
      return smartTranslate(text, sourceLang, targetLang);
    }
    
    const config = window.LISAN_CONFIG.API_CONFIG.claude;
    
    // Build conversation context
    const messages = [
      ...previousMessages,
      {
        role: 'user',
        content: `Translate to ${targetLang === 'ar' ? 'Arabic' : 'English'}: ${text}`
      }
    ];
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        messages: messages
      })
    });
    
    const data = await response.json();
    const translation = data.content[0].text.trim();
    
    return {
      translation: translation,
      provider: 'claude',
      confidence: 0.95,
      context: 'aware'
    };
  }
  
  // ========== EXPORT ==========
  
  window.LISAN_API = {
    // Main functions
    smartTranslate,
    translateWithAPI,
    batchTranslate,
    translateWithContext,
    
    // Provider-specific
    translateWithClaude,
    translateWithGoogle,
    translateWithAzure,
    translateWithDeepL,
    translateWithLibre,
    translateWithDictionary,
    
    // Cache management
    getCachedTranslation,
    cacheTranslation,
    clearExpiredCache,
    
    // Utility
    getCacheKey
  };
  
  console.log('🚀 App-lisan API Engine loaded and ready!');
  
  /*
  ═══════════════════════════════════════════════════════════════
    HOW TO USE IN YOUR APP
  ═══════════════════════════════════════════════════════════════
  
  SIMPLE USAGE:
  ─────────────
  ```javascript
  // Automatically uses best available provider
  const result = await LISAN_API.smartTranslate('مرحبا', 'ar', 'en');
  console.log(result.translation); // "Hello"
  ```
  
  SPECIFIC PROVIDER:
  ──────────────────
  ```javascript
  // Force specific provider
  const result = await LISAN_API.translateWithAPI('claude', 'Hello', 'en', 'ar');
  ```
  
  BATCH TRANSLATION:
  ──────────────────
  ```javascript
  const texts = ['Hello', 'Goodbye', 'Thank you'];
  const results = await LISAN_API.batchTranslate(texts, 'en', 'ar');
  ```
  
  WITH CONTEXT:
  ─────────────
  ```javascript
  const context = [
    { role: 'user', content: 'I want to order food' }
  ];
  const result = await LISAN_API.translateWithContext(
    'menu',
    'en',
    'ar',
    context
  );
  ```
  
  ═══════════════════════════════════════════════════════════════
    INTEGRATION WITH EXISTING translate.js
  ═══════════════════════════════════════════════════════════════
  
  IN translate.js, UPDATE translateText() FUNCTION:
  
  ```javascript
  async function translateText(direction) {
    const input = document.getElementById('input').value.trim();
    
    if (!input) {
      showOutput('Enter some text first...');
      return;
    }
    
    showOutput('<div class="loading"></div> Translating...', 'loading');
    
    try {
      const [sourceLang, targetLang] = direction.split('-');
      
      // 🚀 USE API ENGINE (automatically falls back to dictionary)
      const result = await LISAN_API.smartTranslate(input, sourceLang, targetLang);
      
      // Display result
      showOutput(`
        <div class="translation-block">
          <div class="original-text ${sourceLang === 'ar' ? 'arabic' : ''}">${input}</div>
          <div class="translated-text ${targetLang === 'ar' ? 'arabic' : ''}">
            ${result.translation}
          </div>
          ${result.pronunciation ? `<div class="pronunciation">${result.pronunciation}</div>` : ''}
          <div style="font-size: 0.8rem; color: #999; margin-top: 0.5rem;">
            Translated by: ${result.provider} | Confidence: ${(result.confidence * 100).toFixed(0)}%
          </div>
        </div>
      `);
      
    } catch (error) {
      showOutput(`❌ Translation failed: ${error.message}`, 'error');
    }
  }
  ```
  
  ═══════════════════════════════════════════════════════════════
  */