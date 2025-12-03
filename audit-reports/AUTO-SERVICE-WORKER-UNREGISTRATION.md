# Automatic Service Worker Unregistration

## Overview

Service worker unregistration is now **automated** - no manual intervention required! The system automatically detects and unregisters service workers when:

1. **Development Mode**: Automatically unregisters all service workers in development
2. **Outdated Cache Versions**: Detects and unregisters service workers with outdated cache versions
3. **On Every Page Load**: Runs immediately when the page loads (before DOM is ready)

## How It Works

### 1. Immediate Execution

The auto-unregistration runs **immediately** when `js/main.js` loads, before the DOM is ready:

```javascript
// In js/main.js - runs immediately
import { autoUnregisterServiceWorkers } from './core/service-worker.js';

if (typeof window !== 'undefined') {
  autoUnregisterServiceWorkers(); // Runs immediately, no waiting
}
```

### 2. Development Mode Detection

In development mode (`localhost`, `127.0.0.1`, or dev server ports), service workers are automatically unregistered:

```javascript
const isDev = isDevelopmentEnv();
let shouldUnregister = isDev; // Always unregister in dev
```

### 3. Outdated Cache Detection

In production, the system checks for outdated cache versions:

```javascript
const cacheNames = await caches.keys();
const hasOutdatedCache = cacheNames.some(name => 
  name.includes('static-v3') || // Old cache version (before CSS MIME fix)
  name.includes('runtime-v2')    // Old cache version (before CSS MIME fix)
);
```

If outdated caches are detected, the service worker is automatically unregistered and the page reloads.

## Benefits

✅ **No Manual Intervention**: Service workers are automatically cleaned up  
✅ **Prevents FOUC**: Service workers can't interfere with CSS loading  
✅ **Development-Friendly**: Automatically disabled in development mode  
✅ **Version-Aware**: Detects and removes outdated service workers  
✅ **Zero Configuration**: Works out of the box  

## Cache Version Detection

When you update the service worker significantly (e.g., fix CSS MIME type handling), update the cache version detection in `js/core/service-worker.js`:

```javascript
const hasOutdatedCache = cacheNames.some(name => 
  name.includes('static-v3') || // Add old versions here
  name.includes('runtime-v2')    // Add old versions here
);
```

Current cache versions (as of this fix):
- `static-v4` - Current (after CSS MIME fix)
- `runtime-v3` - Current (after CSS MIME fix)

## Console Messages

You'll see these messages in the console:

**Development Mode:**
```
[Service Worker] Auto-unregistering 1 service worker(s)...
[Service Worker] ✅ Unregistered in development mode
```

**Outdated Cache (Production):**
```
[Service Worker] Detected outdated cache version, unregistering...
[Service Worker] Auto-unregistering 1 service worker(s)...
[Service Worker] ✅ Unregistered outdated service worker
```

## Testing

1. **Development Mode**:
   - Start dev server (`npm run dev`)
   - Open browser console
   - Should see: `[Service Worker] ✅ Unregistered in development mode`
   - No service workers should be registered

2. **Production Mode**:
   - Build project (`npm run build`)
   - Serve production build
   - If old service worker exists, it will be auto-unregistered
   - Page will reload once to ensure clean state

## Manual Override

If you need to manually unregister service workers (for testing), you can still use the browser console:

```javascript
(async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
  }
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    await caches.delete(cacheName);
  }
  console.log('✅ Manually unregistered');
})();
```

## Files Modified

- `js/core/service-worker.js` - Added `autoUnregisterServiceWorkers()` function
- `js/main.js` - Calls `autoUnregisterServiceWorkers()` immediately on load

## Related Fixes

This works in conjunction with:
- Service worker development mode skip (in `sw.js`)
- CSS MIME type enforcement (in `sw.js`)
- Service worker registration skip in development (in `js/core/service-worker.js`)

---

**Status**: ✅ **AUTOMATED** - No manual intervention required!  
**Date**: 2025-01-30

