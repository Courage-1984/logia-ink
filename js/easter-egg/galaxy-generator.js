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
  // NOTE: Poisson distribution (generatePoissonLikeDistribution) is available but too slow for large counts (O(n²) complexity).
  // For 100,000+ stars, it would require billions of distance checks. Using optimized random distribution instead.
  // The exponential falloff (Math.pow(random, 2)) provides good visual distribution without performance cost.
  // For smaller counts (<10,000), consider using generatePoissonLikeDistribution for better spacing.
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const rIdx = i * 4;

    // Radial distance with exponential falloff (denser at center)
    // This gives good distribution without the O(n²) cost of Poisson sampling
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
 * Generate galaxy with explicit exponential disk and spherical halo
 * More realistic galaxy structure with distinct components
 * @param {Object} THREE - Three.js library
 * @param {Object} parameters - Galaxy parameters
 * @returns {Object} Galaxy data with disk and halo layers
 */
export function generateGalaxyWithExponentialDisk(THREE, parameters = {}) {
  const {
    count = 100000,
    size = 0.02,
    radius = 50,
    branches = 4,
    spin = 1,
    randomness = 0.5,
    insideColor = '#ff0080',
    outsideColor = '#00ffff',
    diskRatio = 0.8, // Ratio of stars in disk vs halo
    diskScaleLength = 0.3, // Exponential scale length for disk (0-1)
    haloRadius = 1.2, // Halo extends beyond disk
  } = parameters;

  // Split count between disk and halo
  const diskCount = Math.floor(count * diskRatio);
  const haloCount = count - diskCount;

  // Generate disk stars (exponential falloff)
  const diskGeometry = new THREE.BufferGeometry();
  const diskPositions = new Float32Array(diskCount * 3);
  const diskColors = new Float32Array(diskCount * 3);
  const diskSizes = new Float32Array(diskCount);

  const colorInside = new THREE.Color(insideColor);
  const colorOutside = new THREE.Color(outsideColor);

  for (let i = 0; i < diskCount; i++) {
    const i3 = i * 3;

    // Exponential disk distribution: density ∝ exp(-r/scaleLength)
    // Use inverse transform sampling
    const u = Math.random();
    const radiusFactor = -diskScaleLength * Math.log(1 - u * (1 - Math.exp(-1 / diskScaleLength)));
    const radius = Math.min(radiusFactor * radius, radius);

    const angle = (i % branches) / branches * Math.PI * 2;
    const spinAngle = radius * spin;
    const branchAngle = angle;
    const finalAngle = branchAngle + spinAngle;

    // Add randomness for thickness
    const height = (Math.random() - 0.5) * radius * 0.1; // Thin disk

    diskPositions[i3] = Math.cos(finalAngle) * radius;
    diskPositions[i3 + 1] = height;
    diskPositions[i3 + 2] = Math.sin(finalAngle) * radius;

    // Color mixing based on distance
    const colorMix = radius / parameters.radius;
    diskColors[i3] = colorInside.r + (colorOutside.r - colorInside.r) * colorMix;
    diskColors[i3 + 1] = colorInside.g + (colorOutside.g - colorInside.g) * colorMix;
    diskColors[i3 + 2] = colorInside.b + (colorOutside.b - colorInside.b) * colorMix;

    diskSizes[i] = size * (1 - radius / parameters.radius * 0.5);
  }

  diskGeometry.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
  diskGeometry.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));
  diskGeometry.setAttribute('size', new THREE.BufferAttribute(diskSizes, 1));

  // Generate halo stars (spherical distribution)
  const haloGeometry = new THREE.BufferGeometry();
  const haloPositions = new Float32Array(haloCount * 3);
  const haloColors = new Float32Array(haloCount * 3);
  const haloSizes = new Float32Array(haloCount);

  for (let i = 0; i < haloCount; i++) {
    const i3 = i * 3;

    // Spherical distribution with power-law falloff
    const r = Math.pow(Math.random(), 0.5) * radius * haloRadius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    haloPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
    haloPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    haloPositions[i3 + 2] = r * Math.cos(phi);

    // Halo stars are dimmer and more uniform in color
    const brightness = 0.3 + Math.random() * 0.3;
    haloColors[i3] = colorInside.r * brightness;
    haloColors[i3 + 1] = colorInside.g * brightness;
    haloColors[i3 + 2] = colorInside.b * brightness;

    haloSizes[i] = size * 0.7; // Smaller halo stars
  }

  haloGeometry.setAttribute('position', new THREE.BufferAttribute(haloPositions, 3));
  haloGeometry.setAttribute('color', new THREE.BufferAttribute(haloColors, 3));
  haloGeometry.setAttribute('size', new THREE.BufferAttribute(haloSizes, 1));

  return {
    disk: { geometry: diskGeometry, count: diskCount },
    halo: { geometry: haloGeometry, count: haloCount },
    totalCount: count,
  };
}

/**
 * Create improved particle distribution using Poisson-like sampling with spatial hash grid
 * Reduces clustering by ensuring minimum distance between particles
 * Uses spatial hash grid for O(1) average neighbor lookup instead of O(N) linear search
 * @param {number} count - Number of particles
 * @param {number} radius - Maximum radius
 * @param {number} minDistance - Minimum distance between particles
 * @returns {Float32Array} Array of radius values with better distribution
 */
export function generatePoissonLikeDistribution(count, radius, minDistance = 0.5) {
  const radii = new Float32Array(count);

  // Spatial hash grid for O(1) average neighbor lookup
  const cellSize = minDistance;
  const gridWidth = Math.ceil((radius * 2) / cellSize);
  const gridHeight = gridWidth;
  const grid = new Map(); // Map<cellKey, point[]>

  // Helper to get grid cell key from coordinates
  const getCellKey = (x, y) => {
    const cellX = Math.floor((x + radius) / cellSize);
    const cellY = Math.floor((y + radius) / cellSize);
    return `${cellX},${cellY}`;
  };

  // Helper to get neighboring cell keys (3x3 grid around point)
  const getNeighborKeys = (x, y) => {
    const keys = [];
    const cellX = Math.floor((x + radius) / cellSize);
    const cellY = Math.floor((y + radius) / cellSize);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        keys.push(`${cellX + dx},${cellY + dy}`);
      }
    }
    return keys;
  };

  // Helper to check if point is valid (only check neighbors in spatial grid)
  const isValidPoint = (x, y) => {
    const neighborKeys = getNeighborKeys(x, y);
    const minDistSq = minDistance * minDistance;

    for (const key of neighborKeys) {
      const cellPoints = grid.get(key);
      if (!cellPoints) continue;

      for (const point of cellPoints) {
        const dx = x - point.x;
        const dy = y - point.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDistSq) {
          return false;
        }
      }
    }
    return true;
  };

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

      // Check minimum distance using spatial hash grid (O(1) average)
      valid = isValidPoint(x, y);
    }

    if (valid) {
      // Add point to spatial grid
      const cellKey = getCellKey(x, y);
      if (!grid.has(cellKey)) {
        grid.set(cellKey, []);
      }
      grid.get(cellKey).push({ x, y, r });
      radii[i] = r;
    } else {
      // Fallback to random if we can't find a valid position
      radii[i] = Math.random() * radius;
    }
  }

  // Fill remaining with random distribution
  let validCount = 0;
  for (let i = 0; i < radii.length; i++) {
    if (radii[i] > 0) validCount++;
  }
  for (let i = validCount; i < count; i++) {
    radii[i] = Math.random() * radius;
  }

  return radii;
}

