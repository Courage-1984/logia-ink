/**
 * Unregister Service Worker Script
 * Run this in the browser console to unregister any active service workers
 * Or use: node scripts/unregister-service-worker.js (for documentation)
 */

// This script should be run in the browser console, not via Node.js
// Copy and paste this into the browser console:

const unregisterServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`Found ${registrations.length} service worker registration(s)`);

      for (const registration of registrations) {
        const unregistered = await registration.unregister();
        console.log(`Service worker unregistered: ${unregistered ? 'Success' : 'Failed'}`);
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log(`Found ${cacheNames.length} cache(s)`);

        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log(`Cache deleted: ${cacheName}`);
        }
      }

      console.log('✅ Service workers unregistered and caches cleared!');
      console.log('🔄 Please reload the page (Ctrl+Shift+R / Cmd+Shift+R)');
    } catch (error) {
      console.error('❌ Error unregistering service workers:', error);
    }
  } else {
    console.log('ℹ️ Service workers not supported in this browser');
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  unregisterServiceWorkers();
} else {
  console.log(`
📋 To unregister service workers, open your browser console and run:

${unregisterServiceWorkers.toString()}

Or copy and paste this into the console:
`);
  console.log(unregisterServiceWorkers.toString());
}

export { unregisterServiceWorkers };

