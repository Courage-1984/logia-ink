/**
 * Star Field Generator Module
 * Creates multiple star layers with twinkling effects and variable brightness
 */

/**
 * Generate background star field
 * @param {Object} THREE - Three.js library
 * @param {Object} parameters - Star field parameters
 * @returns {Object} Star field data
 */
export function generateStarField(THREE, parameters = {}) {
  const {
    count = 50000,
    size = 0.05,
    depth = 2000, // Depth range for stars
    minBrightness = 0.3,
    maxBrightness = 1.0,
  } = parameters;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const twinklePhases = new Float32Array(count); // Phase for twinkling animation
  const twinkleSpeeds = new Float32Array(count); // Speed of twinkling per star

  // Generate stars in a sphere around the galaxy
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Random position in 3D space (spherical distribution)
    const theta = Math.random() * Math.PI * 2; // Azimuth
    const phi = Math.acos(2 * Math.random() - 1); // Elevation
    const r = Math.random() * depth + 100; // Distance from center (start beyond galaxy)

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Variable brightness based on distance (further = dimmer)
    const distanceFactor = 1 - (r / (depth + 100)) * 0.5;
    const baseBrightness = minBrightness + (maxBrightness - minBrightness) * distanceFactor * Math.random();

    // Star color (slight variation from white)
    const colorVariation = (Math.random() - 0.5) * 0.2;
    colors[i3] = baseBrightness + colorVariation;
    colors[i3 + 1] = baseBrightness + colorVariation;
    colors[i3 + 2] = baseBrightness + colorVariation * 0.5; // Slightly cooler

    // Size varies with distance (further = smaller)
    sizes[i] = size * (1 - (r / (depth + 100)) * 0.6);

    // Twinkling parameters (unique per star)
    twinklePhases[i] = Math.random() * Math.PI * 2;
    twinkleSpeeds[i] = 0.5 + Math.random() * 1.5; // Different twinkle speeds
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('twinklePhase', new THREE.BufferAttribute(twinklePhases, 1));
  geometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));

  return {
    geometry,
    count,
  };
}

/**
 * Generate multiple star layers (near, mid, far)
 * @param {Object} THREE - Three.js library
 * @param {Object} baseParameters - Base star field parameters
 * @returns {Array} Array of star layer data
 */
export function generateMultiLayerStarField(THREE, baseParameters = {}) {
  const layers = [
    {
      name: 'near',
      count: Math.floor((baseParameters.count || 50000) * 0.3),
      size: (baseParameters.size || 0.05) * 1.5,
      depth: 500,
      minDistance: 150, // Beyond galaxy
      maxDistance: 800,
      minBrightness: 0.6,
      maxBrightness: 1.0,
    },
    {
      name: 'mid',
      count: Math.floor((baseParameters.count || 50000) * 0.4),
      size: baseParameters.size || 0.05,
      depth: 1000,
      minDistance: 800,
      maxDistance: 1500,
      minBrightness: 0.4,
      maxBrightness: 0.8,
    },
    {
      name: 'far',
      count: Math.floor((baseParameters.count || 50000) * 0.3),
      size: (baseParameters.size || 0.05) * 0.7,
      depth: 2000,
      minDistance: 1500,
      maxDistance: 2500,
      minBrightness: 0.2,
      maxBrightness: 0.6,
    },
  ];

  return layers.map(layerConfig => {
    const layerGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(layerConfig.count * 3);
    const colors = new Float32Array(layerConfig.count * 3);
    const sizes = new Float32Array(layerConfig.count);
    const twinklePhases = new Float32Array(layerConfig.count);
    const twinkleSpeeds = new Float32Array(layerConfig.count);

    for (let i = 0; i < layerConfig.count; i++) {
      const i3 = i * 3;

      // Random position in layer's depth range
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = layerConfig.minDistance + Math.random() * (layerConfig.maxDistance - layerConfig.minDistance);

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      // Brightness based on distance within layer
      const distanceFactor = 1 - ((r - layerConfig.minDistance) / (layerConfig.maxDistance - layerConfig.minDistance));
      const baseBrightness = layerConfig.minBrightness + (layerConfig.maxBrightness - layerConfig.minBrightness) * distanceFactor * Math.random();

      const colorVariation = (Math.random() - 0.5) * 0.15;
      colors[i3] = baseBrightness + colorVariation;
      colors[i3 + 1] = baseBrightness + colorVariation;
      colors[i3 + 2] = baseBrightness + colorVariation * 0.5;

      sizes[i] = layerConfig.size * (1 - distanceFactor * 0.4);

      twinklePhases[i] = Math.random() * Math.PI * 2;
      twinkleSpeeds[i] = 0.3 + Math.random() * 1.2;
    }

    layerGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    layerGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    layerGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    layerGeometry.setAttribute('twinklePhase', new THREE.BufferAttribute(twinklePhases, 1));
    layerGeometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));

    return {
      geometry: layerGeometry,
      name: layerConfig.name,
      count: layerConfig.count,
      size: layerConfig.size,
    };
  });
}

/**
 * Update star twinkling effect
 * @param {THREE.Points} starField - Star field points object
 * @param {number} time - Current time in seconds
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateStarTwinkling(starField, time, deltaTime = 0.016) {
  if (!starField || !starField.geometry) {
    return;
  }

  const colors = starField.geometry.attributes.color;
  const twinklePhases = starField.geometry.attributes.twinklePhase;
  const twinkleSpeeds = starField.geometry.attributes.twinkleSpeed;

  if (!colors || !twinklePhases || !twinkleSpeeds) {
    return;
  }

  const colorArray = colors.array;
  const phaseArray = twinklePhases.array;
  const speedArray = twinkleSpeeds.array;

  // Store base colors if not already stored
  if (!starField.userData.baseColors) {
    starField.userData.baseColors = new Float32Array(colorArray.length);
    for (let i = 0; i < colorArray.length; i++) {
      starField.userData.baseColors[i] = colorArray[i];
    }
  }

  const baseColors = starField.userData.baseColors;

  for (let i = 0; i < colorArray.length; i += 3) {
    const starIndex = i / 3;
    const phase = phaseArray[starIndex];
    const speed = speedArray[starIndex];

    // Twinkling effect using sine wave with delta time for frame-rate independence
    // Use time-based animation for consistent twinkling regardless of frame rate
    const twinkle = Math.sin(time * speed + phase) * 0.3 + 0.7; // Oscillates between 0.4 and 1.0

    // Apply twinkling to base colors
    colorArray[i] = baseColors[i] * twinkle;
    colorArray[i + 1] = baseColors[i + 1] * twinkle;
    colorArray[i + 2] = baseColors[i + 2] * twinkle;
  }

  colors.needsUpdate = true;
}

