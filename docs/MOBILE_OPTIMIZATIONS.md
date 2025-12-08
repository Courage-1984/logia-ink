# Mobile Optimizations Guide

## Overview

This guide documents the mobile-specific optimizations implemented to improve performance and reduce glitchy/fast animations on mobile devices. Heavy animations, WebGL effects, and complex CSS animations are disabled or reduced on mobile devices to ensure smooth performance.

**Important:** Animation duration optimizations are **selective** - only UI/interactive animations are sped up on mobile (0.3s), while ambient background animations (hero backgrounds, decorative effects) preserve their intended slow durations (26s, 32s, etc.) for a natural, non-jarring experience.

## Mobile Detection

The site uses a mobile detection utility (`js/utils/env.js`) that combines:
- User agent detection (Android, iOS, etc.)
- Screen size detection (viewport width ≤ 768px)
- Touch capability detection

```javascript
import { isMobileDevice } from './utils/env.js';

if (isMobileDevice()) {
  // Mobile-specific code
}
```

## Disabled Features on Mobile

### 1. Three.js Hero Backgrounds

**Location:** `js/core/three-hero.js`

All Three.js hero background animations are disabled on mobile devices:
- **Index page:** Rotating particles background
- **Services page:** Floating geometric shapes background
- **Projects page:** Torus grid with scroll parallax

**Implementation:**
```javascript
async function initThreeJSHero() {
  // Disable Three.js on mobile devices for better performance
  if (isMobileDevice()) {
    return;
  }
  // ... Three.js initialization
}
```

**Rationale:** WebGL rendering is resource-intensive on mobile devices and can cause performance issues, battery drain, and glitchy animations.

### 2. Star Twinkling Effects

**Location:** `js/easter-egg/star-field.js`

Star twinkling in the galaxy easter egg is reduced on mobile:
- Twinkling speed reduced to 30% of desktop speed
- Twinkling intensity reduced from 30% to 15%

**Implementation:**
```javascript
export function updateStarTwinkling(starField, time, deltaTime = 0.016, isMobile = false) {
  const speedMultiplier = isMobile ? 0.3 : 1.0;
  const twinkleIntensity = isMobile ? 0.15 : 0.3;
  // ... twinkling logic
}
```

**Rationale:** Reduces GPU load while maintaining visual appeal.

### 3. CTA Section Animations

**Location:** `css/components/cta.css`

Two animations are disabled on mobile:
- **Portal Glow:** Animated border effect (`portalGlow` animation)
- **Fluid Gradient:** Animated gradient overlay (`fluidGradient` animation)

**Implementation:**
```css
@media (max-width: 768px) {
  .portal-glow {
    animation: none;
  }
  
  .cta-section::after {
    animation: none;
    background-size: 100% 100%;
  }
}
```

**Rationale:** Reduces repaints and improves scroll performance on mobile.

### 4. Hero Ripple Wave Animation

**Location:** `css/components/hero.css`

The ripple wave animation on hero backgrounds is disabled on mobile.

**Implementation:**
```css
@media (max-width: 768px) {
  .hero-background::before {
    animation: none !important;
  }
}
```

**Rationale:** Eliminates unnecessary background animations that can cause performance issues.

### 5. Selective Animation Duration Optimization

**Location:** `css/utils/_performance-optimizations.css`

**Problem Fixed (2025-01-30):** Previously, a global override forced ALL animations to 0.3s on mobile, making slow ambient animations (hero backgrounds at 26-32s) appear fast and jarring.

**Solution:** Selective optimization that only speeds up UI/interactive animations while preserving ambient background animations.

**Implementation:**
```css
@media (max-width: 768px) {
  /* Only UI/interactive animations are optimized */
  .btn,
  .service-card,
  .project-card,
  .modal,
  .toast,
  .fade-in-up,
  .scroll-reveal-3d,
  .text-reveal,
  .skeleton {
    animation-duration: 0.3s !important;
    transition-duration: 0.2s !important;
  }

  /* Ambient animations preserve original durations */
  /* .liquid-background, .hero-background, .portal-glow, etc. */
}
```

**Rationale:** 
- UI animations should be fast (0.3s) for responsive feel
- Ambient background animations should remain slow (26-32s) for natural, subtle effect
- Prevents jarring fast animations on decorative elements
- Maintains performance benefits while preserving UX

**Affected Animations:**
- ✅ **Optimized (0.3s):** Buttons, cards, modals, toasts, scroll reveals, fade-ins
- ✅ **Preserved (original):** Hero liquid backgrounds (26s, 32s, 30s), CTA portal glow (8s), fluid gradients (15s)

## Performance Benefits

### Before Optimizations
- Glitchy Three.js animations on mobile
- Fast/uncontrollable star twinkling
- CTA animations causing scroll jank
- Hero ripple animations consuming resources

### After Optimizations
- ✅ Smooth scrolling on mobile
- ✅ Reduced battery drain
- ✅ Better frame rates
- ✅ No glitchy animations
- ✅ Improved user experience

## Testing

E2E tests validate mobile optimizations in `tests/e2e/mobile-optimizations.spec.js`:

- Three.js hero backgrounds disabled on mobile
- Three.js services backgrounds disabled on mobile
- Three.js projects backgrounds disabled on mobile
- CTA portal glow animation disabled on mobile
- CTA fluid gradient animation disabled on mobile
- Hero ripple wave animation disabled on mobile
- Desktop functionality preserved (Three.js and animations work on desktop)

Run tests:
```bash
npm run test:e2e:only -- tests/e2e/mobile-optimizations.spec.js
```

## Breakpoint

Mobile optimizations apply at **max-width: 768px**, which aligns with the responsive design breakpoint system.

## Best Practices

1. **Always check mobile before initializing heavy effects:**
   ```javascript
   if (isMobileDevice()) {
     return; // Skip heavy initialization
   }
   ```

2. **Use CSS media queries for animation disabling:**
   ```css
   @media (max-width: 768px) {
     .animated-element {
       animation: none;
     }
   }
   ```

3. **Reduce rather than disable when possible:**
   - For effects that enhance UX, reduce intensity/speed rather than disabling completely
   - Example: Star twinkling reduced to 30% speed instead of disabled

4. **Test on real devices:**
   - E2E tests use viewport sizes, but real device testing is recommended
   - Different mobile devices have varying GPU capabilities

## Future Enhancements

Potential future optimizations:
- Adaptive quality based on device capabilities (using `navigator.hardwareConcurrency`)
- Frame rate limiting on mobile (target 30fps instead of 60fps)
- Progressive enhancement: load effects after page is interactive
- Battery level detection: further reduce effects on low battery

## Related Files

- `js/utils/env.js` - Mobile detection utility
- `js/core/three-hero.js` - Three.js hero backgrounds
- `js/easter-egg/star-field.js` - Star twinkling effects
- `css/components/cta.css` - CTA section animations
- `css/components/hero.css` - Hero section animations
- `css/utils/_performance-optimizations.css` - General mobile performance optimizations (selective animation durations)
- `css/utils/responsive.css` - Responsive breakpoints and optimizations
- `css/utils/animations.css` - Animation utilities and mobile-specific overrides
- `tests/e2e/mobile-optimizations.spec.js` - E2E tests

## Changelog

**2025-01-30:** Fixed animation duration issue on mobile
- Removed global `* { animation-duration: 0.3s !important; }` override
- Implemented selective optimization targeting only UI/interactive animations
- Preserved ambient background animation durations (26s, 32s, etc.)
- See `docs/ANIMATION_DURATION_FIX_REPORT.md` for detailed analysis

