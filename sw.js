/**
 * Service Worker for Logi-Ink
 * Provides offline support and faster repeat visits through asset caching
 *
 * Caching Strategy:
 * - Stale-while-revalidate for hashed assets (CSS/JS with content hashes) - ensures users get cached content immediately while updating in background
 * - Cache-first for truly static assets (images, fonts) - these don't change, so cache-first is optimal
 * - Network-first for HTML pages (always get fresh content) - ensures View Transitions API CSS rules are always up-to-date
 * - Stale-while-revalidate for other resources
 *
 * View Transitions API Compatibility:
 * - View Transitions API works at the browser level via CSS @view-transition { navigation: auto; }
 * - No service worker changes needed - View Transitions happen during navigation, which is handled by the browser
 * - HTML pages use network-first strategy, ensuring fresh HTML with View Transitions CSS rules
 * - CSS files use stale-while-revalidate, caching View Transitions styles while updating in background
 */

const CACHE_NAME = 'logi-ink-v1';
const STATIC_CACHE_NAME = 'logi-ink-static-v4'; // Increment version to force cache update (fixed CSS MIME type handling)
const RUNTIME_CACHE_NAME = 'logi-ink-runtime-v3'; // Increment version to force cache update (fixed CSS MIME type handling)

// Check if we're in development or preview mode (skip service worker entirely)
const isDevOrPreview = (url) => {
  return (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '[::1]' ||
    url.port === '3000' ||
    url.port === '5173' ||
    url.port === '8080' ||
    url.port === '4173' || // Vite preview default port
    url.port === '4176'    // Vite preview alternate port
  );
};

