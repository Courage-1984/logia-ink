/**
 * Texture Wrapping Utilities
 * Handles seamless texture wrapping for equirectangular sphere mapping
 * Addresses horizontal seams and pole distortion issues
 */

/**
 * Create a seamless equirectangular texture canvas (2:1 aspect ratio)
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {Object} Canvas and context
 */
export function createEquirectangularCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx: canvas.getContext('2d'), width, height };
}

/**
 * Convert UV coordinates to equirectangular pixel coordinates
 * @param {number} u - U coordinate (0-1, longitude)
 * @param {number} v - V coordinate (0-1, latitude)
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {Object} Pixel coordinates {x, y}
 */
export function uvToEquirectangular(u, v, width, height) {
  const x = (u * width) % width;
  const y = v * height;
  return { x: Math.floor(x), y: Math.floor(y) };
}

/**
 * Convert equirectangular pixel coordinates to UV
 * @param {number} x - Pixel x coordinate
 * @param {number} y - Pixel y coordinate
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {Object} UV coordinates {u, v}
 */
export function equirectangularToUV(x, y, width, height) {
  const u = (x / width) % 1;
  const v = y / height;
  return { u, v };
}

/**
 * Check if coordinates are near the poles (where distortion occurs)
 * @param {number} v - V coordinate (0-1, latitude)
 * @param {number} poleThreshold - Threshold for pole region (default 0.05 = 5% from top/bottom)
 * @returns {Object} {isNearPole, poleFactor} - poleFactor is 0 at equator, 1 at pole
 */
export function isNearPole(v, poleThreshold = 0.05) {
  const distanceFromEquator = Math.abs(v - 0.5) * 2; // 0 at equator, 1 at pole
  const isNearPole = distanceFromEquator > 1 - poleThreshold * 2;
  const poleFactor = Math.max(
    0,
    (distanceFromEquator - (1 - poleThreshold * 2)) / (poleThreshold * 2)
  );
  return { isNearPole, poleFactor };
}

/**
 * Improved seamless wrapping with multi-pixel blending (Horizontal seam only)
 * Blends multiple edge pixels for smoother transitions where U=0 meets U=1.
 * Removed incorrect vertical pole blending.
 * @param {ImageData} imageData - Image data to make seamless
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} blendWidth - Number of pixels to blend at edges (default 3)
 * @returns {ImageData} Seamless image data
 */
export function makeSeamless(imageData, width, height, blendWidth = 3) {
  const data = imageData.data;
  const blendWidthClamped = Math.min(blendWidth, Math.floor(width / 4)); // Don't blend more than 1/4 of width

  // Blend horizontal edges (left/right wrap)
  for (let y = 0; y < height; y++) {
    for (let blend = 0; blend < blendWidthClamped; blend++) {
      const leftIdx = (y * width + blend) * 4;
      const rightIdx = (y * width + width - 1 - blend) * 4;
      // These wrap indices ensure the blended value is written back to the opposing edge
      const leftWrapIdx = (y * width + width - 1 - blend) * 4;
      const rightWrapIdx = (y * width + blend) * 4;

      // Calculate blend factor (stronger at edges, weaker further in)
      const blendFactor = 1 - blend / blendWidthClamped;

      // Blend left edge (inner) with right edge (inner)
      for (let c = 0; c < 4; c++) {
        const leftValue = data[leftIdx + c];
        const rightValue = data[rightIdx + c];
        const blended = leftValue * (1 - blendFactor * 0.5) + rightValue * (blendFactor * 0.5);
        data[leftIdx + c] = blended;
        data[leftWrapIdx + c] = blended;
      }

      // Blend right edge (inner) with left edge (inner)
      for (let c = 0; c < 4; c++) {
        const rightValue = data[rightIdx + c];
        const leftWrapValue = data[leftWrapIdx + c]; // Use the already blended value if possible, or leftIdx
        const blended = rightValue * (1 - blendFactor * 0.5) + leftWrapValue * (blendFactor * 0.5);
        data[rightIdx + c] = blended;
        data[rightWrapIdx + c] = blended;
      }
    }
  }

  // NOTE: Vertical blending for poles is inappropriate and has been removed.
  // Use featherPoles() instead to smoothly transition the content to the final edge color.

  return imageData;
}

