/**
 * Particle Effects Module
 * Handles asteroid belts, comets, solar wind, space dust, and space stations
 */

/**
 * Create an asteroid belt around a planet
 * @param {Object} THREE - Three.js library
 * @param {THREE.Mesh} planet - Planet to orbit around
 * @param {Object} parameters - Belt parameters
 * @returns {THREE.Points} Asteroid belt points
 */
export function createAsteroidBelt(THREE, planet, parameters = {}) {
  const {
    count = 2000,
    innerRadius = 1.5,
    outerRadius = 2.5,
    size = 0.02,
    color = 0x888888,
  } = parameters;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const rotations = new Float32Array(count * 2); // Store angle and speed per asteroid

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Random radius between inner and outer
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 0.3; // Slight vertical spread

    // Position in belt plane
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = height;
    positions[i3 + 2] = Math.sin(angle) * radius;

    // Color variation (gray to brown)
    const colorVariation = Math.random() * 0.3;
    colors[i3] = 0.4 + colorVariation;
    colors[i3 + 1] = 0.3 + colorVariation * 0.5;
    colors[i3 + 2] = 0.2 + colorVariation * 0.3;

    // Variable size
    sizes[i] = size * (0.5 + Math.random() * 0.5);

    // Store rotation data
    rotations[i * 2] = angle;
    rotations[i * 2 + 1] = 0.001 + Math.random() * 0.002; // Rotation speed
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: size,
    sizeAttenuation: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const asteroidBelt = new THREE.Points(geometry, material);
  planet.add(asteroidBelt);

  // Store rotation data for animation
  asteroidBelt.userData.rotations = rotations;
  asteroidBelt.userData.isAsteroidBelt = true;
  asteroidBelt.userData.planet = planet;

  return asteroidBelt;
}

/**
 * Create a comet with trail
 * @param {Object} THREE - Three.js library
 * @param {THREE.Scene} scene - Scene to add comet to
 * @param {Object} parameters - Comet parameters
 * @returns {Object} Comet object with core and trail
 */
export function createComet(THREE, scene, parameters = {}) {
  const {
    size = 0.1,
    trailLength = 50,
    color = 0x88ccff,
    speed = 0.02,
    orbitRadius = 100,
    orbitAngle = Math.random() * Math.PI * 2,
  } = parameters;

  // Comet core
  const coreGeometry = new THREE.SphereGeometry(size, 16, 16);
  // Use MeshStandardMaterial which supports emissive
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 1.5,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);

  // Comet trail (particle system)
  const trailGeometry = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(trailLength * 3);
  const trailColors = new Float32Array(trailLength * 3);
  const trailSizes = new Float32Array(trailLength);

  // Initialize trail positions (will be updated in animation)
  for (let i = 0; i < trailLength; i++) {
    const i3 = i * 3;
    trailPositions[i3] = 0;
    trailPositions[i3 + 1] = 0;
    trailPositions[i3 + 2] = 0;

    // Fade from bright to dim
    const fade = 1 - (i / trailLength);
    trailColors[i3] = 0.5 * fade;
    trailColors[i3 + 1] = 0.7 * fade;
    trailColors[i3 + 2] = 1.0 * fade;

    trailSizes[i] = size * 0.5 * fade;
  }

  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
  trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

  const trailMaterial = new THREE.PointsMaterial({
    size: size * 0.5,
    sizeAttenuation: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
  });

  const trail = new THREE.Points(trailGeometry, trailMaterial);
  core.add(trail);

  // Store comet data
  core.userData.isComet = true;
  core.userData.speed = speed;
  core.userData.orbitRadius = orbitRadius;
  core.userData.orbitAngle = orbitAngle;
  core.userData.trailLength = trailLength;
  core.userData.trailPositions = trailPositions;
  core.userData.lastPosition = new THREE.Vector3();

  scene.add(core);

  return { core, trail };
}

/**
 * Create solar wind particles
 * @param {Object} THREE - Three.js library
 * @param {THREE.Mesh} sun - Sun mesh
 * @param {Object} parameters - Solar wind parameters
 * @returns {THREE.Points} Solar wind particles
 */
