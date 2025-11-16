/**
 * Dynamic Resource Hints
 * Prefetch pages on link hover/focus instead of static prefetch for all pages
 * More efficient resource loading based on user intent
 */

/**
 * Initialize dynamic prefetching for navigation links
 */
export function initDynamicPrefetch() {
  // Get all internal navigation links
  const links = document.querySelectorAll('a[href]');
  const prefetchedUrls = new Set();

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Only prefetch internal links (same origin)
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // Don't prefetch current page
    } catch (e) {
      // Invalid URL, skip
      return;
    }

    // Prefetch on hover (mouseenter) or focus
    const prefetchPage = () => {
      // Only prefetch once per URL
      if (prefetchedUrls.has(href)) return;
      prefetchedUrls.add(href);

      const linkElement = document.createElement('link');
      linkElement.rel = 'prefetch';
      linkElement.href = href;
      linkElement.as = 'document';
      document.head.appendChild(linkElement);
    };

    // Use passive listeners for better performance
    link.addEventListener('mouseenter', prefetchPage, { once: true, passive: true });
    link.addEventListener('focus', prefetchPage, { once: true, passive: true });
  });
}

