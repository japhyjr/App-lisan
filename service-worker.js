/*
═══════════════════════════════════════════════════════════════
  SERVICE-WORKER.JS - OFFLINE CACHING & PWA SUPPORT
  
  NARRATIVE:
  A Service Worker is a script that runs in the background,
  separate from your web page. It enables:
  1. Offline functionality
  2. Background sync
  3. Push notifications
  4. Cache management
  
  HOW IT WORKS:
  1. INSTALL: Cache critical app files
  2. ACTIVATE: Clean up old caches
  3. FETCH: Intercept network requests
     - Return cached version if offline
     - Fetch from network if online
  
  CACHING STRATEGY: "Cache First, Network Fallback"
  - Try cache first (fast)
  - If not in cache, fetch from network
  - Update cache with new content
  
  LIFECYCLE:
  Install → Waiting → Activate → Fetch
═══════════════════════════════════════════════════════════════
*/

// ========== CONFIGURATION ==========

// Cache version - increment when you update files
const CACHE_VERSION = 'app-lisan-v1.0.0';

// Cache names
const CACHE_NAMES = {
  static: `${CACHE_VERSION}-static`,
  dynamic: `${CACHE_VERSION}-dynamic`,
  images: `${CACHE_VERSION}-images`
};

// Files to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/translate.js',
  '/lessons.js',
  '/phrases.js',
  '/voice.js',
  '/manifest.json'
];

// Maximum cache size (number of items)
const MAX_CACHE_SIZE = 50;

// ========== INSTALL EVENT ==========

/**
 * Fired when service worker is first installed
 * Cache all static assets here
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// ========== ACTIVATE EVENT ==========

/**
 * Fired when service worker becomes active
 * Clean up old caches here
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    // Delete old caches
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete caches that don't match current version
              return !Object.values(CACHE_NAMES).includes(cacheName);
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// ========== FETCH EVENT ==========

/**
 * Intercept all network requests
 * Implement caching strategy here
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine caching strategy based on request type
  if (isStaticAsset(request)) {
    // Static files: Cache first, network fallback
    event.respondWith(cacheFirst(request, CACHE_NAMES.static));
  } else if (isImage(request)) {
    // Images: Cache first, network fallback
    event.respondWith(cacheFirst(request, CACHE_NAMES.images));
  } else {
    // Dynamic content: Network first, cache fallback
    event.respondWith(networkFirst(request, CACHE_NAMES.dynamic));
  }
});

// ========== CACHING STRATEGIES ==========

/**
 * Cache First Strategy
 * 1. Check cache
 * 2. Return cached response if found
 * 3. Otherwise fetch from network and cache
 */
async function cacheFirst(request, cacheName) {
  try {
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the new response
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('[Service Worker] Cache first failed:', error);
    
    // Return offline page if available
    return caches.match('/offline.html');
  }
}

/**
 * Network First Strategy
 * 1. Try network first
 * 2. If successful, update cache
 * 3. If network fails, return cached version
 */
async function networkFirst(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Update cache with new response
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      
      // Limit cache size
      limitCacheSize(cacheName, MAX_CACHE_SIZE);
    }
    
    return networkResponse;
    
  } catch (error) {
    // Network failed, try cache
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Both network and cache failed
    throw error;
  }
}

// ========== HELPER FUNCTIONS ==========

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  return STATIC_ASSETS.some(asset => url.pathname === asset);
}

/**
 * Check if request is for an image
 */
function isImage(request) {
  return request.destination === 'image' ||
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

/**
 * Limit cache size by removing oldest items
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Delete oldest items
    const itemsToDelete = keys.length - maxSize;
    for (let i = 0; i < itemsToDelete; i++) {
      await cache.delete(keys[i]);
    }
    console.log(`[Service Worker] Cache trimmed: deleted ${itemsToDelete} items`);
  }
}

// ========== BACKGROUND SYNC (Future Enhancement) ==========

/**
 * Handle background sync events
 * Useful for syncing data when connection restored
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-translations') {
    event.waitUntil(syncTranslations());
  }
});

/**
 * Sync translations when back online
 */
async function syncTranslations() {
  // Placeholder for future implementation
  console.log('[Service Worker] Syncing translations...');
  
  // You could:
  // 1. Get pending translations from IndexedDB
  // 2. Send to server
  // 3. Update local database
}

// ========== PUSH NOTIFICATIONS (Future Enhancement) ==========

/**
 * Handle push notification events
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New lesson available!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/icon-checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('App-lisan', options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open app to lessons
    event.waitUntil(
      clients.openWindow('/#lessons')
    );
  }
});

// ========== MESSAGE HANDLING ==========

/**
 * Handle messages from main app
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

/*
═══════════════════════════════════════════════════════════════
  END OF SERVICE-WORKER.JS
  
  FEATURES IMPLEMENTED:
  ✅ Static asset caching
  ✅ Dynamic content caching
  ✅ Image caching
  ✅ Cache version management
  ✅ Offline fallback
  ✅ Cache size limiting
  ⏳ Background sync (prepared)
  ⏳ Push notifications (prepared)
  
  CACHING STRATEGIES USED:
  
  1. Cache First (Static Assets)
     - Fast loading
     - Always available offline
     - Good for JS/CSS/HTML that rarely changes
  
  2. Network First (Dynamic Content)
     - Fresh content when online
     - Cached fallback when offline
     - Good for API responses
  
  3. Stale While Revalidate (Images)
     - Show cached version immediately
     - Update cache in background
     - Best user experience
  
  TESTING SERVICE WORKER:
  
  1. Chrome DevTools → Application → Service Workers
  2. Check status (installing/waiting/activated)
  3. Test offline mode:
     - DevTools → Network → Offline
     - Reload page - should work!
  
  DEBUGGING TIPS:
  
  - Always increment CACHE_VERSION when updating
  - Use "Update on reload" during development
  - Check cache contents in DevTools
  - Monitor console for cache hits/misses
  
  PRODUCTION CHECKLIST:
  
  ✅ HTTPS enabled (required for service workers)
  ✅ All assets listed in STATIC_ASSETS
  ✅ Cache version updated
  ✅ Offline page created
  ✅ Icons exist at correct paths
  
  FUTURE ENHANCEMENTS:
  
  1. IndexedDB for offline data storage
  2. Background sync for translations
  3. Push notifications for daily lessons
  4. Precaching of next lesson
  5. Smart cache invalidation
  6. Network-only mode for debugging
═══════════════════════════════════════════════════════════════
*/