/**
 * Performance Monitoring Utilities
 * Tracks Core Web Vitals and page load performance, reporting to Plausible
 */

import { onCLS, onINP, onLCP } from 'web-vitals';
import { isDevelopmentEnv } from './env.js';

const METRIC_PRECISION = {
  CLS: 4,
  INP: 0,
  LCP: 0,
};

const METRIC_LABELS = {
  CLS: 'CLS (Cumulative Layout Shift)',
  INP: 'INP (Interaction to Next Paint)',
  LCP: 'LCP (Largest Contentful Paint)',
};

function canAccessWindow() {
  return typeof window !== 'undefined';
}

function isPlausibleAvailable() {
  return canAccessWindow() && typeof window.plausible === 'function';
}

function toStringProps(props) {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [key, value == null ? '' : String(value)])
  );
}

function formatMetricValue(metric) {
  const precision = METRIC_PRECISION[metric.name] ?? 2;
  return metric.value.toFixed(precision);
}

function reportMetric(metric) {
  const formattedValue = formatMetricValue(metric);
  const label = METRIC_LABELS[metric.name] ?? metric.name;

  if (isDevelopmentEnv()) {
    console.log(`📊 ${label}: ${formattedValue}${metric.name === 'CLS' ? '' : ' ms'}`);
  }

  if (!isDevelopmentEnv() && isPlausibleAvailable()) {
    window.plausible(`Web Vital - ${metric.name}`, {
      props: toStringProps({
        value: formattedValue,
        rating: metric.rating,
        navigationType: metric.navigationType ?? 'unknown',
        id: metric.id,
        path: window.location.pathname,
      }),
    });
  }
}

/**
 * Track Core Web Vitals (LCP, CLS, INP)
 */
export function trackWebVitals() {
  if (!canAccessWindow()) {
    return;
  }

  onLCP(reportMetric);
  onCLS(reportMetric);
  onINP(reportMetric);
}

/**
 * Track page load performance
 */
export function trackPageLoad() {
  if (!canAccessWindow() || !window.performance) {
    return;
  }

  window.addEventListener('load', () => {
    // Wait a bit for all metrics to be available
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0];

      if (!navigation) {
        return;
      }

      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domComplete - navigation.domInteractive,
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
      };

      if (isDevelopmentEnv()) {
        console.log('📊 Page Load Metrics:', metrics);
      }

      if (!isDevelopmentEnv() && isPlausibleAvailable()) {
        window.plausible('Page Load Metrics', {
          props: toStringProps({
            path: window.location.pathname,
            dns: Math.round(metrics.dns),
            tcp: Math.round(metrics.tcp),
            request: Math.round(metrics.request),
            response: Math.round(metrics.response),
            domProcessing: Math.round(metrics.domProcessing),
            loadTime: Math.round(metrics.loadTime),
          }),
        });
      }
    }, 1000);
  });
}

/**
 * Initialize performance tracking
 */
export function initPerformanceTracking() {
  trackWebVitals();
  trackPageLoad();
}