// Get base path from self.location (handles /logi-ink/ base path)
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '').replace(/\/$/, '') || '/';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  // HTML pages (using base path)
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/about.html`,
  `${BASE_PATH}/services.html`,
  `${BASE_PATH}/projects.html`,
  `${BASE_PATH}/contact.html`,

  // CSS
  `${BASE_PATH}/css/main.css`,
  `${BASE_PATH}/css/variables.css`,
  `${BASE_PATH}/css/base.css`,
  `${BASE_PATH}/css/fonts.css`,

  // JavaScript
  `${BASE_PATH}/js/main.js`,

  // Fonts (subsetted)
  `${BASE_PATH}/assets/fonts/Orbitron/woff2/Orbitron-Regular-subset.woff2`,
  `${BASE_PATH}/assets/fonts/Orbitron/woff2/Orbitron-Bold-subset.woff2`,
  `${BASE_PATH}/assets/fonts/Orbitron/woff2/Orbitron-Black-subset.woff2`,
  `${BASE_PATH}/assets/fonts/Rajdhani/woff2/Rajdhani-Light-subset.woff2`,
  `${BASE_PATH}/assets/fonts/Rajdhani/woff2/Rajdhani-Regular-subset.woff2`,
  `${BASE_PATH}/assets/fonts/Rajdhani/woff2/Rajdhani-SemiBold-subset.woff2`,
  `${BASE_PATH}/assets/fonts/Rajdhani/woff2/Rajdhani-Bold-subset.woff2`,

  // Images (critical and common)
  `${BASE_PATH}/assets/images/banners/banner_home.webp`,
  `${BASE_PATH}/assets/images/backgrounds/cta-get-in-touch.webp`,
  `${BASE_PATH}/assets/images/backgrounds/mission-parallax-bg.webp`,
  `${BASE_PATH}/assets/images/backgrounds/process-parallax-bg.webp`,
  `${BASE_PATH}/assets/images/backgrounds/testimonials-parallax-bg.webp`,
  `${BASE_PATH}/logo.png`,

  // Manifest
  `${BASE_PATH}/site.webmanifest`,

  // Icons
  `${BASE_PATH}/apple-touch-icon.png`,
  `${BASE_PATH}/favicon-32x32.png`,
  `${BASE_PATH}/favicon-48x48.png`,
  `${BASE_PATH}/favicon-16x16.png`,
];

// Install event - cache static assets
self.addEventListener('install', event => {
  // Skip installation in development or preview mode
  const url = new URL(self.location.href);
  if (isDevOrPreview(url)) {
    console.log('[Service Worker] Skipping installation in development/preview mode');
    // Skip waiting and activate immediately
    self.skipWaiting();
    return;
  }

  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        // Use addAll but don't fail if some assets fail to cache
        return Promise.allSettled(
          STATIC_ASSETS.map(asset =>
            cache.add(asset).catch(err => {
              console.warn('[Service Worker] Failed to cache:', asset, err);
              return null; // Don't fail entire install
            })
          )
        );
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached (some may have failed)');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(error => {
        console.error('[Service Worker] Cache install failed:', error);
        // Still activate even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old caches
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== RUNTIME_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated');
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip service worker in development/preview mode (localhost, 127.0.0.1, or dev/preview server ports)
  // This prevents interference with Vite's dev server, HMR, and preview server
  if (isDevOrPreview(url)) {
    // In development/preview, let all requests pass through to the server
    // Don't intercept at all - prevents corrupted content errors
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip range requests (e.g., media seeking) to avoid caching partial responses
  if (request.headers.has('range')) {
    return;
  }

  // Skip cross-origin requests (except for same-origin)
  if (url.origin !== location.origin) {
    return;
  }

  // Skip service worker itself
  if (url.pathname.endsWith('/sw.js')) {
    return;
  }

  // Skip report files - let them fail naturally if they don't exist
  // This prevents serving index.html as fallback for missing reports
  if (url.pathname.includes('/reports/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Handle different resource types
  if (isHashedAsset(request.url)) {
    // Hashed assets (CSS/JS with content hashes): Stale-while-revalidate
    // Ensures users get cached content immediately while updating in background
    event.respondWith(staleWhileRevalidate(request));
  } else if (isCSS(request.url)) {
    // CSS files: Stale-while-revalidate with explicit MIME type
    // Ensures correct content-type header
    event.respondWith(staleWhileRevalidateWithMIME(request, 'text/css'));
  } else if (isStaticAsset(request.url)) {
    // Truly static assets (images, fonts): Cache-first strategy
    // These don't change, so cache-first is optimal
    event.respondWith(cacheFirst(request));
  } else if (isHTML(request.url)) {
    // HTML pages: Network-first strategy (always get fresh content)
    event.respondWith(networkFirst(request));
  } else {
    // Other resources: Stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

/**
 * Cache-first strategy for static assets
 * Caches all CSS, JS, fonts, images, and other static assets
 */
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[Service Worker] Serving from cache:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      // Cache all successful responses
      cache.put(request, response.clone());
      console.log('[Service Worker] Cached:', request.url);
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', request.url, error);
    // Try to find a similar cached resource
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Try to find cached version with different query params or hash
    const cacheKeys = await cache.keys();
    for (const key of cacheKeys) {
      const keyUrl = new URL(key.url);
      if (keyUrl.pathname === pathname) {
        console.log('[Service Worker] Found similar cached resource:', key.url);
        return cache.match(key);
      }
    }

    // Return offline response if no cache found
    return new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/**
 * Network-first strategy for HTML pages
 */
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE_NAME);
  const url = new URL(request.url);

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed, serving from cache');
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    // Only fallback to index.html for main pages, not for reports or other files
    // Reports should return 404 if they don't exist
    if (isHTML(request.url) && !url.pathname.includes('/reports/')) {
      const fallback = await cache.match(`${BASE_PATH}/index.html`);
      if (fallback) {
        return fallback;
      }
    }

    // Return 404 for missing files instead of serving fallback
    return new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }
}

/**
 * Stale-while-revalidate strategy
 * Returns cached immediately, updates cache in background
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE_NAME);
  const cached = await cache.match(request);

  // Update cache in background (don't wait)
  const fetchPromise = fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
        console.log('[Service Worker] Updated cache:', request.url);
      }
      return response;
    })
    .catch(error => {
      console.log('[Service Worker] Background update failed:', request.url, error);
      // Return cached if available, or undefined
      return cached;
    });

  // Return cached immediately if available, otherwise wait for network
  if (cached) {
    // Don't await fetchPromise - let it update in background
    fetchPromise.catch(() => {}); // Suppress errors
    return cached;
  }

  // No cache, wait for network
  return fetchPromise;
}

/**
 * Stale-while-revalidate strategy with explicit MIME type
 * Ensures correct content-type header for CSS files
 */
async function staleWhileRevalidateWithMIME(request, mimeType) {
  const cache = await caches.open(RUNTIME_CACHE_NAME);
  const cached = await cache.match(request);

  // Update cache in background (don't wait)
  const fetchPromise = fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        // Ensure correct MIME type
        const headers = new Headers(response.headers);
        headers.set('Content-Type', mimeType);
        const modifiedResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
        cache.put(request, modifiedResponse.clone());
        console.log('[Service Worker] Updated cache with MIME type:', request.url, mimeType);
        return modifiedResponse;
      }
      return response;
    })
    .catch(error => {
      console.log('[Service Worker] Background update failed:', request.url, error);
      // Return cached if available, or undefined
      return cached;
    });

  // Return cached immediately if available, otherwise wait for network
  if (cached) {
    // Ensure cached response has correct MIME type
    const headers = new Headers(cached.headers);
    if (headers.get('Content-Type') !== mimeType) {
      headers.set('Content-Type', mimeType);
      const modifiedCached = new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers: headers
      });
      // Don't await fetchPromise - let it update in background
      fetchPromise.catch(() => {}); // Suppress errors
      return modifiedCached;
    }
    // Don't await fetchPromise - let it update in background
    fetchPromise.catch(() => {}); // Suppress errors
    return cached;
  }

  // No cache, wait for network
  return fetchPromise;
}

/**
 * Check if URL is a hashed asset (CSS/JS with content hashes)
 * These should use stale-while-revalidate for better freshness
 */
function isHashedAsset(url) {
  // Match Vite build assets with content hashes (CSS/JS only)
  // Pattern: /assets/[name]-[hash].(css|js|mjs)
  if (url.match(/\/assets\/[^/]+-[a-f0-9]+\.(css|js|mjs)$/i)) {
    return true;
  }
  return false;
}

/**
 * Check if URL is a static asset (images, fonts)
 * These are truly static and should use cache-first
 */
function isStaticAsset(url) {
  // Match file extensions for truly static assets
  if (
    url.match(/\.(woff2?|ttf|eot|otf|png|jpg|jpeg|gif|webp|svg|ico|avif|woff|woff2)$/i)
  ) {
    return true;
  }

  // Match asset directories for images and fonts
  if (
    url.includes('/assets/images/') ||
    url.includes('/assets/fonts/') ||
    url.includes('/fonts/')
  ) {
    return true;
  }

  return false;
}

/**
 * Check if URL is a CSS file
 */
function isCSS(url) {
  return url.endsWith('.css') || url.match(/\.css(\?|$)/);
}

/**
 * Check if URL is an HTML page
 */
function isHTML(url) {
  return url.endsWith('.html') || url.endsWith('/') || !url.match(/\./);
}

/**
 * Handle service worker updates
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
