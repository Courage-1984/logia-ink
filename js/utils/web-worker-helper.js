/**
 * Web Worker Helper
 * Utilities for offloading heavy computations to Web Workers
 * Improves INP by preventing blocking of main thread
 */

/**
 * Check if Web Workers are supported
 */
export function isWebWorkerSupported() {
  return typeof Worker !== 'undefined';
}

/**
 * Create a Web Worker from a function string
 * @param {Function} workerFunction - Function to run in worker
 * @returns {Worker|null} Worker instance or null if not supported
 */
export function createWorkerFromFunction(workerFunction) {
  if (!isWebWorkerSupported()) {
    return null;
  }

  const functionString = workerFunction.toString();
  const blob = new Blob([`(${functionString})()`], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  return new Worker(workerUrl);
}

/**
 * Create a Web Worker from a URL
 * @param {string} workerUrl - URL to worker script
 * @returns {Worker|null} Worker instance or null if not supported
 */
export function createWorkerFromUrl(workerUrl) {
  if (!isWebWorkerSupported()) {
    return null;
  }

  try {
    return new Worker(workerUrl);
  } catch (error) {
    console.warn('[Web Worker] Failed to create worker:', error);
    return null;
  }
}

/**
 * Execute a task in a Web Worker with promise-based API
 * @param {Worker} worker - Worker instance
 * @param {Object} data - Data to send to worker
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 * @returns {Promise} Promise that resolves with worker response
 */
export function executeInWorker(worker, data, timeout = 30000) {
  return new Promise((resolve, reject) => {
    if (!worker) {
      reject(new Error('Worker not available'));
      return;
    }

    const timeoutId = setTimeout(() => {
      worker.terminate();
      reject(new Error('Worker timeout'));
    }, timeout);

    const messageHandler = event => {
      clearTimeout(timeoutId);
      worker.removeEventListener('message', messageHandler);
      worker.removeEventListener('error', errorHandler);
      resolve(event.data);
    };

    const errorHandler = error => {
      clearTimeout(timeoutId);
      worker.removeEventListener('message', messageHandler);
      worker.removeEventListener('error', errorHandler);
      reject(error);
    };

    worker.addEventListener('message', messageHandler);
    worker.addEventListener('error', errorHandler);
    worker.postMessage(data);
  });
}

