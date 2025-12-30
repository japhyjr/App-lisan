/*
═══════════════════════════════════════════════════════════════
  APP.JS - MAIN APPLICATION CONTROLLER
  
  ✅ UPDATED: Added proper voice features initialization
  ✅ UPDATED: Helper function to get current lesson
  
  NARRATIVE:
  This is the orchestrator - it coordinates all other modules
  and handles:
  1. Application initialization
  2. Lesson navigation
  3. Progress tracking
  4. PWA installation
  5. Event listeners
  6. UI updates
  
  ARCHITECTURE:
  This file acts as the "glue" between all other modules:
  - phrases.js (data)
  - lessons.js (learning content)
  - translate.js (translation logic)
  - voice.js (voice features)
  
  LOADING ORDER (CRITICAL):
  1. phrases.js ← Must load first (contains data)
  2. lessons.js ← Depends on phrases structure
  3. translate.js ← Uses phrases for translation
  4. voice.js ← Uses translate functions
  5. app.js ← Orchestrates everything (THIS FILE)
═══════════════════════════════════════════════════════════════
*/

// ========== GLOBAL STATE ==========
let currentLesson = 0;        // Current lesson index
let deferredPrompt = null;    // PWA install prompt
let userProgress = {          // User progress tracking
  lessonsCompleted: [],
  lastLessonDate: null,
  streak: 0
};

// ========== LESSON MANAGEMENT ==========

/**
 * Load and display current lesson
 */
function loadLesson() {
  const lesson = lessons[currentLesson];
  if (!lesson) {
    console.error('Lesson not found at index:', currentLesson);
    return;
  }
  
  const lessonDiv = document.getElementById('lesson');
  
  // Build lesson card HTML
  lessonDiv.innerHTML = `
    <div class="lesson-card">
      <div class="lesson-arabic">${lesson.ar}</div>
      <div class="lesson-pron">${lesson.pron}</div>
      <div class="lesson-en">${lesson.en}</div>
      <div style="margin-top: 1rem; color: #667eea; font-size: 0.9rem;">
        💡 ${lesson.tip}
      </div>
    </div>
  `;
  
  updateProgress();
  updateButtons();
  
  console.log(`Loaded lesson ${currentLesson + 1}/${lessons.length}`);
}

/**
 * ✅ NEW: Helper function to get current lesson
 * Used by voice.js for speakLesson()
 */
function getLesson(index) {
  return lessons[index];
}

/**
 * Go to next lesson
 */
function nextLesson() {
  if (currentLesson < lessons.length - 1) {
    currentLesson++;
    loadLesson();
    markLessonAsCompleted(currentLesson - 1);
  }
}

/**
 * Go to previous lesson
 */
function previousLesson() {
  if (currentLesson > 0) {
    currentLesson--;
    loadLesson();
  }
}

/**
 * Jump to specific lesson
 * @param {number} index - Lesson index
 */
function goToLesson(index) {
  if (index >= 0 && index < lessons.length) {
    currentLesson = index;
    loadLesson();
  }
}

// ========== PROGRESS TRACKING ==========

/**
 * Update progress bar and statistics
 */
function updateProgress() {
  const percent = ((currentLesson + 1) / lessons.length) * 100;
  
  // Update progress bar
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    progressFill.style.width = percent + '%';
  }
  
  // Update stats
  const lessonNum = document.getElementById('lessonNum');
  const totalLessons = document.getElementById('totalLessons');
  const progress = document.getElementById('progress');
  
  if (lessonNum) lessonNum.textContent = currentLesson + 1;
  if (totalLessons) totalLessons.textContent = lessons.length;
  if (progress) progress.textContent = Math.round(percent) + '%';
}

/**
 * Update navigation button states
 */
function updateButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.disabled = currentLesson === 0;
  }
  
  if (nextBtn) {
    nextBtn.disabled = currentLesson === lessons.length - 1;
  }
}

/**
 * Mark lesson as completed
 * @param {number} lessonIndex - Index of completed lesson
 */
function markLessonAsCompleted(lessonIndex) {
  if (!userProgress.lessonsCompleted.includes(lessonIndex)) {
    userProgress.lessonsCompleted.push(lessonIndex);
    saveProgress();
  }
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
  try {
    userProgress.lastLessonDate = new Date().toISOString();
    localStorage.setItem('lisanProgress', JSON.stringify(userProgress));
    console.log('Progress saved');
  } catch (error) {
    console.warn('Could not save progress:', error);
  }
}

/**
 * Load progress from localStorage
 */
function loadProgress() {
  try {
    const saved = localStorage.getItem('lisanProgress');
    if (saved) {
      userProgress = JSON.parse(saved);
      console.log('Progress loaded:', userProgress);
    }
  } catch (error) {
    console.warn('Could not load progress:', error);
  }
}

// ========== PWA INSTALLATION ==========

/**
 * Handle PWA install prompt
 */
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt triggered');
  
  // Prevent default prompt
  e.preventDefault();
  
  // Store the event
  deferredPrompt = e;
  
  // Show custom install prompt
  const installPrompt = document.getElementById('installPrompt');
  if (installPrompt) {
    installPrompt.style.display = 'flex';
  }
});

/**
 * Install PWA when user clicks install button
 */
function installApp() {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    return;
  }
  
  // Show install prompt
  deferredPrompt.prompt();
  
  // Wait for user response
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted PWA install');
    } else {
      console.log('User dismissed PWA install');
    }
    
    // Clear the prompt
    deferredPrompt = null;
    
    // Hide install UI
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
      installPrompt.style.display = 'none';
    }
  });
}

/**
 * Dismiss install prompt
 */
