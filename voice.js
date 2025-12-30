/*
═══════════════════════════════════════════════════════════════
  VOICE.JS - VOICE RECOGNITION & TEXT-TO-SPEECH
  
  ✅ UPDATED: Fixed speakLesson() for proper Arabic pronunciation
  ✅ UPDATED: Added voice loading system
  ✅ UPDATED: Better error handling and user feedback
  
  FEATURES:
  1. Speech Recognition (Speech-to-Text)
  2. Text-to-Speech (TTS) with proper Arabic voices
  3. Language detection for voice input
  4. Browser compatibility checking
  
  BROWSER APIS USED:
  - Web Speech API (SpeechRecognition)
  - Web Speech API (SpeechSynthesis)
  
  BROWSER SUPPORT:
  ✅ Chrome/Chromium - Full support
  ✅ Edge - Full support
  ⚠️ Safari - Limited support
  ❌ Firefox - No support for speech recognition
═══════════════════════════════════════════════════════════════
*/

// ========== GLOBAL VARIABLES ==========
let recognition = null;        // Speech recognition instance
let isRecording = false;       // Recording state
let currentLanguage = 'ar-SA'; // Default to Arabic
let voicesLoaded = false;      // Track if voices are ready

// ========== INITIALIZATION ==========

/**
 * Initialize speech recognition
 * @returns {boolean} True if successful, false if not supported
 */
function initVoiceRecognition() {
  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported in this browser');
    return false;
  }
  
  // Create recognition instance
  recognition = new SpeechRecognition();
  
  // Configuration
  recognition.continuous = false;      // Stop after one result
  recognition.interimResults = false;  // Only return final results
  recognition.lang = currentLanguage;  // Set language
  recognition.maxAlternatives = 1;     // Only get top result
  
  // ========== EVENT HANDLERS ==========
  
  /**
   * Handle successful speech recognition
   */
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    
    console.log('Speech recognized:', transcript);
    console.log('Confidence:', (confidence * 100).toFixed(1) + '%');
    
    // Insert transcript into input field
    document.getElementById('input').value = transcript;
    updateCharCount();
    
    // Stop recording
    stopRecording();
    
    // Auto-translate based on detected language
    if (isArabic(transcript)) {
      setTimeout(() => translateText('ar-en'), 300);
    } else {
      setTimeout(() => translateText('en-ar'), 300);
    }
  };
  
  /**
   * Handle recognition errors
   */
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    stopRecording();
    
    // Show user-friendly error messages
    let errorMessage = '⚠️ Voice recognition error: ';
    
    switch (event.error) {
      case 'no-speech':
        errorMessage += 'No speech detected. Please try again.';
        break;
      case 'audio-capture':
        errorMessage += 'Microphone not accessible. Check permissions.';
        break;
      case 'not-allowed':
        errorMessage += 'Microphone permission denied. Enable in browser settings.';
        break;
      case 'network':
        errorMessage += 'Network error. Check internet connection.';
        break;
      case 'aborted':
        errorMessage += 'Recording aborted.';
        break;
      default:
        errorMessage += event.error;
    }
    
    showOutput(errorMessage, 'error');
  };
  
  /**
   * Handle recognition start
   */
  recognition.onstart = () => {
    console.log('Speech recognition started');
  };
  
  /**
   * Handle recognition end
   */
  recognition.onend = () => {
    console.log('Speech recognition ended');
    stopRecording();
  };
  
  return true;
}

// ========== VOICE INPUT CONTROLS ==========

/**
 * Toggle voice input (start/stop)
 */
function toggleVoiceInput() {
  if (!recognition) {
    const initialized = initVoiceRecognition();
    if (!initialized) {
      showOutput(
        '⚠️ Voice recognition not supported in this browser. Please use Chrome or Edge.',
        'error'
      );
      return;
    }
  }
  
  if (isRecording) {
    recognition.stop();
  } else {
    startRecording();
  }
}

/**
 * Start recording voice input
 */
