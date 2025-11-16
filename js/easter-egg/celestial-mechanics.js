/**
 * Celestial Mechanics Module
 * Handles accurate orbital mechanics, Lagrange points, and realistic planet rotation
 */

/**
 * Calculate Lagrange points (L4 and L5) for a planet-sun system
 * L4 and L5 are stable points 60° ahead and behind the planet
 * @param {Object} THREE - Three.js library
 * @param {THREE.Vector3} sunPosition - Position of the sun
 * @param {THREE.Vector3} planetPosition - Position of the planet
 * @param {number} planetDistance - Distance from sun to planet
 * @returns {Object} L4 and L5 positions
 */
export function calculateLagrangePoints(THREE, sunPosition, planetPosition, planetDistance) {
  // Calculate angle of planet from sun
  const angle = Math.atan2(planetPosition.z, planetPosition.x);

  // L4 is 60° ahead (counter-clockwise)
  const l4Angle = angle + Math.PI / 3;
  const l4Position = new (THREE || window.THREE).Vector3(
    Math.cos(l4Angle) * planetDistance,
    planetPosition.y,
    Math.sin(l4Angle) * planetDistance
  );

  // L5 is 60° behind (clockwise)
  const l5Angle = angle - Math.PI / 3;
  const l5Position = new (THREE || window.THREE).Vector3(
    Math.cos(l5Angle) * planetDistance,
    planetPosition.y,
    Math.sin(l5Angle) * planetDistance
  );

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

  const lagrangePoints = calculateLagrangePoints(
    THREE || window.THREE,
    sun.position,
    planet.position,
    planetDistance
  );

  lagrangeGroup.userData.l4Marker.position.copy(lagrangePoints.l4);
  lagrangeGroup.userData.l5Marker.position.copy(lagrangePoints.l5);
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
  return sizeFactor * distanceFactor * 0.002;
}

/**
 * Calculate realistic orbital speed using Kepler's laws
 * v = sqrt(GM/r) where G*M is simplified for our scale
 * @param {number} distance - Distance from sun
 * @param {number} sunMass - Mass of the sun (relative)
 * @returns {number} Orbital speed
 */
export function calculateOrbitalSpeed(distance, sunMass = 1) {
  // Simplified Kepler's law: v ∝ 1/sqrt(r)
  // For our scale, we use a simplified version
  const baseSpeed = 0.001;
  const speedFactor = 1 / Math.sqrt(distance);
  return baseSpeed * speedFactor * Math.sqrt(sunMass);
}

/**
 * Update planet rotation with realistic speeds
 * @param {THREE.Mesh} planet - Planet mesh
 */
export function updatePlanetRotation(planet) {
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

  // Apply rotation
  planet.rotation.y += userData.rotationSpeed;
}

/**
 * Update all planets with realistic mechanics
 * @param {Array} planets - Array of planet meshes
 */
export function updateCelestialMechanics(planets) {
  planets.forEach(planet => {
    updatePlanetRotation(planet);
  });
}

