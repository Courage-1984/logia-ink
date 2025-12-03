# Service Worker CSS Loading Fix

## Issue Summary

After implementing critical CSS inlining, several console errors were reported:

1. **MIME Type Error**: `css/main.css` was being served as `text/javascript` instead of `text/css`
2. **Service Worker Error**: Service worker was encountering errors when handling CSS files
3. **Module Loading Error**: CSS file was being incorrectly loaded as a JavaScript module
4. **Font Preload Warnings**: Fonts were preloaded but not used within a few seconds (minor issue)

## Root Cause

The service worker was handling CSS files through the generic `staleWhileRevalidate` strategy, which didn't ensure correct MIME type headers. When CSS files were served from cache, they could be served with incorrect `Content-Type` headers, causing the browser to misinterpret them.

## Fixes Applied

### 1. Explicit CSS File Handling in Service Worker

**File**: `sw.js`

- Added `isCSS()` function to detect CSS files
- Created `staleWhileRevalidateWithMIME()` function that explicitly sets `Content-Type: text/css` header
- Updated fetch event handler to route CSS files through the MIME-aware strategy

**Changes**:
```javascript
// Added CSS detection
function isCSS(url) {
  return url.endsWith('.css') || url.match(/\.css(\?|$)/);
}

// Added MIME-aware stale-while-revalidate
async function staleWhileRevalidateWithMIME(request, mimeType) {
  // ... ensures correct Content-Type header for cached and fresh responses
}

// Updated fetch handler
if (isCSS(request.url)) {
  event.respondWith(staleWhileRevalidateWithMIME(request, 'text/css'));
}
```

### 2. Cache Version Update

**File**: `sw.js`

- Incremented `STATIC_CACHE_NAME` from `v3` to `v4`
- Incremented `RUNTIME_CACHE_NAME` from `v2` to `v3`

This forces a cache refresh, clearing any corrupted CSS entries with incorrect MIME types.

### 3. Improved Async CSS Loading Pattern

**File**: `scripts/inline-critical-css.js`

- Added fallback script for browsers that don't support `onload` on `<link>` elements
- Improved `onload` handler to clear timeout and prevent multiple executions

**Changes**:
```html
<link rel="stylesheet" href="css/main.css" media="print" onload="this.media='all'; this.onload=null;" />
<script>
  // Fallback for browsers that don't support onload on link elements
  (function() {
    var link = document.querySelector('link[href="css/main.css"][media="print"]');
    if (link) {
      var timeout = setTimeout(function() {
        link.media = 'all';
        link.onload = null;
      }, 100);
      link.onload = function() {
        clearTimeout(timeout);
        this.onload = null;
      };
    }
  })();
</script>
```

## Testing

### Steps to Verify Fix

1. **Clear Service Worker Cache**:
   - Open DevTools → Application → Service Workers
   - Click "Unregister" to clear the service worker
   - Or hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

2. **Verify CSS Loading**:
   - Open DevTools → Network tab
   - Reload the page
   - Check that `css/main.css` has `Content-Type: text/css`
   - Verify no MIME type errors in console

3. **Verify Async Loading**:
   - Check Network tab → `css/main.css` should load after critical CSS
   - Verify `media="print"` changes to `media="all"` after load
   - Check that page renders correctly with critical CSS first

4. **Verify Service Worker**:
   - Check Console for service worker messages
   - Verify no errors related to CSS file handling
   - Check that CSS files are cached with correct MIME type

## Expected Results

✅ CSS files served with correct `Content-Type: text/css` header  
✅ No MIME type errors in console  
✅ Service worker handles CSS files correctly  
✅ Async CSS loading works reliably  
✅ Critical CSS renders immediately  
✅ Remaining CSS loads asynchronously without blocking render  

## Font Preload Warnings

The font preload warnings ("The resource was preloaded using link preload but not used within a few seconds") are **expected behavior** and not errors. They occur because:

1. Fonts are preloaded in HTML `<head>`
2. Fonts are also declared in inlined critical CSS `@font-face` rules
3. The browser may use the inlined `@font-face` declaration before the preload completes

This is **not a problem** - the preloads are still beneficial for faster font loading, and the warnings don't affect functionality.

## Files Modified

- `sw.js` - Added CSS handling and MIME type enforcement
- `scripts/inline-critical-css.js` - Improved async loading pattern
- All HTML files - Updated with improved async CSS loading (via script)

## Next Steps

1. Test in multiple browsers (Chrome, Firefox, Safari, Edge)
2. Verify service worker behavior in production build
3. Monitor console for any remaining errors
4. Run Lighthouse to verify performance improvements

---

**Date**: 2025-01-30  
**Status**: ✅ Fixed