export function createSolarWind(THREE, sun, parameters = {}) {
  const {
    count = 5000,
    size = 0.01,
    speed = 0.05,
    spread = 0.3,
  } = parameters;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const lifetimes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Start near sun surface
    const radius = 3.5 + Math.random() * 0.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Velocity away from sun with random spread
    const direction = new THREE.Vector3(
      positions[i3],
      positions[i3 + 1],
      positions[i3 + 2]
    ).normalize();

    const spreadX = (Math.random() - 0.5) * spread;
    const spreadY = (Math.random() - 0.5) * spread;
    const spreadZ = (Math.random() - 0.5) * spread;

    velocities[i3] = direction.x * speed + spreadX;
    velocities[i3 + 1] = direction.y * speed + spreadY;
    velocities[i3 + 2] = direction.z * speed + spreadZ;

    // Yellow/white color
    const brightness = 0.7 + Math.random() * 0.3;
    colors[i3] = brightness;
    colors[i3 + 1] = brightness * 0.9;
    colors[i3 + 2] = brightness * 0.7;

    lifetimes[i] = Math.random() * 200 + 100; // Lifetime in frames
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: size,
    sizeAttenuation: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.6,
  });

  const solarWind = new THREE.Points(geometry, material);
  sun.add(solarWind);

  // Store for animation
  solarWind.userData.velocities = velocities;
  solarWind.userData.lifetimes = lifetimes;
  solarWind.userData.isSolarWind = true;
  solarWind.userData.sun = sun;

  return solarWind;
}

/**
 * Create space dust particles
 * @param {Object} THREE - Three.js library
 * @param {THREE.Scene} scene - Scene to add dust to
 * @param {Object} parameters - Dust parameters
 * @returns {THREE.Points} Space dust particles
 */
export function createSpaceDust(THREE, scene, parameters = {}) {
  const {
    count = 10000,
    size = 0.005,
    radius = 200,
    color = 0xffffff,
  } = parameters;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Random position in space
    const r = Math.random() * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Very dim white/gray
    const brightness = 0.1 + Math.random() * 0.1;
    colors[i3] = brightness;
    colors[i3 + 1] = brightness;
    colors[i3 + 2] = brightness;

    sizes[i] = size * (0.5 + Math.random() * 0.5);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: size,
    sizeAttenuation: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.3,
  });

  const spaceDust = new THREE.Points(geometry, material);
  scene.add(spaceDust);

  spaceDust.userData.isSpaceDust = true;

  return spaceDust;
}

/**
 * Create a space station or satellite
 * @param {Object} THREE - Three.js library
 * @param {THREE.Mesh} planet - Planet to orbit around
 * @param {Object} parameters - Station parameters
 * @returns {THREE.Group} Space station group
 */
export function createSpaceStation(THREE, planet, parameters = {}) {
  const {
    distance = 2.5,
    size = 0.1,
    color = 0xcccccc,
  } = parameters;

  const station = new THREE.Group();

  // Main body (cylinder)
  const bodyGeometry = new THREE.CylinderGeometry(size * 0.3, size * 0.3, size * 0.8, 8);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.2,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  station.add(body);

  // Solar panels
  const panelGeometry = new THREE.BoxGeometry(size * 1.5, size * 0.05, size * 0.8);
  const panelMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    emissive: 0x0000aa,
    emissiveIntensity: 0.1,
  });

  const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
  panel1.position.x = size * 0.8;
  panel1.rotation.z = Math.PI / 2;
  station.add(panel1);

  const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
  panel2.position.x = -size * 0.8;
  panel2.rotation.z = -Math.PI / 2;
  station.add(panel2);

  // Position in orbit
  const angle = Math.random() * Math.PI * 2;
  station.position.x = Math.cos(angle) * distance;
  station.position.z = Math.sin(angle) * distance;

  planet.add(station);

  // Store orbit data
  station.userData.isSpaceStation = true;
  station.userData.distance = distance;
  station.userData.angle = angle;
  station.userData.speed = 0.003; // Orbit speed
  station.userData.planet = planet;

  return station;
}

