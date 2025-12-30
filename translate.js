/*
═══════════════════════════════════════════════════════════════
  TRANSLATE.JS - TRANSLATION ENGINE WITH FREE API + AUDIO
  
  NOW INCLUDES:
  ✅ MyMemory Free API (5 translations/day per user)
  ✅ Dictionary fallback (unlimited)
  ✅ User limits tracking
  ✅ Upgrade prompts when limit reached
  ✅ AUDIO: Listen to Translation button
  ✅ Auto language detection for proper pronunciation
═══════════════════════════════════════════════════════════════
*/

// ========== MAIN TRANSLATION FUNCTION ==========

/**
 * Main translation function - NOW WITH FREE API!
 * @param {string} direction - 'ar-en' or 'en-ar'
 */
async function translateText(direction) {
  const input = document.getElementById('input').value.trim();
  const output = document.getElementById('output');
  
  // Validate input
  if (!input) {
    showOutput('<span style="color: #999;">Enter some text first...</span>');
    return;
  }
  
  // Show loading state
  showOutput('<div class="loading"></div> Translating...', 'loading');
  
  // Parse direction
  const [sourceLang, targetLang] = direction.split('-');
  
  try {
    // STEP 1: Try dictionary first (instant & unlimited)
    const dictionaryResult = translateWithDictionary(input, sourceLang, targetLang);
    
    if (dictionaryResult) {
      // Dictionary match found - use it!
      console.log('✅ Dictionary translation used');
      displayTranslation(dictionaryResult, sourceLang, targetLang, input);
      return;
    }
    
    // STEP 2: Dictionary didn't have it, try FREE API
    console.log('📖 Not in dictionary, trying MyMemory API...');
    
    // Check if FREE_API is available
    if (!window.FREE_API || !window.FREE_API.smartFreeTranslate) {
      console.warn('⚠️ Free API not loaded, showing dictionary-only message');
      showDictionaryOnlyMessage(sourceLang);
      return;
    }
    
    // Try MyMemory Free API with limits
    const apiResult = await window.FREE_API.smartFreeTranslate(
      input,
      sourceLang,
      targetLang
    );
    
    // Handle API result
    if (apiResult.limitReached) {
      // User hit their daily limit
      showLimitReached(apiResult);
      return;
    }
    
    if (apiResult.success) {
      // API translation successful!
      console.log('✅ MyMemory API translation:', apiResult);
      displayTranslation(apiResult, sourceLang, targetLang, input);
      
      // Update usage indicator
      if (apiResult.usedFreeAPI) {
        updateUsageDisplay(apiResult.remaining);
      }
      return;
    }
    
    // API failed, show helpful message
    showTranslationUnavailable(sourceLang);
    
  } catch (error) {
    console.error('❌ Translation error:', error);
    showOutput(`
      <div class="warning">
        ⚠️ <strong>Translation failed.</strong><br><br>
        Please try again or contact support.
      </div>
    `);
  }
}

// ========== DICTIONARY TRANSLATION ==========

/**
 * Try to translate using local dictionary
 * @returns {Object|null} Translation result or null
 */
function translateWithDictionary(text, sourceLang, targetLang) {
  const normalized = text.toLowerCase().trim();
  
  if (sourceLang === 'ar' && targetLang === 'en') {
    const match = phrases[normalized];
    if (match && match.en) {
      return {
        translation: match.en,
        provider: 'Dictionary',
        confidence: 1.0,
        pronunciation: match.pron,
        usedFreeAPI: false
      };
    }
  } else if (sourceLang === 'en' && targetLang === 'ar') {
    const match = phrases[normalized];
    if (match && match.ar) {
      return {
        translation: match.ar,
        provider: 'Dictionary',
        confidence: 1.0,
        pronunciation: match.pron,
        usedFreeAPI: false
      };
    }
  }
  
  return null;
}

// ========== DISPLAY FUNCTIONS ==========

/**
 * Display translation result WITH AUDIO BUTTON
 * ✅ UPDATED: Now includes "Listen to Translation" button
 */
