import { isDevelopmentEnv } from '../utils/env.js';

let runtimeModulePromise = null;
let triggersInitialized = false;

function loadRuntimeModule() {
  if (!runtimeModulePromise) {
    runtimeModulePromise = import('./runtime.js');
  }
  return runtimeModulePromise;
}

export function initEasterEgg() {
  if (triggersInitialized) {
    return;
  }

  triggersInitialized = true;

  if (window.easterEggInitialized) {
    return;
  }

  window.easterEggInitialized = true;

  setupLogoTrigger();
  setupFooterTrigger();
}

function setupLogoTrigger() {
  const logo = document.querySelector('.logo');
  if (!logo || logo.dataset.easterEggBound === 'true') {
    return;
  }

  logo.dataset.easterEggBound = 'true';

  let logoClickCount = 0;
  let logoClickTimer = null;
    const logoLink = logo.querySelector('a');

    logo.addEventListener(
      'click',
    event => {
      event.preventDefault();
      event.stopPropagation();

      logoClickCount += 1;
        clearTimeout(logoClickTimer);

        if (logoClickCount === 1) {
          logo.classList.add('easter-egg-ready');
        }

        if (logoClickCount >= 3) {
          logoClickCount = 0;
          logo.classList.remove('easter-egg-ready');
          clearTimeout(logoClickTimer);
        requestEasterEggActivation();
        return;
      }

      logoClickTimer = window.setTimeout(() => {
        // Only reset the counter and remove the visual indicator after 2 seconds
        logoClickCount = 0;
        logo.classList.remove('easter-egg-ready');
        // NOTE: If a redirect/link is desired for non-activation,
        // it should happen unconditionally after a non-activation timeout,
        // not only on a pending click count of 2.
      }, 2000);
      },
      true
  );
  }

function setupFooterTrigger() {
  const triggerText = document.querySelector('.footer-easter-egg-trigger');
  if (!triggerText || triggerText.dataset.easterEggBound === 'true') {
    return;
  }

  triggerText.dataset.easterEggBound = 'true';

  triggerText.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    requestEasterEggActivation();
  });
}

function requestEasterEggActivation() {
  loadRuntimeModule()
    .then(module => {
      if (typeof module.activateEasterEgg === 'function') {
        module.activateEasterEgg();
      }
    })
    .catch(error => {
    if (isDevelopmentEnv()) {
        console.warn('[Easter Egg] Runtime failed to load:', error);
      }
    });
}

