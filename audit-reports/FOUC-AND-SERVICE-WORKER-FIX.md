# FOUC and Service Worker Fix - URGENT

## Critical Issues

1. **Service Worker Interfering in Development**: Old service worker is intercepting CSS requests and serving them with wrong MIME type
2. **CSS Not Loading**: `css/main.css` is being served as `text/javascript` instead of `text/css`
3. **Heavy FOUC**: Page renders unstyled because CSS isn't loading

## Immediate Fix Required

### Step 1: Unregister Service Worker (DO THIS FIRST!)

**Open your browser console** (F12) and run:

```javascript
(async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`Found ${registrations.length} service worker(s)`);
    
    for (const registration of registrations) {
      const unregistered = await registration.unregister();
      console.log(`Unregistered: ${unregistered}`);
    }
    
    // Clear all caches
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`Deleted cache: ${cacheName}`);
    }
    
    console.log('✅ Service workers cleared! Reload the page (Ctrl+Shift+R)');
  }
})();
```

**OR** use DevTools:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar
4. Click **Unregister** for any active service workers
5. Click **Clear storage** → **Clear site data**
6. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Step 2: Verify Fix

After unregistering:
1. Hard refresh the page (Ctrl+Shift+R)
2. Check Network tab - `css/main.css` should load with `Content-Type: text/css`
3. No MIME type errors in console
4. Page should render with styles immediately

## Root Cause

The service worker was:
1. Caching CSS files with incorrect MIME type headers
2. Serving cached CSS as `text/javascript` instead of `text/css`
3. Interfering with Vite's dev server in development mode

## Fixes Applied

### 1. Service Worker Development Mode Skip

**File**: `sw.js`

Added check to skip intercepting requests in development:

```javascript
// Skip service worker in development mode (localhost, 127.0.0.1, or dev server ports)
if (
  url.hostname === 'localhost' ||
  url.hostname === '127.0.0.1' ||
  url.hostname === '[::1]' ||
  url.port === '3000' ||
  url.port === '5173' ||
  url.port === '8080'
) {
  // In development, let all requests pass through to the dev server
  return;
}
```

### 2. CSS MIME Type Enforcement

**File**: `sw.js`

Added explicit CSS file handling with correct MIME type:

```javascript
function isCSS(url) {
  return url.endsWith('.css') || url.match(/\.css(\?|$)/);
}

async function staleWhileRevalidateWithMIME(request, mimeType) {
  // Ensures correct Content-Type: text/css header
  // ...
}
```

### 3. Service Worker Registration Skip in Development

**File**: `js/core/service-worker.js`

Already implemented - service worker registration is skipped in development mode.

## Why This Happened

1. Service worker was registered in a previous session (possibly production build)
2. Service worker cached CSS files with incorrect headers
3. Even though registration is skipped in development, the old service worker was still active
4. Old service worker intercepted requests and served corrupted CSS

## Prevention

The fixes ensure:
- ✅ Service worker doesn't intercept requests in development
- ✅ CSS files are served with correct MIME type in production
- ✅ Service worker registration is skipped in development

## Testing

After unregistering the service worker:

1. **Verify CSS Loading**:
   - Network tab → `css/main.css` → Headers → `Content-Type: text/css`
   - No MIME type errors in console

2. **Verify No FOUC**:
   - Page should render with styles immediately
   - No flash of unstyled content
   - Navigation and hero section styled correctly

3. **Verify Service Worker**:
   - Application tab → Service Workers → Should show "No service workers registered"
   - Console should show: `[Service Worker] Skipping registration in development mode`

## If FOUC Persists

If you still see FOUC after unregistering:

1. **Check Critical CSS**: Verify critical CSS is inlined in `<head>`
2. **Check Font Loading**: Fonts should load with `font-display: swap`
3. **Check Async CSS**: `css/main.css` should load asynchronously (non-blocking)
4. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R) or clear cache

## Next Steps

1. ✅ Unregister service worker (see Step 1 above)
2. ✅ Hard refresh page
3. ✅ Verify CSS loads correctly
4. ✅ Test in production build (service worker should work correctly there)

---

**Status**: ⚠️ **REQUIRES MANUAL ACTION** - Unregister service worker first!  
**Date**: 2025-01-30