function displayTranslation(result, sourceLang, targetLang, originalText) {
  const isSourceArabic = sourceLang === 'ar';
  const isTargetArabic = targetLang === 'ar';
  
  // Determine which text to speak and in what language
  const textToSpeak = result.translation;
  const speakLang = isTargetArabic ? 'ar-SA' : 'en-US';
  
  let providerBadge = '';
  if (result.provider === 'MyMemory Free' || result.usedFreeAPI) {
    providerBadge = `
      <div style="font-size: 0.85rem; color: #667eea; margin-top: 0.75rem; padding: 0.5rem; background: #f8f9ff; border-radius: 8px; border-left: 3px solid #667eea;">
        <strong>🌐 AI-Powered Translation</strong><br>
        Provider: MyMemory API (Free Tier)<br>
        ${result.remaining !== undefined ? `Remaining today: <strong>${result.remaining}/5</strong>` : ''}
      </div>
    `;
  } else {
    providerBadge = `
      <div style="font-size: 0.85rem; color: #4CAF50; margin-top: 0.75rem;">
        📚 <strong>Dictionary Translation</strong> • Instant & Unlimited
      </div>
    `;
  }
  
  // ✅ NEW: Audio button for translation output
  const audioButton = `
    <button 
      onclick="speakTranslation('${escapeQuotes(textToSpeak)}', '${speakLang}')" 
      class="btn-audio"
      style="
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s;
        font-size: 1rem;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
    >
      <span style="font-size: 1.2rem;">🔊</span>
      <span>Listen to Translation</span>
    </button>
  `;
  
  showOutput(`
    <div class="translation-block">
      <div class="original-text ${isSourceArabic ? 'arabic' : ''}">${originalText}</div>
      <div class="translated-text ${isTargetArabic ? 'arabic' : ''}">
        ${result.translation}
      </div>
      ${result.pronunciation ? 
        `<div class="pronunciation"><strong>Pronunciation:</strong> ${result.pronunciation}</div>` 
        : ''}
      ${audioButton}
      ${providerBadge}
    </div>
  `);
}

/**
 * Escape quotes for safe HTML attribute insertion
 */
