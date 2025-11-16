/**
 * Galaxy Generator Module
 * Enhanced spiral galaxy generation using density wave theory
 * Provides realistic spiral arms with multiple star layers rotating at different speeds
 */

/**
 * Generate galaxy particles using density wave theory
 * @param {Object} THREE - Three.js library
 * @param {Object} parameters - Galaxy parameters
 * @returns {Object} Galaxy data with multiple layers
 */
export function generateGalaxyWithDensityWave(THREE, parameters = {}) {
  const {
    count = 100000,
    size = 0.02,
    radius = 50,
    branches = 4,
    spin = 1,
    randomness = 0.5,
    randomnessPower = 3,
    insideColor = '#ff0080',
    outsideColor = '#00ffff',
  } = parameters;

  // Density wave parameters
  const densityWaveAmplitude = 0.3; // Strength of density wave
  const densityWaveFrequency = 2; // Number of spiral arms
  const densityWaveSpeed = 0.0003; // Rotation speed of density wave

  // Create geometry for main galaxy
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const rotations = new Float32Array(count); // Store rotation speeds per particle

  const colorInside = new THREE.Color(insideColor);
  const colorOutside = new THREE.Color(outsideColor);

  // Pre-calculate random values for performance
  const randomValues = new Float32Array(count * 4);
  for (let i = 0; i < randomValues.length; i++) {
    randomValues[i] = Math.random();
  }

  // Generate positions using density wave theory
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const rIdx = i * 4;

    // Radial distance with exponential falloff (denser at center)
    const radiusFactor = Math.pow(randomValues[rIdx], 2); // Square for denser center
    const radius = radiusFactor * parameters.radius;

    // Density wave modulation - creates spiral arm density variations
    const angle = (i % branches) / branches * Math.PI * 2;
    const densityWavePhase = radius * densityWaveFrequency + angle;
    const densityModulation = Math.sin(densityWavePhase) * densityWaveAmplitude + 1;

    // Spiral position with density wave enhancement
    const spinAngle = radius * spin;
    const branchAngle = angle;

    // Enhanced randomness with density wave influence
    const randomPowerX = Math.pow(randomValues[rIdx + 1], randomnessPower);
    const randomPowerY = Math.pow(randomValues[rIdx + 2], randomnessPower);
    const randomPowerZ = Math.pow(randomValues[rIdx + 3], randomnessPower);
    const randomSignX = (i % 3) === 0 ? 1 : -1;
    const randomSignY = (i % 5) === 0 ? 1 : -1;
    const randomSignZ = (i % 7) === 0 ? 1 : -1;

    // Apply density modulation to randomness (stars cluster in arms)
    const densityRandomness = randomness * densityModulation;
    const randomX = randomPowerX * randomSignX * densityRandomness * radius;
    const randomY = randomPowerY * randomSignY * densityRandomness * radius;
    const randomZ = randomPowerZ * randomSignZ * densityRandomness * radius;

    // Calculate position
    const finalAngle = branchAngle + spinAngle;
    positions[i3] = Math.cos(finalAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(finalAngle) * radius + randomZ;

    // Color mixing based on distance from center (with density enhancement)
    const colorMix = radius / parameters.radius;
    const densityColorBoost = densityModulation * 0.2; // Brighter in arms
    colors[i3] = Math.min(1, colorInside.r + (colorOutside.r - colorInside.r) * colorMix + densityColorBoost);
    colors[i3 + 1] = Math.min(1, colorInside.g + (colorOutside.g - colorInside.g) * colorMix + densityColorBoost);
    colors[i3 + 2] = Math.min(1, colorInside.b + (colorOutside.b - colorInside.b) * colorMix + densityColorBoost);

    // Variable size based on distance (smaller stars further out)
    sizes[i] = size * (1 - radius / parameters.radius * 0.5);

    // Rotation speed varies with radius (differential rotation)
    // Inner stars rotate faster, outer stars slower
    const rotationSpeed = 0.0003 * (1 - radius / parameters.radius * 0.7);
    rotations[i] = rotationSpeed;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('rotationSpeed', new THREE.BufferAttribute(rotations, 1));

  return {
    geometry,
    densityWaveSpeed,
    count,
  };
}

/**
 * Generate multiple galaxy layers with different rotation speeds
 * @param {Object} THREE - Three.js library
 * @param {Object} baseParameters - Base galaxy parameters
 * @param {number} layerCount - Number of layers (default 3)
 * @returns {Array} Array of galaxy layer data
 */
export function generateMultiLayerGalaxy(THREE, baseParameters = {}, layerCount = 3) {
  const layers = [];

  for (let layer = 0; layer < layerCount; layer++) {
    const layerFactor = layer / layerCount;
    const layerParameters = {
      ...baseParameters,
      count: Math.floor(baseParameters.count * (1 - layerFactor * 0.3)), // Fewer stars in outer layers
      radius: baseParameters.radius * (1 + layerFactor * 0.2), // Slightly larger radius
      spin: baseParameters.spin * (1 - layerFactor * 0.3), // Slower rotation in outer layers
      randomness: baseParameters.randomness * (1 + layerFactor * 0.2), // More spread in outer layers
      size: baseParameters.size * (1 - layerFactor * 0.3), // Smaller stars in outer layers
    };

    const galaxyData = generateGalaxyWithDensityWave(THREE, layerParameters);
    layers.push({
      ...galaxyData,
      layerIndex: layer,
      rotationSpeed: 0.0003 * (1 - layerFactor * 0.4), // Different rotation speeds per layer
    });
  }

  return layers;
}

/**
 * Create improved particle distribution using Poisson-like sampling
 * Reduces clustering by ensuring minimum distance between particles
 * @param {number} count - Number of particles
 * @param {number} radius - Maximum radius
 * @param {number} minDistance - Minimum distance between particles
 * @returns {Float32Array} Array of radius values with better distribution
 */
export function generatePoissonLikeDistribution(count, radius, minDistance = 0.5) {
  const radii = new Float32Array(count);
  const gridSize = Math.ceil(radius / minDistance);
  const grid = new Array(gridSize * gridSize).fill(false);
  const points = [];

  // Generate points with minimum distance constraint
  let attempts = 0;
  const maxAttempts = count * 30; // Limit attempts to prevent infinite loops

  for (let i = 0; i < count && attempts < maxAttempts; i++) {
    let valid = false;
    let x, y, r;

    while (!valid && attempts < maxAttempts) {
      attempts++;
      r = Math.random() * radius;
      const angle = Math.random() * Math.PI * 2;
      x = Math.cos(angle) * r;
      y = Math.sin(angle) * r;

      // Check minimum distance from existing points
      valid = true;
      for (const point of points) {
        const dx = x - point.x;
        const dy = y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          valid = false;
          break;
        }
      }
    }

    if (valid) {
      points.push({ x, y, r });
      radii[i] = r;
    } else {
      // Fallback to random if we can't find a valid position
      radii[i] = Math.random() * radius;
    }
  }

  // Fill remaining with random distribution
  for (let i = points.length; i < count; i++) {
    radii[i] = Math.random() * radius;
  }

  return radii;
}

