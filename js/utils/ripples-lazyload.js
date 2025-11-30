/**
 * Initialize background video lazy loading for a single container
 * @param {HTMLElement} container - The container element
 */
function initContainerVideo(container) {
  const baseName = container.dataset.video || 'ripples';
  const posterName = container.dataset.poster || `${baseName}-poster.jpg`;
  const basePath = container.dataset.path || 'assets/video/optimized';
  const useOptimized = container.dataset.useOptimized !== 'false';

  const resolveSrc = () => {
    // If using a direct video file (not optimized versions)
    if (!useOptimized) {
      const directSrc = container.dataset.directSrc;
      if (directSrc) return directSrc;
      return `${basePath.replace('/optimized', '')}/${baseName}.mp4`;
    }

    const width = window.innerWidth;
    const isSlowConnection = (() => {
      const connection =
        navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!connection || !connection.effectiveType) return false;
      return (
        connection.effectiveType.includes('2g') || connection.effectiveType.includes('slow-2g')
      );
    })();

    if (isSlowConnection) return `${basePath}/${baseName}-lq.mp4`;

    const supportsWebM = (() => {
      const v = document.createElement('video');
      return typeof v.canPlayType === 'function' && v.canPlayType('video/webm; codecs=vp9') !== '';
    })();

    if (supportsWebM && width >= 769) return `${basePath}/${baseName}-webm.webm`;
    if (width >= 1200) return `${basePath}/${baseName}-hq.mp4`;
    if (width >= 768) return `${basePath}/${baseName}-mq.mp4`;
    return `${basePath}/${baseName}-lq.mp4`;
  };

  const createVideo = src => {
    const video = document.createElement('video');
    video.dataset.src = src;
    video.src = src;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.loading = 'lazy'; // Lazy load below-the-fold videos
    video.preload = 'metadata'; // Preload metadata for faster start (enables faststart)
    video.setAttribute('playsinline', 'true'); // iOS inline playback
    video.setAttribute('webkit-playsinline', 'true'); // Legacy iOS support
    // Performance optimizations
    video.setAttribute('disablePictureInPicture', 'true');
    video.setAttribute('disableRemotePlayback', 'true');
    if (posterName && useOptimized) {
      video.poster = `${basePath}/${posterName}`;
    }
    video.className = 'background-video';
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    return video;
  };

  const loadVideo = () => {
    const source = resolveSrc();
    if (!source) return;

    const existing = container.querySelector('video');
    if (existing && existing.dataset.src === source) return;

    if (existing) {
      existing.pause();
      existing.remove();
    }

    const videoEl = createVideo(source);
    container.appendChild(videoEl);

    const onReady = () => {
      videoEl.classList.add('is-ready');
      videoEl.play().catch(() => {});
    };

    if (videoEl.readyState >= 2) onReady();
    else videoEl.addEventListener('loadeddata', onReady, { once: true });
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo();
          observer.disconnect();
        }
      });
    },
    { rootMargin: '0px 0px 200px 0px' }
  );

  observer.observe(container);
}

/**
 * Initialize background video lazy loading
 * Supports multiple containers via ID or class selector
 */
export function initBackgroundVideoLazyLoad() {
  // Support legacy single container by ID
  const legacyContainer = document.getElementById('background-video-container');
  if (legacyContainer) {
    initContainerVideo(legacyContainer);
  }

  // Support multiple containers via class
  const containers = document.querySelectorAll('.background-video-container');
  containers.forEach(container => {
    // Skip if already processed (legacy container)
    if (container.id === 'background-video-container' && legacyContainer) return;
    initContainerVideo(container);
  });
}
