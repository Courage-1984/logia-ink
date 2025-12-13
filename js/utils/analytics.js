/**
 * Analytics Utilities
 * Centralized tracking functions for Plausible Analytics with Custom Properties
 * Supports both pageview properties and custom event tracking
 */

import { isDevelopmentEnv } from './env.js';

/**
 * Check if Plausible is available
 */
function isPlausibleAvailable() {
  return typeof window !== 'undefined' && typeof window.plausible === 'function';
}

/**
 * Check if a value might contain PII (Personally Identifiable Information)
 * @param {string} value - Value to check
 * @returns {boolean} True if value might contain PII
 */
function mightContainPII(value) {
  if (typeof value !== 'string') return false;
  const lowerValue = value.toLowerCase();

  // Check for email patterns
  if (/@/.test(lowerValue) && /\./.test(lowerValue)) return true;

  // Check for phone patterns (various formats)
  if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(lowerValue)) return true;

  // Check for common PII keywords
  const piiKeywords = ['email', 'phone', 'address', 'ssn', 'passport', 'credit', 'card'];
  return piiKeywords.some(keyword => lowerValue.includes(keyword));
}

/**
 * Validate and sanitize property name
 * @param {string} name - Property name
 * @returns {string|null} Sanitized name or null if invalid
 */
function validatePropertyName(name) {
  if (typeof name !== 'string' || !name.trim()) return null;

  // Plausible limit: 300 characters for property names
  if (name.length > 300) {
    if (isDevelopmentEnv()) {
      console.warn(`[Analytics] Property name exceeds 300 characters: ${name.substring(0, 50)}...`);
    }
    return name.substring(0, 300);
  }

  return name.trim();
}

/**
 * Validate and sanitize property value
 * @param {any} value - Property value
 * @returns {string|null} Sanitized value or null if invalid/PII
 */
function validatePropertyValue(value) {
  // Handle null/undefined
  if (value == null) return '';

  // Convert to string (Plausible only accepts strings, numbers, booleans)
  const stringValue = String(value);

  // Check for PII
  if (mightContainPII(stringValue)) {
    if (isDevelopmentEnv()) {
      console.warn('[Analytics] Blocked potential PII from being sent:', stringValue.substring(0, 50));
    }
    return null; // Block PII
  }

  // Plausible limit: 2000 characters for property values
  if (stringValue.length > 2000) {
    if (isDevelopmentEnv()) {
      console.warn(`[Analytics] Property value exceeds 2000 characters, truncating`);
    }
    return stringValue.substring(0, 2000);
  }

  return stringValue;
}

/**
 * Convert all property values to strings (Plausible requirement)
 * Handles null/undefined by converting to empty string
 * Validates property names and values according to Plausible limits
 * Blocks PII from being sent
 */
function toStringProps(props) {
  if (!props || typeof props !== 'object') {
    return {};
  }

  const entries = Object.entries(props);

  // Plausible limit: 30 properties per event
  if (entries.length > 30) {
    if (isDevelopmentEnv()) {
      console.warn(`[Analytics] Too many properties (${entries.length}), limiting to 30`);
    }
    entries.splice(30);
  }

  const validated = entries
    .map(([key, value]) => {
      const validName = validatePropertyName(key);
      if (!validName) return null;

      const validValue = validatePropertyValue(value);
      if (validValue === null) return null; // PII blocked

      return [validName, validValue];
    })
    .filter(entry => entry !== null);

  return Object.fromEntries(validated);
}

/**
 * Track a custom event with optional custom properties
 * @param {string} eventName - Name of the event to track
 * @param {Object} options - Tracking options
 * @param {Object} options.props - Custom properties to attach to the event
 * @param {string} options.callback - Optional callback function
 */
export function trackEvent(eventName, options = {}) {
  if (!isPlausibleAvailable()) {
    if (isDevelopmentEnv()) {
      console.log(`[Analytics] Would track: ${eventName}`, options);
    }
    return;
  }

  const { props = {}, callback } = options;
  const formattedProps = toStringProps(props);

  try {
    window.plausible(eventName, {
      props: formattedProps,
      callback,
    });
  } catch (error) {
    if (isDevelopmentEnv()) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }
}