/**
 * Apply polar feathering to smoothly fade details and color variation
 * to a uniform color at the V-axis edges (poles).
 * This ensures THREE.ClampToEdgeWrapping works without artifacts.
 * @param {ImageData} imageData - Image data to modify
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} fadeZone - The height percentage (0-1) from the edge where the fade should occur (e.g., 0.05 = 5% of height)
 * @returns {ImageData} Feathered image data
 */
export function featherPoles(imageData, width, height, fadeZone = 0.05) {
  const data = imageData.data;
  const fadeStart = height * fadeZone; // Y coordinate where fade begins
  const fadeEndTop = fadeStart;
  const fadeStartBottom = height - fadeStart;

  for (let y = 0; y < height; y++) {
    let fadeFactor = 1.0; // 1.0 means full opacity/effect, 0.0 means fully faded

    // Top Pole (y < fadeEndTop)
    if (y < fadeEndTop) {
      fadeFactor = y / fadeEndTop; // Fades from 0 at the pole (y=0) to 1 at fadeEndTop
    }
    // Bottom Pole (y > fadeStartBottom)
    else if (y > fadeStartBottom) {
      fadeFactor = (height - y) / fadeStart; // Fades from 0 at the pole (y=height) to 1 at fadeStartBottom
    }

    if (fadeFactor < 1.0) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // Get the color of the adjacent row (towards the equator) to fade towards
        // This makes the transition smooth by blending to the next "valid" row
        const sourceY = y < fadeEndTop ? Math.floor(fadeEndTop) : Math.floor(fadeStartBottom - 1);
        const sourceIdx = (sourceY * width + x) * 4;

        for (let c = 0; c < 3; c++) {
          // R, G, B channels
          const baseColor = data[sourceIdx + c]; // Use the color just outside the fade zone as the target base
          const currentValue = data[idx + c];

          // Linearly blend the current pixel value towards the "base" color (just outside the fade zone)
          data[idx + c] = currentValue * fadeFactor + baseColor * (1 - fadeFactor);
        }
        // Alpha channel remains 255
      }
    }
  }
  return imageData;
}

/**
 * Check if a coordinate is safe for feature placement (not near poles)
 * Returns true when the feature can be safely placed away from pole distortion
 * @param {number} v - V coordinate (0-1, latitude)
 * @param {number} poleExclusionZone - Zone to exclude features (default 0.08 = 8% from top/bottom)
 * @returns {boolean} True if feature placement is safe (not near pole), false if near pole
 */
export function isSafeForPolePlacement(v, poleExclusionZone = 0.08) {
  const poleInfo = isNearPole(v, poleExclusionZone);
  return !poleInfo.isNearPole;
}

/**
 * @deprecated Use isSafeForPolePlacement instead
 * Legacy alias for backward compatibility
 */
export function shouldPlaceFeatureAtPole(v, poleExclusionZone = 0.08) {
  return isSafeForPolePlacement(v, poleExclusionZone);
}

/**
 * Get pole-aware feature scale factor
 * Scales down features near poles to reduce distortion visibility
 * @param {number} v - V coordinate (0-1, latitude)
 * @param {number} poleThreshold - Threshold for pole region
 * @returns {number} Scale factor (1.0 at equator, smaller near poles)
 */
export function getPoleScaleFactor(v, poleThreshold = 0.1) {
  const { poleFactor } = isNearPole(v, poleThreshold);
  return 1 - poleFactor * 0.5; // Scale down to 50% at poles
}

/**
 * Create a Three.js texture with proper wrapping settings for spheres
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} options - Texture options
 * @returns {THREE.Texture} Configured Three.js texture
 */
export function createSphereTexture(canvas, options = {}) {
  const THREE = window.THREE;
  if (!THREE) {
    throw new Error('THREE.js must be loaded before creating textures');
  }

  const {
    wrapS = THREE.RepeatWrapping,
    wrapT = THREE.ClampToEdgeWrapping,
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
    generateMipmaps = true,
  } = options;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = wrapS;
  texture.wrapT = wrapT;
  texture.minFilter = minFilter;
  texture.magFilter = magFilter;

  if (generateMipmaps) {
    texture.generateMipmaps = true;
  }

  return texture;
}
