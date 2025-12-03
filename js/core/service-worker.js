import { isDevelopmentEnv, isServiceWorkerDisabled } from '../utils/env.js';

/**
 * Service Worker Registration
 * Registers service worker and handles updates
 */

let registration = null;

/**
 * Register service worker
 */
/**
 * Automatically unregister service workers in development or when outdated
 * This runs immediately when the module loads (before DOM is ready)
 * to prevent service worker from interfering with page load
 */
export async function autoUnregisterServiceWorkers() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (registrations.length === 0) {
      return;
    }

    // Check if we're in development mode or preview mode
    const isDev = isDevelopmentEnv();
    const isPreview = typeof window !== 'undefined' &&
      (window.location.port === '4173' || window.location.port === '4176');

    // Check service worker version by detecting outdated cache names
    // If service worker is outdated, unregister it
    let shouldUnregister = isDev || isPreview;

    // If not in dev/preview, check if service worker version matches
    if (!isDev && !isPreview) {
      // Try to detect outdated service workers by checking cache names
      const cacheNames = await caches.keys();
      const hasOutdatedCache = cacheNames.some(name =>
        name.includes('static-v3') || // Old cache version (before CSS MIME fix)
        name.includes('runtime-v2')    // Old cache version (before CSS MIME fix)
      );

      if (hasOutdatedCache) {
        shouldUnregister = true;
        console.warn('[Service Worker] Detected outdated cache version, unregistering...');
      }
    }

    if (shouldUnregister) {
      console.log(`[Service Worker] Auto-unregistering ${registrations.length} service worker(s)...`);

      // Unregister all service workers
      for (const registration of registrations) {
        await registration.unregister();
      }

      // Clear all caches
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
      }

      if (isDev || isPreview) {
        const mode = isPreview ? 'preview mode' : 'development mode';
        console.info(`[Service Worker] ✅ Unregistered in ${mode}`);
      } else {
        console.info('[Service Worker] ✅ Unregistered outdated service worker');
        // Reload page to ensure clean state (only once per session)
        if (!sessionStorage.getItem('sw-auto-unregistered')) {
          sessionStorage.setItem('sw-auto-unregistered', 'true');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }
    }
  } catch (error) {
    console.warn('[Service Worker] Error during auto-unregistration:', error);
    // Don't throw - site should still work
  }
}

export function registerServiceWorker() {
  // Allow builds (like GitHub Pages) to opt out of service worker caching
  if (isServiceWorkerDisabled()) {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const sessionFlagKey = 'sw-disabled-reload';
      navigator.serviceWorker
        .getRegistrations()
        .then(registrations => {
          let hadActiveWorker = false;
          const unregisterPromises = registrations.map(reg => {
            if (reg.active) {
              hadActiveWorker = true;
            }
            return reg.unregister();
          });

          return Promise.all(unregisterPromises).then(() => {
            const shouldReload =
              hadActiveWorker &&
              typeof window !== 'undefined' &&
              !sessionStorage.getItem(sessionFlagKey);

            if (shouldReload) {
              sessionStorage.setItem(sessionFlagKey, 'true');
              window.location.reload();
            } else if (typeof window !== 'undefined') {
              sessionStorage.removeItem(sessionFlagKey);
            }
          });
        })
        .catch(() => {
          // Ignore cleanup errors; the site still works without unregistering
        });
    }

    if (typeof window !== 'undefined') {
      console.info('[Service Worker] Disabled for this build');
    }
    return;
  }

  // Automatically unregister service workers in development or preview mode
  const isPreview = typeof window !== 'undefined' &&
    (window.location.port === '4173' || window.location.port === '4176' ||
     (window.location.hostname === 'localhost' && (window.location.port === '4173' || window.location.port === '4176')));

  if (isDevelopmentEnv() || isPreview) {
    // Auto-unregister any existing service workers in development/preview
    autoUnregisterServiceWorkers();

    // Also try to unregister directly (more aggressive for Firefox)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister().then(() => {
            console.log('[Service Worker] Force unregistered existing worker');
          }).catch(err => {
            console.warn('[Service Worker] Error unregistering:', err);
          });
        });
      }).catch(err => {
        console.warn('[Service Worker] Error getting registrations:', err);
      });
    }

    if (typeof window !== 'undefined') {
      const mode = isPreview ? 'preview mode' : 'development mode';
      console.info(`[Service Worker] Skipping registration in ${mode} (auto-unregistered existing workers)`);
    }
    return;
  }

  if (!('serviceWorker' in navigator)) {
    // Service Worker not supported - gracefully degrade
    return;
  }

  try {
    window.addEventListener('load', () => {
      // Get base path from current location (handles /logi-ink/ base path)
      const basePath =
        window.location.pathname.replace(/\/[^/]*\.html?$/, '').replace(/\/$/, '') || '';
      const swPath = `${basePath}/sw.js`;

      navigator.serviceWorker
        .register(swPath)
        .then(reg => {
          registration = reg;
          if (isDevelopmentEnv()) {
            console.log('[Service Worker] Registered:', reg.scope);
          }

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  showUpdateNotification();
                }
              });
            }
          });
        })
        .catch(error => {
          // Service worker registration failed - site still works without it
          if (isDevelopmentEnv()) {
            console.error('[Service Worker] Registration failed:', error);
          }
          // In production, fail silently - site works without service worker
        });
    });
  } catch (error) {
    // Service worker initialization failed - gracefully degrade
    if (isDevelopmentEnv()) {
      console.error('[Service Worker] Initialization failed:', error);
    }
  }

  // Listen for service worker updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Service worker updated, reload page
      window.location.reload();
    });
  }
}

/**
 * Show update notification
 */
function showUpdateNotification() {
  // Check if update notification already exists
  if (document.querySelector('.sw-update-notification')) {
    return;
  }

  const notification = document.createElement('div');
  notification.className = 'sw-update-notification';
  notification.innerHTML = `
        <div class="sw-update-content">
            <p>New version available!</p>
            <button class="sw-update-btn" id="sw-update-btn">Update Now</button>
            <button class="sw-update-dismiss" id="sw-update-dismiss">Dismiss</button>
        </div>
    `;

  document.body.appendChild(notification);

  // Update button
  document.getElementById('sw-update-btn').addEventListener('click', () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  // Dismiss button
  document.getElementById('sw-update-dismiss').addEventListener('click', () => {
    notification.remove();
  });
}

/**
 * Check for service worker updates
 */
export function checkForUpdates() {
  if (registration) {
    registration.update();
  }
}