/**
 * Track contact form submission
 * @param {Object} formData - Form submission data
 * @param {string} formData.subject - Form subject
 * @param {string} formData.source - Source of form (e.g., 'contact-page', 'header')
 */
export function trackContactFormSubmission(formData = {}) {
  trackEvent('Contact Form Submit', {
    props: {
      subject: formData.subject || 'unknown',
      source: formData.source || 'unknown',
      page: window.location.pathname,
    },
  });
}

/**
 * Track service modal open
 * @param {string} serviceName - Name of the service
 * @param {string} source - Where the modal was opened from (e.g., 'services-page', 'homepage')
 */
export function trackServiceModalOpen(serviceName, source = 'unknown') {
  trackEvent('Service Modal Open', {
    props: {
      service: serviceName,
      source,
      page: window.location.pathname,
    },
  });
}

/**
 * Track CTA button click
 * @param {string} ctaText - Text of the CTA button
 * @param {string} location - Location of the CTA (e.g., 'hero', 'section', 'footer')
 * @param {string} destination - Where the CTA leads (e.g., '/contact', '/pricing')
 */
export function trackCTAClick(ctaText, location = 'unknown', destination = '') {
  trackEvent('CTA Click', {
    props: {
      text: ctaText,
      location,
      destination,
      page: window.location.pathname,
    },
  });
}

/**
 * Track project view
 * @param {string} projectName - Name of the project
 * @param {string} source - Where the project was viewed from
 */
export function trackProjectView(projectName, source = 'unknown') {
  trackEvent('Project View', {
    props: {
      project: projectName,
      source,
      page: window.location.pathname,
    },
  });
}

/**
 * Track pricing page interaction
 * @param {string} action - Action taken (e.g., 'view', 'package-select', 'contact-click')
 * @param {string} packageName - Name of package if applicable
 */
export function trackPricingInteraction(action, packageName = '') {
  trackEvent('Pricing Interaction', {
    props: {
      action,
      package: packageName,
      page: window.location.pathname,
    },
  });
}

/**
 * Track external link click
 * @param {string} url - URL of the external link
 * @param {string} source - Where the link was clicked from
 */
export function trackExternalLink(url, source = 'unknown') {
  trackEvent('External Link Click', {
    props: {
      url: url.replace(/^https?:\/\//, '').split('/')[0], // Extract domain only
      source,
      page: window.location.pathname,
    },
  });
}

/**
 * Get page type based on current pathname
 * @returns {string} Page type (e.g., 'home', 'services', 'contact', 'about')
 */
export function getPageType() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return 'home';
  if (path.includes('/services')) return 'services';
  if (path.includes('/contact')) return 'contact';
  if (path.includes('/about')) return 'about';
  if (path.includes('/projects')) return 'projects';
  if (path.includes('/pricing')) return 'pricing';
  if (path.includes('/seo-services')) return 'seo-services';
  return 'other';
}

/**
 * Get page name for analytics
 * @returns {string} Page name (e.g., 'Home', 'Services', 'Contact')
 */
export function getPageName() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return 'Home';
  if (path.includes('/services')) return 'Services';
  if (path.includes('/contact')) return 'Contact';
  if (path.includes('/about')) return 'About';
  if (path.includes('/projects')) return 'Projects';
  if (path.includes('/pricing')) return 'Pricing';
  if (path.includes('/seo-services')) return 'SEO Services';
  return 'Other';
}

/**
 * Initialize automatic CTA tracking
 * Tracks clicks on buttons with .btn-primary, .btn-secondary, or in .cta-section
 */
export function initCTATracking() {
  if (typeof document === 'undefined') return;

  // Track CTA buttons
  const ctaButtons = document.querySelectorAll(
    '.btn-primary, .btn-secondary, .cta-section .btn, [class*="cta"] .btn'
  );

  ctaButtons.forEach(button => {
    button.addEventListener('click', e => {
      const buttonText = button.textContent?.trim() || 'CTA Button';
      const href = button.getAttribute('href') || '';
      const location = button.closest('.cta-section')
        ? 'cta-section'
        : button.closest('.hero')
        ? 'hero'
        : button.closest('section')
        ? 'section'
        : 'unknown';

      trackCTAClick(buttonText, location, href);
    });
  });
}