function startRecording() {
  if (!recognition) {
    toggleVoiceInput();
    return;
  }
  
  try {
    isRecording = true;
    
    // Update UI
    const btn = document.getElementById('voiceBtn');
    const btnText = document.getElementById('voiceBtnText');
    btn.classList.add('recording');
    btnText.textContent = 'Listening...';
    
    // Clear previous input
    document.getElementById('output').innerHTML = 
      '<div style="color: #667eea;">🎤 Listening... Speak now!</div>';
    
    // Start recognition
    recognition.start();
    
    console.log('Recording started');
  } catch (error) {
    console.error('Error starting recognition:', error);
    stopRecording();
    showOutput('⚠️ Could not start recording: ' + error.message, 'error');
  }
}

/**
 * Stop recording voice input
 */
function stopRecording() {
  isRecording = false;
  
  // Update UI
  const btn = document.getElementById('voiceBtn');
  const btnText = document.getElementById('voiceBtnText');
  
  if (btn) btn.classList.remove('recording');
  if (btnText) btnText.textContent = 'Voice Input';
  
  console.log('Recording stopped');
}

/**
 * Change recognition language
 * @param {string} lang - Language code ('ar-SA' or 'en-US')
 */
function changeVoiceLanguage(lang) {
  currentLanguage = lang;
  if (recognition) {
    recognition.lang = lang;
  }
  console.log('Voice language changed to:', lang);
}

// ========== TEXT-TO-SPEECH ==========

/**
 * Speak text using browser TTS
 * @param {string} text - Text to speak
 * @param {string} lang - Language code (default: 'ar-SA')
 */
function speakText(text, lang = 'ar-SA') {
  // Check browser support
  if (!('speechSynthesis' in window)) {
    alert('Text-to-speech not supported in this browser');
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.8;  // Slower for learning
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to use a native voice for the language
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
  
  if (matchingVoice) {
    utterance.voice = matchingVoice;
    console.log('Using voice:', matchingVoice.name);
  }
  
  // Event handlers
  utterance.onstart = () => {
    console.log('Speech started');
  };
  
  utterance.onend = () => {
    console.log('Speech ended');
  };
  
  utterance.onerror = (event) => {
    console.error('Speech error:', event.error);
  };
  
  // Speak
  window.speechSynthesis.speak(utterance);
}

/**
 * ✅ UPDATED: Speak current lesson with proper Arabic voice
 */
function speakLesson() {
  const lesson = lessons[currentLesson];
  
  if (!lesson) {
    console.error('No lesson to speak');
    return;
  }
  
  // Check browser support
  if (!('speechSynthesis' in window)) {
    alert('🔇 Text-to-speech not supported in this browser. Please use Chrome or Edge.');
    return;
  }
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel();
  
  // Create utterance for Arabic
  const utterance = new SpeechSynthesisUtterance(lesson.ar);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.8; // Slower for learning
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to find Arabic voice
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(voice => 
    voice.lang.startsWith('ar') || 
    voice.lang === 'ar-SA'
  );
  
  if (arabicVoice) {
    utterance.voice = arabicVoice;
    console.log('🔊 Using Arabic voice:', arabicVoice.name);
  } else {
    console.warn('⚠️ No Arabic voice found, using default');
  }
  
  // Visual feedback on button
  const speakBtn = document.querySelector('.btn-speak');
  if (speakBtn) {
    const originalHTML = speakBtn.innerHTML;
    speakBtn.innerHTML = '⏸️ Speaking...';
    speakBtn.disabled = true;
    
    utterance.onend = () => {
      speakBtn.innerHTML = originalHTML;
      speakBtn.disabled = false;
      console.log('🔊 Finished speaking');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      speakBtn.innerHTML = originalHTML;
      speakBtn.disabled = false;
      alert('🔇 Could not play audio. Your device may not have Arabic voice support.');
    };
  }
  
  // Speak
  window.speechSynthesis.speak(utterance);
  console.log('🔊 Speaking lesson:', lesson.ar);
}

/**
 * Stop any ongoing speech
 */
function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// ========== VOICE UTILITIES ==========

/**
 * Get available voices for a language
 * @param {string} langCode - Language code ('ar', 'en', etc.)
 * @returns {Array} Available voices
 */
function getVoicesForLanguage(langCode) {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith(langCode));
}

/**
 * Check if voice features are supported
 * @returns {Object} Support status
 */
function checkVoiceSupport() {
  return {
    recognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    synthesis: 'speechSynthesis' in window,
    arabicVoices: getVoicesForLanguage('ar').length > 0,
    englishVoices: getVoicesForLanguage('en').length > 0
  };
}

