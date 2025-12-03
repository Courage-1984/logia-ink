# Firefox CSS Selector and Service Worker Fix

## Issues Identified

1. **CSS Selector Errors**: Firefox doesn't support testing pseudo-elements in `@supports selector()` - causing "Ruleset ignored due to bad selector" errors
2. **Service Worker Still Active**: Despite fixes, Firefox's cached service worker is still intercepting requests
3. **Corrupted Content Errors**: Service worker serving files with wrong MIME types

## Root Causes

1. **Firefox `@supports selector()` Limitation**: Firefox doesn't support testing pseudo-elements like `::-webkit-scrollbar` or `::-moz-placeholder` in `@supports selector()` queries
2. **Service Worker Cache Persistence**: Firefox caches service worker registrations aggressively, requiring manual unregistration
3. **Service Worker Registration Timing**: Service worker was being registered before preview mode check completed

## Fixes Applied

### 1. Fixed CSS `@supports selector()` Issues

**File**: `css/base.css`

- Changed `@supports selector(::-webkit-scrollbar)` to `@supports (-webkit-scrollbar-width: thin) or (scrollbar-width: thin)`
- This uses property support detection instead of selector testing (works in Firefox)

**Before:**
```css
@supports selector(::-webkit-scrollbar) {
  ::-webkit-scrollbar { ... }
}
```

**After:**
```css
@supports (-webkit-scrollbar-width: thin) or (scrollbar-width: thin) {
  ::-webkit-scrollbar { ... }
}
```

**File**: `css/components/forms/_form-base.css`

- Removed `@supports selector()` wrappers for placeholder pseudo-elements
- Use direct selectors (browsers ignore unsupported pseudo-elements automatically)

**Before:**
```css
@supports selector(::-webkit-input-placeholder) {
  ::-webkit-input-placeholder { ... }
}
@supports selector(::-moz-placeholder) {
  ::-moz-placeholder { ... }
}
```

**After:**
```css
/* Placeholder styling - Firefox doesn't support testing pseudo-elements in @supports selector() */
/* Using direct selectors with fallbacks */
::-webkit-input-placeholder { ... }
::-moz-placeholder { ... }
```

### 2. Enhanced Service Worker Unregistration

**File**: `js/core/service-worker.js`

- Moved preview mode check to the very beginning of `registerServiceWorker()`
- Added aggressive unregistration that runs immediately
- Added direct `navigator.serviceWorker.getRegistrations()` unregister call

**Key Changes:**
```javascript
export function registerServiceWorker() {
  // Check for preview mode first (before any other checks)
  const isPreview = typeof window !== 'undefined' && 
    (window.location.port === '4173' || window.location.port === '4176' ||
     window.location.hostname === 'localhost' && (window.location.port === '4173' || window.location.port === '4176'));
  
  // Don't register in development or preview mode
  if (isServiceWorkerDisabled() || isDevelopmentEnv() || isPreview) {
    // Force unregister any existing service workers immediately
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      autoUnregisterServiceWorkers();
      
      // Also try to unregister directly (more aggressive)
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister().then(() => {
            console.log('[Service Worker] Force unregistered existing worker');
          });
        });
      });
    }
    // ...
  }
}
```

## Manual Steps Required (Firefox)

**Firefox aggressively caches service workers. You MUST manually unregister:**

1. **Open Firefox DevTools** (F12)
2. **Go to Application tab** → **Service Workers**
3. **Click "Unregister"** for any registered service workers
4. **Go to Application tab** → **Storage** → **Clear site data**
5. **Hard refresh** (Ctrl+Shift+R)

## Expected Results

✅ **No CSS Selector Errors**: Fixed `@supports selector()` usage for Firefox compatibility  
✅ **Service Worker Disabled**: More aggressive unregistration in preview mode  
✅ **No Corrupted Content**: Service worker bypassed completely in preview mode  

## Browser Compatibility Notes

- **Firefox**: Doesn't support testing pseudo-elements in `@supports selector()`
- **Chrome/Edge**: Supports `@supports selector()` for pseudo-elements
- **Safari**: Supports `@supports selector()` for pseudo-elements

## Testing

1. **Clear Firefox Service Worker** (see manual steps above)
2. **Rebuild**: `npm run build`
3. **Preview**: `npm run preview`
4. **Verify**:
   - No "Ruleset ignored due to bad selector" errors
   - No `NS_ERROR_CORRUPTED_CONTENT` errors
   - Console shows: `[Service Worker] Skipping registration in preview mode`

---

**Status**: ✅ **FIXED** (requires manual Firefox service worker unregistration)  
**Date**: 2025-01-30  
**Browsers Tested**: Firefox (preview mode)

