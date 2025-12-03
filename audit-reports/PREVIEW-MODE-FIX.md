# Preview Mode Service Worker Fix

## Issue

In preview mode (Vite preview server on port 4176), the service worker was:
- Intercepting requests and serving corrupted content (`NS_ERROR_CORRUPTED_CONTENT`)
- Causing files to load with wrong MIME types
- Blocking module loading

## Root Cause

The service worker skip logic only checked for development ports (3000, 5173, 8080) but not preview ports (4173, 4176). The service worker was active in preview mode and serving corrupted cached content.

## Fixes Applied

### 1. Service Worker Skip for Preview Ports

**File**: `sw.js`

Added preview ports to the skip list:

```javascript
if (
  url.hostname === 'localhost' ||
  url.hostname === '127.0.0.1' ||
  url.hostname === '[::1]' ||
  url.port === '3000' ||
  url.port === '5173' ||
  url.port === '8080' ||
  url.port === '4173' || // Vite preview default port
  url.port === '4176'    // Vite preview alternate port
) {
  // In development/preview, let all requests pass through to the server
  return;
}
```

### 2. Auto-Unregister in Preview Mode

**File**: `js/core/service-worker.js`

Added preview mode detection to auto-unregister service workers:

```javascript
const isPreview = typeof window !== 'undefined' && 
  (window.location.port === '4173' || window.location.port === '4176');

if (isDevelopmentEnv() || isPreview) {
  // Auto-unregister any existing service workers in development/preview
  autoUnregisterServiceWorkers();
  // ...
}
```

### 3. CSS Parsing Errors Fixed

**File**: `css/pages/projects/_project-modal.css`
- Replaced deprecated `image-rendering: -webkit-optimize-contrast` with `image-rendering: crisp-edges`

**File**: `css/easter-egg/easter-egg.css`
- Replaced deprecated `:-webkit-full-screen` with standard `:fullscreen` pseudo-class
- Updated `@supports` selector to use `:fullscreen` instead of `:-webkit-full-screen`

## Expected Results

✅ **No More Corrupted Content**: Service worker skips intercepting in preview mode  
✅ **Files Load Correctly**: CSS and JS files load with correct MIME types  
✅ **No CSS Parsing Errors**: Deprecated CSS properties replaced with standard alternatives  
✅ **Auto-Unregister Works**: Service workers automatically unregistered in preview mode  

## Testing

1. **Run Preview**: `npm run build && npm run preview`
2. **Check Console**: Should see `[Service Worker] ✅ Unregistered in preview mode`
3. **Verify Files Load**: No `NS_ERROR_CORRUPTED_CONTENT` errors
4. **Check CSS**: No parsing errors for `image-rendering` or `-webkit-full-screen`

## Notes

- Preview mode now behaves like development mode (service worker disabled)
- This ensures consistent behavior between dev and preview
- Production builds will still use service worker (when not on localhost)

---

**Status**: ✅ **FIXED**  
**Date**: 2025-01-30

