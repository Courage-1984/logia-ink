# Firefox Preview Mode Fix

## Issues Identified

1. **Service Worker Still Active**: Despite skip logic, Firefox was still intercepting requests in preview mode, causing `NS_ERROR_CORRUPTED_CONTENT` errors
2. **CSS Selector Errors**: Firefox was rejecting `@supports selector(:-moz-full-screen)` - this is redundant since Firefox supports standard `:fullscreen`
3. **MIME Type Errors**: Service worker was serving files with wrong MIME types, causing "disallowed MIME type" errors

## Root Causes

1. **Service Worker Caching**: Firefox had cached the service worker registration, and the skip logic wasn't being applied early enough
2. **Redundant CSS Selectors**: `:-moz-full-screen` is deprecated - Firefox supports standard `:fullscreen` since version 64
3. **Service Worker Install Event**: The install event was still running in preview mode, potentially caching corrupted content

## Fixes Applied

### 1. Enhanced Service Worker Skip Logic

**File**: `sw.js`

- Created `isDevOrPreview()` helper function for consistent detection
- Applied skip logic to both `install` and `fetch` events
- Added preview ports (4173, 4176) to skip list

```javascript
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
```

### 2. Removed Redundant CSS Selectors

**File**: `css/easter-egg/easter-egg.css`

- Removed `@supports selector(:-moz-full-screen)` blocks (2 instances)
- Firefox supports standard `:fullscreen` since version 64 (2018)
- The `:fullscreen` selectors already cover Firefox

**Before:**
```css
@supports selector(:-moz-full-screen) {
  :-moz-full-screen .milky-way-menu { ... }
}
```

**After:**
```css
/* Firefox supports :fullscreen (no need for :-moz-full-screen) */
/* Removed @supports selector(:-moz-full-screen) - Firefox supports standard :fullscreen */
```

### 3. Service Worker Install Event Fix

**File**: `sw.js`

- Updated install event to use `isDevOrPreview()` helper
- Prevents any caching in preview mode

## Expected Results

✅ **No More Corrupted Content**: Service worker completely bypassed in preview mode  
✅ **No CSS Selector Errors**: Removed redundant `:-moz-full-screen` selectors  
✅ **Correct MIME Types**: Files load directly from server, not service worker cache  
✅ **Firefox Compatibility**: Uses standard `:fullscreen` selector (supported since Firefox 64)  

## Testing

1. **Clear Firefox Cache**: 
   - Open Firefox DevTools → Application → Service Workers → Unregister
   - Clear all caches in Application → Storage → Clear site data
   
2. **Rebuild and Preview**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Verify**:
   - No `NS_ERROR_CORRUPTED_CONTENT` errors
   - No "Ruleset ignored due to bad selector" errors
   - No "disallowed MIME type" errors
   - Files load correctly from server

## Browser Compatibility

- **Firefox 64+**: Supports standard `:fullscreen` (no vendor prefix needed)
- **Chrome/Edge**: Supports standard `:fullscreen`
- **Safari**: Uses `:-webkit-full-screen` (kept for Safari compatibility)

## Notes

- The service worker is now completely disabled in preview mode (no install, no fetch interception)
- Firefox's service worker cache can persist across sessions - manual unregistration may be needed
- Standard `:fullscreen` selector works in all modern browsers (Firefox 64+, Chrome 15+, Safari 6.1+)

---

**Status**: ✅ **FIXED**  
**Date**: 2025-01-30  
**Browsers Tested**: Firefox (preview mode)

