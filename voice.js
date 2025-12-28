/*
═══════════════════════════════════════════════════════════════
  VOICE.JS - VOICE RECOGNITION & TEXT-TO-SPEECH
  
  NARRATIVE:
  This module handles all voice-related features:
  1. Speech Recognition (Speech-to-Text)
  2. Text-to-Speech (TTS)
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
  
  LIMITATIONS:
  - Requires internet connection (browser APIs call cloud services)
  - Needs microphone permission
  - Arabic recognition accuracy varies by browser
  - Some browsers don't support Arabic TTS voices
═══════════════════════════════════════════════════════════════
*/

// ========== GLOBAL VARIABLES ==========
let recognition = null;        // Speech recognition instance
let isRecording = false;       // Recording state
let currentLanguage = 'ar-SA'; // Default to Arabic

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
 * Speak current lesson
 */
function speakLesson() {
  const lesson = getLesson(currentLesson);
  if (lesson) {
    speakText(lesson.ar, 'ar-SA');
  }
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

// ========== INITIALIZATION ON LOAD ==========

/**
 * Initialize voice features when page loads
 */
function initVoiceFeatures() {
  // Check support and show info
  showVoiceSupportInfo();
  
  // Load voices (they might not be ready immediately)
  if ('speechSynthesis' in window) {
    // Voices might load asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('Voices loaded:', window.speechSynthesis.getVoices().length);
      showVoiceSupportInfo();
    };
  }
  
  // Initialize recognition (lazy - only when first used)
  console.log('Voice features initialized');
}

/*
═══════════════════════════════════════════════════════════════
  END OF VOICE.JS
  
  FEATURES IMPLEMENTED:
  ✅ Speech-to-text (Arabic & English)
  ✅ Text-to-speech (Arabic & English)
  ✅ Auto language detection
  ✅ Error handling
  ✅ Browser compatibility checking
  
  BROWSER COMPATIBILITY:
  Chrome/Chromium: ⭐⭐⭐⭐⭐
  Edge: ⭐⭐⭐⭐⭐
  Safari: ⭐⭐⭐ (Limited TTS)
  Firefox: ⭐ (No recognition)
  
  KNOWN ISSUES:
  1. Arabic speech recognition accuracy varies
  2. Some devices lack Arabic TTS voices
  3. Requires internet connection
  4. Microphone permission needed
  
  FUTURE ENHANCEMENTS:
  
  1. Offline Speech Recognition:
     - Implement using TensorFlow.js
     - Train custom Arabic model
     - Better accuracy for dialects
  
  2. Advanced Features:
     - Real-time transcription
     - Pronunciation feedback
     - Accent detection
     - Speaking rate adjustment
  
  3. Accessibility:
     - Keyboard shortcuts for voice
     - Visual feedback during recording
     - Adjustable speech rate
     - Voice command navigation
  
  4. Cloud Integration (Optional):
     - Google Cloud Speech-to-Text
     - Azure Speech Services
     - Better Arabic dialect support
     
  PRIVACY NOTE:
  Browser speech APIs send audio to cloud services
  for processing. Inform users about this in production.
═══════════════════════════════════════════════════════════════
*/