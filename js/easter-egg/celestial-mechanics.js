/**
 * Celestial Mechanics Module
 * Handles accurate orbital mechanics, Lagrange points, and realistic planet rotation
 */

// Physical constants
// Rotation speeds are defined in radians per second for frame-rate independence
const BASE_ROTATION_SPEED = 0.12; // radians per second (0.002 * 60)
const BASE_ORBITAL_SPEED = 0.06; // radians per second (0.001 * 60)
const DEFAULT_SUN_MASS = 1.0;
const LAGRANGE_ANGLE = Math.PI / 3; // 60 degrees

/**
 * Calculate Lagrange points (L4 and L5) for a planet-sun system
 * L4 and L5 are stable points 60° ahead and behind the planet
 * Pure math function - returns plain objects, framework-agnostic
 * @param {Object} sunPosition - Position of the sun {x, y, z}
 * @param {Object} planetPosition - Position of the planet {x, y, z}
 * @param {number} planetDistance - Distance from sun to planet
 * @returns {Object} L4 and L5 positions as plain objects {x, y, z}
 */
export function calculateLagrangePoints(sunPosition, planetPosition, planetDistance) {
  // Extract coordinates (handles both THREE.Vector3 and plain objects)
  const planetX = planetPosition.x || 0;
  const planetY = planetPosition.y || 0;
  const planetZ = planetPosition.z || 0;

  // Calculate angle of planet from sun
  const angle = Math.atan2(planetZ, planetX);

  // L4 is 60° ahead (counter-clockwise)
  const l4Angle = angle + LAGRANGE_ANGLE;
  const l4Position = {
    x: Math.cos(l4Angle) * planetDistance,
    y: planetY,
    z: Math.sin(l4Angle) * planetDistance,
  };

  // L5 is 60° behind (clockwise)
  const l5Angle = angle - LAGRANGE_ANGLE;
  const l5Position = {
    x: Math.cos(l5Angle) * planetDistance,
    y: planetY,
    z: Math.sin(l5Angle) * planetDistance,
  };

  return {
    l4: l4Position,
    l5: l5Position,
  };
}

/**
 * Create Lagrange point visualization markers
 * @param {Object} THREE - Three.js library
 * @param {THREE.Mesh} planet - Planet to calculate Lagrange points for
 * @param {THREE.Mesh} sun - Sun mesh
 * @returns {THREE.Group} Group containing L4 and L5 markers
 */
export function createLagrangePointMarkers(THREE, planet, sun) {
  const group = new THREE.Group();
  const planetDistance = planet.userData.distance;

  // Create marker geometry
  const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);

  // Use MeshStandardMaterial which supports emissive
  const l4Material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.6,
    emissive: 0x00ff00,
    emissiveIntensity: 0.5,
  });

  const l5Material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5,
  });

  // Create L4 marker
  const l4Marker = new THREE.Mesh(markerGeometry, l4Material);

  // Create L5 marker
  const l5Marker = new THREE.Mesh(markerGeometry, l5Material);

  // Add glow effect
  const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide,
  });

  const l4Glow = new THREE.Mesh(glowGeometry, glowMaterial.clone());
  const l5Glow = new THREE.Mesh(glowGeometry, glowMaterial.clone());
  l5Glow.material.color.setHex(0x00ffff);

  l4Marker.add(l4Glow);
  l5Marker.add(l5Glow);

  group.add(l4Marker);
  group.add(l5Marker);

  // Store references
  group.userData.l4Marker = l4Marker;
  group.userData.l5Marker = l5Marker;
  group.userData.planet = planet;
  group.userData.sun = sun;

  return group;
}

/**
 * Update Lagrange point positions based on planet position
 * @param {THREE.Group} lagrangeGroup - Lagrange point group
 */
export function updateLagrangePoints(THREE, lagrangeGroup) {
  if (!lagrangeGroup || !lagrangeGroup.userData.planet || !lagrangeGroup.userData.sun) {
    return;
  }

  const planet = lagrangeGroup.userData.planet;
  const sun = lagrangeGroup.userData.sun;
  const planetDistance = planet.userData.distance;

  // Calculate Lagrange points (returns plain objects)
  const lagrangePoints = calculateLagrangePoints(
    sun.position,
    planet.position,
    planetDistance
  );

  // Convert plain objects to THREE.Vector3 for Three.js
  lagrangeGroup.userData.l4Marker.position.set(
    lagrangePoints.l4.x,
    lagrangePoints.l4.y,
    lagrangePoints.l4.z
  );
  lagrangeGroup.userData.l5Marker.position.set(
    lagrangePoints.l5.x,
    lagrangePoints.l5.y,
    lagrangePoints.l5.z
  );
}

/**
 * Calculate realistic rotation speed based on planet size and distance
 * Larger planets rotate slower, closer planets have faster orbital periods
 * @param {number} planetSize - Size of the planet
 * @param {number} distance - Distance from sun
 * @returns {number} Rotation speed multiplier
 */
export function calculateRealisticRotationSpeed(planetSize, distance) {
  // Base rotation speed (smaller planets rotate faster)
  const sizeFactor = 1 / (planetSize * 2);

  // Distance factor (closer planets have faster orbital periods)
  const distanceFactor = 1 / Math.sqrt(distance);

  // Combined rotation speed
  return sizeFactor * distanceFactor * BASE_ROTATION_SPEED;
}

/**
 * Calculate orbital speed using a simplified Keplerian approximation
 * Uses v ∝ 1/sqrt(r) which approximates circular orbits in a simplified gravitational field
 * Note: This is an approximation for visualization purposes, not a full numerical simulation
 * @param {number} distance - Distance from sun
 * @param {number} sunMass - Mass of the sun (relative, default 1.0)
 * @returns {number} Orbital speed in radians per second
 */
export function calculateKeplerianOrbitalSpeedApproximation(distance, sunMass = DEFAULT_SUN_MASS) {
  // Simplified Kepler's law: v ∝ 1/sqrt(r)
  // For our scale, we use a simplified version
  const speedFactor = 1 / Math.sqrt(distance);
  return BASE_ORBITAL_SPEED * speedFactor * Math.sqrt(sunMass);
}

/**
 * @deprecated Use calculateKeplerianOrbitalSpeedApproximation instead
 * Legacy alias for backward compatibility
 */
export function calculateOrbitalSpeed(distance, sunMass = DEFAULT_SUN_MASS) {
  return calculateKeplerianOrbitalSpeedApproximation(distance, sunMass);
}

/**
 * Update planet rotation with realistic speeds
 * @param {THREE.Mesh} planet - Planet mesh
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updatePlanetRotation(planet, deltaTime = 0.016) {
  if (!planet || !planet.userData) {
    return;
  }

  const userData = planet.userData;

  // Calculate realistic rotation speed if not already set
  if (!userData.rotationSpeed) {
    userData.rotationSpeed = calculateRealisticRotationSpeed(
      userData.size,
      userData.distance
    );
  }

  // Apply rotation with delta time for frame-rate independence
  // rotationSpeed is defined in radians per second, so just multiply by deltaTime
  planet.rotation.y += userData.rotationSpeed * deltaTime;
}

/**
 * Update all planets with realistic mechanics
 * @param {Array} planets - Array of planet meshes
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateCelestialMechanics(planets, deltaTime = 0.016) {
  planets.forEach(planet => {
    updatePlanetRotation(planet, deltaTime);
  });
}

