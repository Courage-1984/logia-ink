/**
 * Nebula and Space Clouds Module
 * Handles procedural nebula clouds, star-forming regions, dust clouds, and fog effects
 */

/**
 * Create procedural nebula cloud
 * @param {Object} THREE - Three.js library
 * @param {THREE.Scene} scene - Scene to add nebula to
 * @param {Object} parameters - Nebula parameters
 * @returns {THREE.Points} Nebula cloud points
 */
export function createNebulaCloud(THREE, scene, parameters = {}) {
  const {
    count = 15000,
    size = 0.1,
    radius = 80,
    color = 0xff00ff,
    position = new THREE.Vector3(0, 0, 0),
    density = 0.5,
  } = parameters;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  const baseColor = new THREE.Color(color);

  // Generate cloud particles with density falloff
  // Use density parameter to control the exponent of the radius falloff
  const densityExponent = 1.0 + density * 1.5; // Range: 1.0 to 2.5
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Spherical distribution with density-controlled falloff
    // Higher density = denser at center (higher exponent)
    const r = Math.pow(Math.random(), densityExponent) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = position.x + r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = position.y + r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = position.z + r * Math.cos(phi);

    // Color variation (nebula colors)
    const colorVariation = (Math.random() - 0.5) * 0.3;
    const rColor = Math.max(0, Math.min(1, baseColor.r + colorVariation));
    const gColor = Math.max(0, Math.min(1, baseColor.g + colorVariation * 0.5));
    const bColor = Math.max(0, Math.min(1, baseColor.b + colorVariation * 0.8));

    colors[i3] = rColor;
    colors[i3 + 1] = gColor;
    colors[i3 + 2] = bColor;

    // Size variation
    sizes[i] = size * (0.5 + Math.random() * 0.5);

    // Opacity based on distance from center (denser at center)
    const distanceFactor = 1 - (r / radius);
    opacities[i] = density * distanceFactor * (0.5 + Math.random() * 0.5);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

  // Custom shader material for nebula with opacity support
  const nebulaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute float opacity;
      varying vec3 vColor;
      varying float vOpacity;

      void main() {
        vColor = color;
        vOpacity = opacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vOpacity;

      void main() {
        // Soft, circular point rendering for volumetric cloudy appearance
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        // Use smoothstep for soft, feathered edges
        float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
        alpha *= vOpacity;

        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const nebula = new THREE.Points(geometry, nebulaMaterial);
  nebula.position.copy(position);
  scene.add(nebula);

  // Store for animation
  nebula.userData.isNebula = true;
  nebula.userData.time = 0;

  return nebula;
}

/**
 * Create star-forming region with glowing effects
 * @param {Object} THREE - Three.js library
 * @param {THREE.Scene} scene - Scene to add region to
 * @param {Object} parameters - Region parameters
 * @returns {THREE.Group} Star-forming region group
 */
export function createStarFormingRegion(THREE, scene, parameters = {}) {
  const {
    position = new THREE.Vector3(0, 0, 0),
    size = 5,
    color = 0xff88ff,
    intensity = 2.0,
  } = parameters;

  const group = new THREE.Group();
  group.position.copy(position);

  // Central bright core
  const coreGeometry = new THREE.SphereGeometry(size, 32, 32);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: intensity,
    transparent: true,
    opacity: 0.8,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  // Outer glow layers
  for (let i = 0; i < 3; i++) {
    const glowSize = size * (1.5 + i * 0.5);
    const glowGeometry = new THREE.SphereGeometry(glowSize, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.1 / (i + 1),
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
  }

  // Add bright stars within the region
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(200 * 3);
  const starColors = new Float32Array(200 * 3);

  for (let i = 0; i < 200; i++) {
    const i3 = i * 3;
    const r = Math.random() * size * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    starPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = r * Math.cos(phi);

    const brightness = 0.8 + Math.random() * 0.2;
    starColors[i3] = brightness;
    starColors[i3 + 1] = brightness * 0.9;
    starColors[i3 + 2] = brightness * 0.7;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  group.add(stars);

  scene.add(group);

  group.userData.isStarFormingRegion = true;
  group.userData.core = core;
  group.userData.stars = stars;

  return group;
}

/**
 * Create dust cloud
 * @param {Object} THREE - Three.js library
 * @param {THREE.Scene} scene - Scene to add dust cloud to
 * @param {Object} parameters - Dust cloud parameters
 * @returns {THREE.Points} Dust cloud points
 */
export function createDustCloud(THREE, scene, parameters = {}) {
  const {
    count = 8000,
    size = 0.05,
    radius = 40,
    position = new THREE.Vector3(0, 0, 0),
    color = 0x888888,
    density = 0.3,
  } = parameters;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const baseColor = new THREE.Color(color);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Ellipsoid distribution for cloud shape
    const r = Math.pow(Math.random(), 1.2) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = position.x + r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = position.y + r * Math.sin(phi) * Math.sin(theta) * 0.6; // Flattened
    positions[i3 + 2] = position.z + r * Math.cos(phi);

    // Dust color (gray/brown)
    const brightness = 0.2 + Math.random() * 0.3;
    colors[i3] = baseColor.r * brightness;
    colors[i3 + 1] = baseColor.g * brightness;
    colors[i3 + 2] = baseColor.b * brightness;

    sizes[i] = size * (0.5 + Math.random() * 0.5);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: size,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: density,
    blending: THREE.NormalBlending,
  });

  const dustCloud = new THREE.Points(geometry, material);
  dustCloud.position.copy(position);
  scene.add(dustCloud);

  dustCloud.userData.isDustCloud = true;

  return dustCloud;
}

/**
 * Create interstellar medium (fog/atmosphere effect)
 * @param {Object} THREE - Three.js library
 * @param {THREE.Scene} scene - Scene to add fog to
 * @param {Object} parameters - Fog parameters
 * @returns {Object} Fog configuration
 */
export function createInterstellarMedium(THREE, scene, parameters = {}) {
  const {
    color = 0x000000,
    near = 50,
    far = 500,
    density = 0.0001,
  } = parameters;

  // Add fog to scene
  scene.fog = new THREE.FogExp2(color, density);

  return {
    fog: scene.fog,
    color,
    near,
    far,
    density,
  };
}

/**
 * Update nebula animation
 * @param {THREE.Points} nebula - Nebula to animate
 * @param {number} time - Current time
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateNebula(nebula, time, deltaTime = 0.016) {
  if (!nebula || !nebula.userData.isNebula || !nebula.material.uniforms) {
    return;
  }

  nebula.material.uniforms.time.value = time;

  // Subtle rotation with delta time for frame-rate independence
  nebula.rotation.y += 0.0001 * deltaTime * 60; // Normalize to 60fps
}

/**
 * Update star-forming region animation
 * @param {THREE.Group} region - Star-forming region to animate
 * @param {number} time - Current time
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateStarFormingRegion(region, time, deltaTime = 0.016) {
  if (!region || !region.userData.isStarFormingRegion) {
    return;
  }

  const core = region.userData.core;
  if (core && core.material) {
    // Pulsing glow effect
    const pulse = Math.sin(time * 0.5) * 0.3 + 0.7;
    core.material.emissiveIntensity = region.userData.baseIntensity * pulse;
  }

  // Rotate slowly with delta time for frame-rate independence
  region.rotation.y += 0.0002 * deltaTime * 60; // Normalize to 60fps
}

/**
 * Create multiple nebula clouds in the scene
 * @param {Object} THREE - Three.js library
 * @param {THREE.Scene} scene - Scene to add nebulas to
 * @param {number} count - Number of nebulas to create
 * @returns {Array} Array of nebula clouds
 */
export function createNebulaField(THREE, scene, count = 3) {
  const nebulas = [];
  const colors = [0xff00ff, 0x00ffff, 0xff0080, 0x0080ff, 0x80ff00];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;
    const position = new THREE.Vector3(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 30,
      Math.sin(angle) * distance
    );

    const nebula = createNebulaCloud(THREE, scene, {
      count: 10000 + Math.floor(Math.random() * 5000),
      size: 0.08 + Math.random() * 0.04,
      radius: 20 + Math.random() * 15,
      color: colors[i % colors.length],
      position: position,
      density: 0.3 + Math.random() * 0.2,
    });

    nebulas.push(nebula);
  }

  return nebulas;
}