/**
 * Display voice support information to user
 */
function showVoiceSupportInfo() {
  const support = checkVoiceSupport();
  const infoBox = document.getElementById('voiceInfo');
  
  if (!infoBox) return;
  
  if (!support.recognition) {
    infoBox.innerHTML = `
      ⚠️ <strong>Voice input not supported</strong> in this browser. 
      Use Chrome or Edge for voice features.
    `;
    infoBox.style.background = '#fff3cd';
    infoBox.style.borderColor = '#ffc107';
  } else if (!support.arabicVoices) {
    infoBox.innerHTML = `
      ✅ Voice input enabled<br>
      ⚠️ Arabic text-to-speech may not be available on your device
    `;
  } else {
    infoBox.innerHTML = `
      ✅ Voice input enabled<br>
      ✅ Arabic pronunciation available
    `;
    infoBox.style.background = '#d4edda';
    infoBox.style.borderColor = '#28a745';
  }
}

// ========== ✅ NEW: VOICE LOADING SYSTEM ==========

/**
 * Ensure voices are loaded before using them
 * Voices might not be ready immediately on page load
 */
function ensureVoicesLoaded(callback) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }
  
  let voices = window.speechSynthesis.getVoices();
  
  if (voices.length > 0) {
    voicesLoaded = true;
    callback();
  } else {
    // Voices not loaded yet, wait for them
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      console.log('🔊 Voices loaded:', voices.length);
      
      // Log available Arabic voices
      const arabicVoices = voices.filter(v => v.lang.startsWith('ar'));
      if (arabicVoices.length > 0) {
        console.log('✅ Arabic voices available:', arabicVoices.map(v => v.name).join(', '));
      } else {
        console.warn('⚠️ No Arabic voices found on this device');
      }
      
      callback();
    };
    
    // Force load voices (some browsers need this)
    window.speechSynthesis.getVoices();
  }
}

/**
 * ✅ NEW: Stop all speech (cleanup function)
 */
function stopAllSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    console.log('🔇 All speech stopped');
  }
}

// ========== INITIALIZATION ON LOAD ==========

/**
 * Initialize voice features when page loads
 */
function initVoiceFeatures() {
  // Check support and show info
  showVoiceSupportInfo();
  
  // Load voices with callback
  ensureVoicesLoaded(() => {
    console.log('✅ Audio system ready');
    showVoiceSupportInfo(); // Update info after voices load
  });
  
  console.log('Voice features initialized');
}

// ========== PAGE LOAD EVENTS ==========

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureVoicesLoaded(() => {
      console.log('✅ Audio system ready (DOMContentLoaded)');
    });
  });
} else {
  ensureVoicesLoaded(() => {
    console.log('✅ Audio system ready (immediate)');
  });
}

/**
 * Stop speech when page unloads
 */
window.addEventListener('beforeunload', stopAllSpeech);

console.log('✅ Voice.js loaded with audio fixes');

/*
═══════════════════════════════════════════════════════════════
  CHANGES IN THIS VERSION:
  
  ✅ Fixed speakLesson() with proper Arabic voice selection
  ✅ Added ensureVoicesLoaded() to handle async voice loading
  ✅ Added stopAllSpeech() cleanup function
  ✅ Better visual feedback on buttons during speech
  ✅ Improved error messages for users
  ✅ Voice logging for debugging
  
  HOW IT WORKS NOW:
  1. Page loads → initVoiceFeatures()
  2. Voices load asynchronously → ensureVoicesLoaded()
  3. User clicks "Listen" button → speakLesson()
  4. System finds Arabic voice → Speaks lesson
  5. Button shows "Speaking..." → Returns to normal
  
  BROWSER COMPATIBILITY:
  Chrome/Chromium: ⭐⭐⭐⭐⭐ Full Arabic support
  Edge: ⭐⭐⭐⭐⭐ Full Arabic support
  Safari: ⭐⭐⭐ Limited Arabic voices
  Firefox: ⭐⭐ Very limited voice support
  
  TESTING:
  - Open console to see voice loading logs
  - Click "Listen" button in lessons
  - Should hear Arabic pronunciation
  - Button should show "Speaking..." during playback
═══════════════════════════════════════════════════════════════
*/