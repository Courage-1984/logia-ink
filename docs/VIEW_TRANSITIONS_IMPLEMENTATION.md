# View Transitions API Implementation Blueprint

## Feature Scope

### Problem Statement
Current page transitions use `window.location.href` which causes:
- Full browser reload/flash
- Browser UI flashing during navigation
- Poor user experience with jarring transitions

### Solution
Implement View Transitions API for smooth, native browser transitions that:
- Eliminate browser UI flashing
- Provide smooth cross-fade transitions
- Maintain Three.js hero backgrounds
- Prevent double animations
- Gracefully degrade for unsupported browsers

## Component Hierarchy

### Files to Modify
1. **CSS Files:**
   - `css/base.css` - Remove old transition classes, add View Transitions styles
   - All HTML pages - Add `@view-transition` CSS rule

2. **JavaScript Files:**
   - `js/core/page-transitions.js` - Replace `window.location.href` with View Transitions API
   - `js/main.js` - Ensure Three.js initializes after transition completes

3. **HTML Files:**
   - All entry pages (index.html, about.html, services.html, etc.) - Add CSS rule

## State Design

### View Transition States
1. **Initial State:** Page loaded, no transition active
2. **Transition Start:** User clicks link, `document.startViewTransition()` called
3. **Snapshot Capture:** Old page snapshots captured
4. **Navigation:** New page loads
5. **Transition Ready:** New page snapshots captured, animation ready
6. **Transition Complete:** Animation finished, Three.js initialized

### Data Flow
```
User Click → startViewTransition() → Navigation → New Page Load → 
Transition Ready → Three.js Init → Transition Finished
```

## API Integration

### View Transitions API Methods
- `document.startViewTransition(callback)` - Start transition
- `ViewTransition.ready` - Promise when animation ready
- `ViewTransition.finished` - Promise when animation complete
- `ViewTransition.updateCallbackDone` - Promise when DOM updated

### CSS API
- `@view-transition { navigation: auto; }` - Enable MPA transitions
- `::view-transition-old(root)` - Old page snapshot
- `::view-transition-new(root)` - New page snapshot

## Risks & Tradeoffs

### Browser Support
- **Supported:** Chrome 111+, Edge 111+, Opera 97+
- **Not Supported:** Firefox, Safari (as of 2024)
- **Mitigation:** Feature detection with fallback to current implementation

### Three.js Initialization
- **Risk:** Three.js may initialize before transition completes, causing visual glitches
- **Mitigation:** Initialize Three.js in `transition.finished` promise

### Double Animations
- **Risk:** Old CSS transitions may conflict with View Transitions
- **Mitigation:** Remove old transition classes, use View Transitions exclusively

### Performance
- **Risk:** View Transitions may add overhead
- **Mitigation:** Native browser implementation is optimized, minimal overhead

## Implementation Steps

1. Add `@view-transition` CSS rule to all HTML pages
2. Update `page-transitions.js` to use View Transitions API
3. Remove old CSS transition classes from `base.css`
4. Ensure Three.js initializes after transition completes
5. Add feature detection and fallback
6. Test across browsers and devices

## Testing Checklist

- [ ] Transitions work in Chrome/Edge
- [ ] Fallback works in Firefox/Safari
- [ ] Three.js backgrounds load correctly
- [ ] No double animations
- [ ] No browser UI flashing
- [ ] Mobile transitions work
- [ ] Back/forward navigation works
- [ ] Direct URL navigation works