function dismissInstall() {
  const installPrompt = document.getElementById('installPrompt');
  if (installPrompt) {
    installPrompt.style.display = 'none';
  }
  deferredPrompt = null;
}

// ========== KEYBOARD SHORTCUTS ==========

/**
 * Handle keyboard navigation
 */
document.addEventListener('keydown', (e) => {
  // Don't trigger if user is typing in textarea
  if (e.target.matches('textarea')) {
    return;
  }
  
  switch (e.key) {
    case 'ArrowRight':
      nextLesson();
      break;
    case 'ArrowLeft':
      previousLesson();
      break;
    case ' ': // Spacebar
      e.preventDefault();
      speakLesson();
      break;
    case 'Escape':
      stopSpeaking();
      stopRecording();
      break;
  }
});

// ========== SERVICE WORKER REGISTRATION ==========

/**
 * Register service worker for offline support
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.warn('Service Worker registration failed:', error);
      });
  }
}

// ========== ANALYTICS & TRACKING (Optional) ==========

/**
 * Track lesson completion
 * @param {number} lessonIndex - Completed lesson index
 */
function trackLessonCompletion(lessonIndex) {
  // This is a placeholder for analytics
  // You can integrate Google Analytics, Mixpanel, etc.
  console.log('Lesson completed:', lessonIndex);
  
  // Example: Google Analytics event
  // gtag('event', 'lesson_complete', {
  //   'lesson_number': lessonIndex + 1
  // });
}

/**
 * Track translation usage
 * @param {string} direction - Translation direction
 */
function trackTranslation(direction) {
  console.log('Translation:', direction);
  
  // Example: Track translation direction
  // gtag('event', 'translation', {
  //   'direction': direction
  // });
}

// ========== ACCESSIBILITY FEATURES ==========

/**
 * Announce changes to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ========== INITIALIZATION ==========

/**
 * Initialize the application
 */
function initializeApp() {
  console.log('🗣️ App-lisan Initializing...');
  
  // Load user progress
  loadProgress();
  
  // Load first lesson
  loadLesson();
  
  // ✅ UPDATED: Initialize voice features properly
  if (typeof initVoiceFeatures === 'function') {
    initVoiceFeatures();
  } else {
    console.warn('⚠️ Voice features not available (voice.js not loaded?)');
  }
  
  // Setup event listeners
  const input = document.getElementById('input');
  if (input) {
    input.addEventListener('input', updateCharCount);
  }
  
  // Register service worker
  registerServiceWorker();
  
  // Check PWA installation status
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Running as installed PWA');
  }
  
  // Initialize character counter
  if (typeof updateCharCount === 'function') {
    updateCharCount();
  }
  
  console.log('✅ App-lisan Ready!');
  console.log(`📚 ${lessons.length} lessons loaded`);
  console.log(`📖 ${Object.keys(phrases).length} phrases in dictionary`);
}

// ========== WINDOW LOAD EVENT ==========

/**
 * Run when page fully loads
 */
window.addEventListener('load', () => {
  initializeApp();
});

// ========== WINDOW UNLOAD EVENT ==========

/**
 * Save progress before page unloads
 */
window.addEventListener('beforeunload', () => {
  saveProgress();
});

// ========== ERROR HANDLING ==========

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Don't show error to user in production
  // But log for debugging
  if (window.location.hostname === 'localhost') {
    alert('An error occurred. Check console for details.');
  }
});

// ========== DEBUGGING HELPERS (Development Only) ==========

// Expose useful functions to console for debugging
if (window.location.hostname === 'localhost') {
  window.debug = {
    currentLesson: () => currentLesson,
    goToLesson: (index) => goToLesson(index),
    resetProgress: () => {
      localStorage.removeItem('lisanProgress');
      location.reload();
    },
    getPhraseCount: () => Object.keys(phrases).length,
    getLessonCount: () => lessons.length,
    getProgress: () => userProgress,
    testVoice: () => speakText('مرحبا', 'ar-SA'),
    testLesson: () => speakLesson()
  };
  
  console.log('🔧 Debug tools available: window.debug');
}

/*
═══════════════════════════════════════════════════════════════
  END OF APP.JS
  
  CHANGES IN THIS VERSION:
  ✅ Added getLesson() helper function for voice.js
  ✅ Improved initVoiceFeatures() call with error handling
  ✅ Added testLesson() to debug tools
  
  APPLICATION FLOW:
  
  1. Page loads → window.onload triggers
  2. initializeApp() runs:
     - Load saved progress
     - Initialize first lesson
     - ✅ Setup voice features (calls initVoiceFeatures)
     - Register service worker
  3. User interactions trigger functions:
     - Lesson navigation → nextLesson/previousLesson
     - Translation → translateText (from translate.js)
     - Voice → toggleVoiceInput (from voice.js)
     - ✅ Listen button → speakLesson() (fixed in voice.js)
  4. Progress auto-saves to localStorage
  5. Before page closes → saveProgress()
  
  KEY FEATURES IMPLEMENTED:
  ✅ Lesson navigation with progress tracking
  ✅ PWA installation handling
  ✅ Keyboard shortcuts
  ✅ Service worker registration
  ✅ Local storage for progress
  ✅ Error handling
  ✅ Accessibility features
  ✅ Voice features initialization
  ✅ Audio button support
  
  AUDIO FEATURES ADDED:
  ✅ Listen button in lessons works properly
  ✅ Listen button in translations (from translate.js)
  ✅ Proper Arabic voice selection
  ✅ Visual feedback during speech
  ✅ Error handling for unsupported browsers
═══════════════════════════════════════════════════════════════
*/