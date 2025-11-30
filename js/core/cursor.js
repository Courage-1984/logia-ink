/**
 * Cursor Effects Module
 * Handles custom cursor dot effects
 */

export function initCursor() {
  const cursorDot = document.querySelector('.cursor-dot');

  if (!cursorDot) {
    return;
  }

  // Use requestAnimationFrame to batch cursor updates
  let rafId = null;
  let lastX = 0;
  let lastY = 0;

  document.addEventListener(
    'mousemove',
    e => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          cursorDot.style.left = lastX + 'px';
          cursorDot.style.top = lastY + 'px';
          rafId = null;
  });
      }
    },
    { passive: true }
  );

  // Scale cursor on interactive elements (defer query until needed)
  // Use event delegation to reduce event listeners
  document.addEventListener(
    'mouseenter',
    e => {
      if (e.target.matches('a, button, input, textarea, select')) {
      cursorDot.style.transform = 'scale(1.5)';
      }
    },
    { passive: true, capture: true }
  );

  document.addEventListener(
    'mouseleave',
    e => {
      if (e.target.matches('a, button, input, textarea, select')) {
      cursorDot.style.transform = 'scale(1)';
      }
    },
    { passive: true, capture: true }
  );
}