function escapeQuotes(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ========== NEW: SPEAK TRANSLATION FUNCTION ==========

/**
 * Speak translated text with proper language
 * ✅ NEW FUNCTION
 */
function speakTranslation(text, lang) {
  // Check browser support
  if (!('speechSynthesis' in window)) {
    alert('🔇 Text-to-speech not supported in this browser. Please use Chrome or Edge.');
    return;
  }
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel();
  
  // Clean the text (remove HTML entities if any)
  const cleanText = text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.85; // Slightly slower for learning
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to use native voice
  const voices = window.speechSynthesis.getVoices();
  const targetLang = lang.split('-')[0]; // 'ar' or 'en'
  const matchingVoice = voices.find(voice => voice.lang.startsWith(targetLang));
  
  if (matchingVoice) {
    utterance.voice = matchingVoice;
    console.log('🔊 Using voice:', matchingVoice.name);
  }
  
  // Visual feedback on all audio buttons
  const buttons = document.querySelectorAll('.btn-audio');
  buttons.forEach(button => {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span style="font-size: 1.2rem;">⏸️</span> <span>Speaking...</span>';
    button.disabled = true;
    
    utterance.onend = () => {
      button.innerHTML = originalHTML;
      button.disabled = false;
    };
    
    utterance.onerror = () => {
      button.innerHTML = originalHTML;
      button.disabled = false;
      alert('🔇 Could not play audio. Please try again.');
    };
  });
  
  // Speak
  window.speechSynthesis.speak(utterance);
  console.log('🔊 Speaking:', cleanText.substring(0, 50) + '...', 'in', lang);
}

/**
 * Show limit reached message
 */
function showLimitReached(result) {
  const timeUntil = getTimeUntilReset();
  
  showOutput(`
    <div style="background: linear-gradient(135deg, #fff3cd, #ffc107); padding: 2rem; border-radius: 15px; border: 2px solid #ffc107;">
      <div style="text-align: center; font-size: 3rem; margin-bottom: 1rem;">🔒</div>
      
      <h3 style="color: #856404; margin-bottom: 1rem; text-align: center;">
        Daily Free API Limit Reached
      </h3>
      
      <p style="color: #856404; font-size: 1.05rem; margin-bottom: 1.5rem; text-align: center;">
        You've used all 5 free AI translations for today!<br>
        Resets in: <strong>${timeUntil}</strong>
      </p>
      
      <div style="background: rgba(255,255,255,0.7); padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <p style="color: #856404; margin-bottom: 1rem;">
          <strong>✅ You can still use:</strong>
        </p>
        <ul style="color: #856404; margin-left: 1.5rem; line-height: 1.8;">
          <li>📚 <strong>Dictionary translation</strong> (100+ phrases, unlimited)</li>
          <li>📘 <strong>All 40 lessons</strong> (unlimited)</li>
          <li>🔊 <strong>Pronunciation</strong> (unlimited)</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="premium.html" style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1rem 2rem; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
          ⭐ Go Premium - Unlimited Translations
        </a>
      </div>
    </div>
  `);
}

/**
 * Get time until midnight (when limit resets)
 */
function getTimeUntilReset() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes} minutes`;
  }
}

/**
 * Update usage display
 */
function updateUsageDisplay(remaining) {
  // Create or update usage indicator
  let indicator = document.getElementById('usage-indicator');
  
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'usage-indicator';
    indicator.className = 'info-box';
    indicator.style.marginTop = '1rem';
    document.getElementById('output').insertAdjacentElement('afterend', indicator);
  }
  
  if (remaining === 0) {
    indicator.innerHTML = `
      🔒 <strong>Last free translation used!</strong> 
      <a href="premium.html" style="color: #667eea; font-weight: 600;">Go Premium for unlimited →</a>
    `;
    indicator.style.background = '#fff3cd';
    indicator.style.borderColor = '#ffc107';
  } else if (remaining <= 2) {
    indicator.innerHTML = `
      ⚠️ <strong>${remaining} free AI translations left today</strong> 
      <a href="premium.html" style="color: #667eea;">Get unlimited →</a>
    `;
    indicator.style.background = '#fff3cd';
    indicator.style.borderColor = '#ffc107';
  } else {
    indicator.innerHTML = `
      ✅ <strong>${remaining}/5 free AI translations remaining today</strong>
      <span style="color: #999; font-size: 0.9rem;"> • Dictionary translations are unlimited</span>
    `;
    indicator.style.background = '#e3f2fd';
    indicator.style.borderColor = '#2196F3';
  }
  
  indicator.style.display = 'block';
}

/**
 * Show dictionary-only message with suggestions
 */
function showDictionaryOnlyMessage(lang) {
  if (lang === 'ar') {
    const examples = Object.keys(phrases)
      .filter(k => /[\u0600-\u06FF]/.test(k))
      .slice(0, 5);
    
    showOutput(`
      <div class="warning">
        ⚠️ <strong>Translation not found in dictionary.</strong><br><br>
        
        <p style="margin: 1rem 0;">Our AI translation API is loading...</p>
        
        <p><strong>Try these Arabic phrases:</strong></p>
        <div class="arabic" style="margin-top: 0.5rem; line-height: 2;">
          ${examples.join(' • ')}
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9ff; border-radius: 8px;">
          💡 <strong>Tip:</strong> Want to translate anything?
          <a href="premium.html" style="color: #667eea; font-weight: 600;">Go Premium</a> 
          for unlimited AI translations!
        </div>
      </div>
    `);
  } else {
    const examples = ['hello', 'thank you', 'good morning', 'how are you', 'goodbye'];
    
    showOutput(`
      <div class="warning">
        ⚠️ <strong>Translation not found in dictionary.</strong><br><br>
        
        <p style="margin: 1rem 0;">Our AI translation API is loading...</p>
        
        <p><strong>Try these English phrases:</strong></p>
        <div style="margin-top: 0.5rem;">
          ${examples.join(', ')}
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9ff; border-radius: 8px;">
          💡 <strong>Tip:</strong> Want to translate anything?
          <a href="premium.html" style="color: #667eea; font-weight: 600;">Go Premium</a> 
          for unlimited AI translations!
        </div>
      </div>
    `);
  }
}

/**
 * Show translation unavailable (both dictionary and API failed)
 */
function showTranslationUnavailable(lang) {
  showOutput(`
    <div class="warning">
      ⚠️ <strong>Translation not available</strong><br><br>
      
      <p>This phrase isn't in our dictionary yet, and the AI translation couldn't be completed.</p>
      
      <p style="margin-top: 1rem;"><strong>You can:</strong></p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; line-height: 1.8;">
        <li>Try a simpler phrase</li>
        <li>Check for typos</li>
        <li>Use common phrases from our dictionary</li>
        <li><a href="premium.html" style="color: #667eea; font-weight: 600;">Go Premium</a> for better AI translation</li>
      </ul>
    </div>
  `);
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Display output in the UI
 */
function showOutput(html, type = 'normal') {
  const output = document.getElementById('output');
  output.innerHTML = html;
  output.scrollTop = 0;
}

/**
 * Clear all translation input and output
 */
function clearAll() {
  document.getElementById('input').value = '';
  document.getElementById('output').innerHTML = '';
  
  // Also clear usage indicator if exists
  const indicator = document.getElementById('usage-indicator');
  if (indicator) {
    indicator.style.display = 'none';
  }
  
  updateCharCount();
}

/**
 * Update character counter
 */
function updateCharCount() {
  const input = document.getElementById('input').value;
  const counter = document.getElementById('charCount');
  if (counter) {
    counter.textContent = input.length + ' chars';
  }
}

// ========== LANGUAGE DETECTION ==========

/**
 * Detect if text contains Arabic characters
 */
function isArabic(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

console.log('✅ Translation engine loaded (with Free API + Audio support)');

/*
═══════════════════════════════════════════════════════════════
  CHANGES IN THIS VERSION:
  
  ✅ Added "Listen to Translation" button to all translations
  ✅ New speakTranslation() function with proper language detection
  ✅ Visual feedback during speech (button changes to "Speaking...")
  ✅ Automatic voice selection based on target language
  ✅ Error handling for browsers without audio support
  ✅ HTML entity cleaning for proper pronunciation
  
  HOW IT WORKS:
  1. User translates text
  2. Translation appears with audio button
  3. Click button → speaks in correct language
  4. Button shows "Speaking..." during playback
  5. Returns to normal when done
  
  BROWSER SUPPORT:
  ✅ Chrome/Edge: Full support (Arabic + English voices)
  ✅ Safari: Good support
  ⚠️ Firefox: May have limited voice options
═══════════════════════════════════════════════════════════════
*/