/**
 * Update asteroid belt animation
 * @param {THREE.Points} asteroidBelt - Asteroid belt to animate
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateAsteroidBelt(asteroidBelt, deltaTime = 0.016) {
  if (!asteroidBelt || !asteroidBelt.userData.rotations) {
    return;
  }

  const positions = asteroidBelt.geometry.attributes.position;
  const rotations = asteroidBelt.userData.rotations;

  for (let i = 0; i < positions.count; i++) {
    const i3 = i * 3;
    // Apply rotation with delta time for frame-rate independence
    rotations[i * 2] += rotations[i * 2 + 1] * deltaTime * 60; // Normalize to 60fps

    const angle = rotations[i * 2];
    const radius = Math.sqrt(
      positions.array[i3] * positions.array[i3] +
      positions.array[i3 + 2] * positions.array[i3 + 2]
    );

    positions.array[i3] = Math.cos(angle) * radius;
    positions.array[i3 + 2] = Math.sin(angle) * radius;
  }

  positions.needsUpdate = true;
}

/**
 * Update comet animation
 * @param {Object} comet - Comet object with core and trail
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateComet(comet, deltaTime = 0.016) {
  if (!comet || !comet.core || !comet.core.userData.isComet) {
    return;
  }

  const core = comet.core;
  const userData = core.userData;

  // Update orbit with delta time for frame-rate independence
  userData.orbitAngle += userData.speed * deltaTime * 60; // Normalize to 60fps

  const x = Math.cos(userData.orbitAngle) * userData.orbitRadius;
  const z = Math.sin(userData.orbitAngle) * userData.orbitRadius;
  const y = Math.sin(userData.orbitAngle * 2) * 10; // Vertical variation

  const currentPos = new THREE.Vector3(x, y, z);

  // Update trail positions
  const trailPositions = userData.trailPositions;
  const lastPos = userData.lastPosition;

  // Shift trail positions
  for (let i = userData.trailLength - 1; i > 0; i--) {
    const i3 = i * 3;
    const prevI3 = (i - 1) * 3;
    trailPositions[i3] = trailPositions[prevI3];
    trailPositions[i3 + 1] = trailPositions[prevI3 + 1];
    trailPositions[i3 + 2] = trailPositions[prevI3 + 2];
  }

  // Add new position at front
  trailPositions[0] = lastPos.x;
  trailPositions[1] = lastPos.y;
  trailPositions[2] = lastPos.z;

  // Update core position
  core.position.copy(currentPos);
  userData.lastPosition.copy(currentPos);

  // Update trail geometry
  if (comet.trail && comet.trail.geometry) {
    comet.trail.geometry.attributes.position.needsUpdate = true;
  }
}

/**
 * Update solar wind animation
 * @param {THREE.Points} solarWind - Solar wind particles
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateSolarWind(solarWind, deltaTime = 0.016) {
  if (!solarWind || !solarWind.userData.velocities) {
    return;
  }

  const positions = solarWind.geometry.attributes.position;
  const velocities = solarWind.userData.velocities;
  const lifetimes = solarWind.userData.lifetimes;

  // Movement factor to normalize velocity scale (velocities are defined in units per second at 60fps)
  const movementFactor = 60;

  for (let i = 0; i < positions.count; i++) {
    const i3 = i * 3;

    // Update position with delta time for frame-rate independence
    // Velocities are defined in units per second, so multiply by deltaTime and movementFactor
    positions.array[i3] += velocities[i3] * deltaTime * movementFactor;
    positions.array[i3 + 1] += velocities[i3 + 1] * deltaTime * movementFactor;
    positions.array[i3 + 2] += velocities[i3 + 2] * deltaTime * movementFactor;

    // Decrease lifetime (lifetime is in frames, so we convert deltaTime to frames)
    lifetimes[i] -= deltaTime * movementFactor;

    // Reset if lifetime expired or too far from sun
    // Use squared distance to avoid expensive Math.sqrt
    const distanceSq =
      positions.array[i3] * positions.array[i3] +
      positions.array[i3 + 1] * positions.array[i3 + 1] +
      positions.array[i3 + 2] * positions.array[i3 + 2];
    const maxDistanceSq = 50 * 50; // Maximum distance squared from origin (sun at 0,0,0)

    if (lifetimes[i] <= 0 || distanceSq > maxDistanceSq) {
      // Respawn near sun
      const radius = 3.5 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions.array[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions.array[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions.array[i3 + 2] = radius * Math.cos(phi);

      lifetimes[i] = Math.random() * 200 + 100;
    }
  }

  positions.needsUpdate = true;
}

/**
 * Update space station animation
 * @param {THREE.Group} station - Space station to animate
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateSpaceStation(station, deltaTime = 0.016) {
  if (!station || !station.userData.isSpaceStation) {
    return;
  }

  const userData = station.userData;
  // Apply rotation with delta time for frame-rate independence
  userData.angle += userData.speed * deltaTime * 60; // Normalize to 60fps

  const x = Math.cos(userData.angle) * userData.distance;
  const z = Math.sin(userData.angle) * userData.distance;

  station.position.x = x;
  station.position.z = z;

  // Rotate station slowly with delta time
  station.rotation.y += 0.01 * deltaTime * 60; // Normalize to 60fps
}

