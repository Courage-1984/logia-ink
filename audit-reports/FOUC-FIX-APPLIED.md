# FOUC Fix Applied

**Date:** 2025-01-27  
**Status:** ✅ **FIXES APPLIED**

## Problem

Heavy FOUC (Flash of Unstyled Content) on all pages after inlining critical CSS.

## Root Causes Identified

### 1. ❌ Missing @font-face Declarations

**Problem:** Critical CSS didn't include `@font-face` declarations, so fonts weren't loading until async CSS loaded, causing FOUC.

**Fix:** Added critical `@font-face` declarations to `critical.css`:
- Orbitron Regular (400) - `font-display: swap`
- Rajdhani Regular (400) - `font-display: swap`

### 2. ❌ Incorrect Font Paths When Inlined

**Problem:** Font paths in `critical.css` used `../assets/fonts/...` which is correct for the CSS file location, but when inlined in HTML at root, paths should be `./assets/fonts/...`.

**Fix:** Updated inline script to automatically fix font paths when inlining:
```javascript
// Fix font paths when inlining (change ../assets to ./assets for HTML at root)
minifiedCSS = minifiedCSS.replace(/url\(['"]?\.\.\/assets\//g, "url('./assets/");
```

### 3. ❌ Missing .sr-only Class

**Problem:** `.sr-only` class used by ARIA live region wasn't in critical CSS, causing layout issues.

**Fix:** Added `.sr-only` class to `critical.css`:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 4. ❌ Duplicate Critical CSS Blocks

**Problem:** Script ran multiple times, creating duplicate critical CSS blocks in HTML.

**Fix:** Updated script to remove all existing critical CSS blocks before adding new ones.

## Changes Made

### `css/critical.css`

1. ✅ Added `@font-face` declarations for Orbitron and Rajdhani Regular
2. ✅ Added `.sr-only` class for ARIA live region

### `scripts/inline-critical-css.js`

1. ✅ Added font path fixing when inlining (`../assets` → `./assets`)
2. ✅ Improved duplicate removal logic
3. ✅ Better cleanup of existing critical CSS blocks

## Verification

✅ **Font Paths:** Fixed to `./assets/fonts/...` when inlined  
✅ **@font-face:** Included in critical CSS  
✅ **.sr-only:** Added to critical CSS  
✅ **Duplicates:** Removed from all HTML files  
✅ **Build:** Compiles successfully  

## Expected Results

After these fixes, FOUC should be eliminated because:

1. ✅ **Fonts load immediately** - `@font-face` declarations are inlined
2. ✅ **Font paths are correct** - Adjusted for HTML root location
3. ✅ **All critical styles present** - Including `.sr-only` for accessibility
4. ✅ **No duplicates** - Clean, single critical CSS block per page

## Testing Recommendations

1. **Hard Refresh** - Clear cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. **Check Network Tab** - Verify fonts load from correct paths
3. **Visual Check** - Verify no FOUC on page load
4. **Lighthouse** - Run performance audit to verify improvements

## If FOUC Persists

If FOUC still occurs, consider:

1. **Check Browser Cache** - Clear cache completely
2. **Verify Font Files** - Ensure font files exist at `./assets/fonts/...`
3. **Check Console** - Look for 404 errors on font files
4. **Network Throttling** - Test on slow 3G to see if async CSS is too slow
5. **Add More Styles** - Consider adding more above-the-fold styles to critical CSS

---

**Report Generated:** 2025-01-27  
**Status:** ✅ Complete - FOUC fixes applied

