# 🚨 URGENT: FOUC Fix - Service Worker Issue

## IMMEDIATE ACTION REQUIRED

You have an **old service worker** registered that's corrupting CSS files. This must be unregistered before the fixes will work.

## Step 1: Unregister Service Worker (DO THIS NOW!)

**Open browser console (F12)** and paste this:

```javascript
(async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`Found ${registrations.length} service worker(s)`);
    
    for (const registration of registrations) {
      const unregistered = await registration.unregister();
      console.log(`✅ Unregistered: ${unregistered}`);
    }
    
    // Clear all caches
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`✅ Deleted cache: ${cacheName}`);
    }
    
    console.log('🎉 Service workers cleared! Now reload: Ctrl+Shift+R');
  } else {
    console.log('ℹ️ Service workers not supported');
  }
})();
```

**OR use DevTools:**
1. F12 → **Application** tab
2. **Service Workers** → Click **Unregister**
3. **Storage** → **Clear site data**
4. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## Step 2: Verify Fix

After unregistering:
1. Hard refresh (Ctrl+Shift+R)
2. Check Network tab → `css/main.css` should have `Content-Type: text/css`
3. No MIME type errors in console
4. Page should render with styles immediately (no FOUC)

## What Was Fixed

### 1. Service Worker Development Skip ✅
- Service worker now skips intercepting requests on `localhost:3000`
- Prevents interference with Vite dev server

### 2. CSS MIME Type Enforcement ✅
- Service worker now ensures CSS files have `Content-Type: text/css`
- Prevents MIME type errors

### 3. Service Worker Registration Skip ✅
- Already implemented - service worker doesn't register in development

## Why You Still See FOUC

The **old service worker is still active** from a previous session. It's:
- Serving CSS with wrong MIME type (`text/javascript` instead of `text/css`)
- Corrupting CSS responses
- Causing CSS to fail to load

**You MUST unregister it first** (see Step 1 above).

## After Unregistering

Once you unregister the service worker:
- ✅ CSS will load correctly
- ✅ No MIME type errors
- ✅ No FOUC
- ✅ Page renders with styles immediately

## If Issues Persist

If FOUC still occurs after unregistering:

1. **Clear browser cache completely**
2. **Check Network tab** - verify CSS loads with correct MIME type
3. **Check Console** - should see: `[Service Worker] Skipping registration in development mode`
4. **Verify critical CSS** is inlined in `<head>` (should see `<style>` tag)

---

**Status**: ⚠️ **REQUIRES YOUR ACTION** - Unregister service worker first!  
**Priority**: 🔴 **CRITICAL**

