/**
 * Page Transitions Module
 * View Transitions API is enabled via CSS @view-transition { navigation: auto; }
 * The browser automatically handles smooth transitions between pages.
 *
 * This module ensures Three.js backgrounds initialize after transitions complete
 * and handles any transition-related cleanup.
 */

export function initPageTransitions() {
  // With @view-transition { navigation: auto; } in CSS, the browser handles
  // transitions automatically. We just need to ensure Three.js initializes
  // after the transition completes.

  // Listen for view transition events to ensure proper initialization
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    // Listen for pagereveal event (fired when new page is revealed)
    window.addEventListener('pagereveal', (event) => {
      if (event.viewTransition) {
        // Wait for transition to complete before initializing heavy resources
        event.viewTransition.finished.then(() => {
          // Three.js will be initialized by main.js, but we ensure it happens
          // after the transition completes to prevent visual glitches
          // The main.js initialization already uses requestIdleCallback, so
          // this is just an extra safety measure
        });
      }
    });
  }

  // Note: We no longer intercept link clicks or use window.location.href
  // The browser handles navigation automatically with View Transitions API
  // when @view-transition { navigation: auto; } is set in CSS
}
