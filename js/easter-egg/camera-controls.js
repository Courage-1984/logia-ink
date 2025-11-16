/**
 * Enhanced Camera Controls Module
 * Handles smooth orbital camera, speed controls, preset positions, and camera path animations
 */

let cameraSpeed = 1.0; // Speed multiplier (slow: 0.5, normal: 1.0, fast: 2.0)
let cameraVelocity = null;
let lastCameraPosition = null;
let THREE = null;

/**
 * Initialize camera controls (call this first)
 * @param {Object} threeJS - Three.js library
 */
export function initCameraControls(threeJS) {
  THREE = threeJS || window.THREE;
  if (THREE) {
    cameraVelocity = new THREE.Vector3();
    lastCameraPosition = new THREE.Vector3();
  }
}
let isAnimating = false;
let animationTween = null;

/**
 * Camera preset positions
 */
export const CameraPresets = {
  GALAXY_VIEW: {
    position: { x: 0, y: 0, z: 150 },
    rotation: { x: 0, y: 0, z: 0 },
    distance: 150,
    name: 'Galaxy View',
  },
  SOLAR_SYSTEM_VIEW: {
    position: { x: 0, y: 30, z: 80 },
    rotation: { x: -0.3, y: 0, z: 0 },
    distance: 80,
    name: 'Solar System View',
  },
  PLANET_CLOSEUP: {
    position: { x: 0, y: 0, z: 20 },
    rotation: { x: 0, y: 0, z: 0 },
    distance: 20,
    name: 'Planet Close-up',
  },
};

/**
 * Set camera speed
 * @param {string} speed - 'slow', 'normal', or 'fast'
 */
export function setCameraSpeed(speed) {
  switch (speed) {
    case 'slow':
      cameraSpeed = 0.5;
      break;
    case 'normal':
      cameraSpeed = 1.0;
      break;
    case 'fast':
      cameraSpeed = 2.0;
      break;
    default:
      cameraSpeed = 1.0;
  }
}

/**
 * Get current camera speed
 * @returns {number} Current speed multiplier
 */
export function getCameraSpeed() {
  return cameraSpeed;
}

/**
 * Smooth camera transition to preset position
 * @param {THREE.Camera} camera - Camera to animate
 * @param {Object} preset - Preset configuration
 * @param {number} duration - Animation duration in ms
 * @param {Function} onComplete - Callback when animation completes
 */
export function transitionToPreset(camera, preset, duration = 2000, onComplete = null) {
  if (!camera || !preset || !THREE) {
    return;
  }

  if (isAnimating && animationTween) {
    animationTween.stop();
  }

  isAnimating = true;

  const startPosition = camera.position.clone();
  const startRotation = {
    x: camera.rotation.x,
    y: camera.rotation.y,
    z: camera.rotation.z,
  };

  const targetPosition = new (THREE || window.THREE).Vector3(
    preset.position.x,
    preset.position.y,
    preset.position.z
  );
  const targetRotation = preset.rotation;

  let progress = 0;
  const startTime = Date.now();

  function animate() {
    if (!isAnimating) {
      return;
    }

    progress = (Date.now() - startTime) / duration;
    if (progress > 1) {
      progress = 1;
    }

    // Smooth ease in-out
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Interpolate position
    camera.position.lerpVectors(startPosition, targetPosition, ease);

    // Interpolate rotation
    camera.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * ease;
    camera.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * ease;
    camera.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * ease;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
      if (onComplete) {
        onComplete();
      }
    }
  }

  animationTween = { stop: () => { isAnimating = false; } };
  animate();
}

/**
 * Create smooth orbital camera controls
 * @param {THREE.Camera} camera - Camera to control
 * @param {THREE.Vector3} target - Target to orbit around
 * @param {Object} options - Control options
 * @returns {Object} Control functions
 */
export function createOrbitalControls(camera, target, options = {}) {
  if (!THREE) {
    THREE = window.THREE;
  }
  if (!THREE) {
    return null;
  }

  const {
    minDistance = 1,
    maxDistance = 1000,
    minPolarAngle = 0,
    maxPolarAngle = Math.PI,
    enableDamping = true,
    dampingFactor = 0.05,
  } = options;

  let spherical = new THREE.Spherical();
  spherical.setFromVector3(camera.position.clone().sub(target));
  let sphericalDelta = new THREE.Spherical();

  let rotateStart = new THREE.Vector2();
  let rotateEnd = new THREE.Vector2();
  let rotateDelta = new THREE.Vector2();

  let zoomStart = 0;
  let zoomEnd = 0;
  let zoomDelta = 0;

  let panStart = new THREE.Vector2();
  let panEnd = new THREE.Vector2();
  let panDelta = new THREE.Vector2();

  let isRotating = false;
  let isZooming = false;
  let isPanning = false;

  function update() {
    const offset = new THREE.Vector3();
    let quat = new THREE.Quaternion().setFromUnitVectors(
      camera.up.clone(),
      new THREE.Vector3(0, 1, 0)
    );
    let quatInverse = quat.clone().invert();

    offset.copy(camera.position).sub(target);
    offset.applyQuaternion(quatInverse);
    spherical.setFromVector3(offset);

    if (enableDamping) {
      spherical.theta += sphericalDelta.theta * dampingFactor;
      spherical.phi += sphericalDelta.phi * dampingFactor;
    } else {
      spherical.theta += sphericalDelta.theta;
      spherical.phi += sphericalDelta.phi;
    }

    spherical.theta = Math.max(minPolarAngle, Math.min(maxPolarAngle, spherical.theta));
    spherical.makeSafe();

    spherical.radius += zoomDelta;
    spherical.radius = Math.max(minDistance, Math.min(maxDistance, spherical.radius));

    offset.setFromSpherical(spherical);
    offset.applyQuaternion(quat);
    camera.position.copy(target).add(offset);
    camera.lookAt(target);

    if (enableDamping) {
      sphericalDelta.theta *= (1 - dampingFactor);
      sphericalDelta.phi *= (1 - dampingFactor);
      zoomDelta *= (1 - dampingFactor);
    } else {
      sphericalDelta.set(0, 0, 0);
      zoomDelta = 0;
    }
  }

  function onMouseDown(event) {
    if (event.button === 0) {
      isRotating = true;
      rotateStart.set(event.clientX, event.clientY);
    } else if (event.button === 1) {
      isPanning = true;
      panStart.set(event.clientX, event.clientY);
    } else if (event.button === 2) {
      isZooming = true;
      zoomStart = event.clientY;
    }
  }

  function onMouseMove(event) {
    if (isRotating) {
      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(cameraSpeed * 0.002);
      sphericalDelta.theta -= rotateDelta.x;
      sphericalDelta.phi -= rotateDelta.y;
      rotateStart.copy(rotateEnd);
    }

    if (isPanning) {
      panEnd.set(event.clientX, event.clientY);
      panDelta.subVectors(panEnd, panStart).multiplyScalar(cameraSpeed * 0.01);
      target.x += panDelta.x;
      target.y -= panDelta.y;
      panStart.copy(panEnd);
    }

    if (isZooming) {
      zoomEnd = event.clientY;
      zoomDelta = (zoomEnd - zoomStart) * cameraSpeed * 0.01;
      zoomStart = zoomEnd;
    }
  }

  function onMouseUp() {
    isRotating = false;
    isZooming = false;
    isPanning = false;
  }

  function onWheel(event) {
    event.preventDefault();
    zoomDelta = event.deltaY * cameraSpeed * 0.001;
  }

  return {
    update,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    getTarget: () => target.clone(),
    setTarget: (newTarget) => {
      target.copy(newTarget);
    },
  };
}

/**
 * Create camera path animation
 * @param {THREE.Camera} camera - Camera to animate
 * @param {Array} keyframes - Array of {position, rotation, time} keyframes
 * @param {Function} onComplete - Callback when animation completes
 */
export function animateCameraPath(camera, keyframes, onComplete = null) {
  if (!camera || !keyframes || keyframes.length < 2 || !THREE) {
    return;
  }

  if (isAnimating && animationTween) {
    animationTween.stop();
  }

  isAnimating = true;
  let currentKeyframe = 0;
  let startTime = Date.now();

  function animate() {
    if (!isAnimating) {
      return;
    }

    const elapsed = Date.now() - startTime;
    const currentKF = keyframes[currentKeyframe];
    const nextKF = keyframes[currentKeyframe + 1];

    if (!nextKF) {
      isAnimating = false;
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const segmentTime = nextKF.time - currentKF.time;
    const segmentElapsed = elapsed - currentKF.time;
    const progress = Math.min(1, segmentElapsed / segmentTime);

    // Smooth interpolation
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Interpolate position
    const currentPos = new THREE.Vector3(currentKF.position.x, currentKF.position.y, currentKF.position.z);
    const nextPos = new THREE.Vector3(nextKF.position.x, nextKF.position.y, nextKF.position.z);
    camera.position.lerpVectors(currentPos, nextPos, ease);

    // Interpolate rotation
    camera.rotation.x = currentKF.rotation.x + (nextKF.rotation.x - currentKF.rotation.x) * ease;
    camera.rotation.y = currentKF.rotation.y + (nextKF.rotation.y - currentKF.rotation.y) * ease;
    camera.rotation.z = currentKF.rotation.z + (nextKF.rotation.z - currentKF.rotation.z) * ease;

    if (progress >= 1) {
      currentKeyframe++;
      if (currentKeyframe >= keyframes.length - 1) {
        isAnimating = false;
        if (onComplete) {
          onComplete();
        }
        return;
      }
    }

    requestAnimationFrame(animate);
  }

  animationTween = { stop: () => { isAnimating = false; } };
  startTime = Date.now() - currentKeyframe;
  animate();
}

/**
 * Update camera velocity for motion blur
 * @param {THREE.Camera} camera - Camera
 * @returns {THREE.Vector3} Camera velocity
 */
export function updateCameraVelocity(camera) {
  if (!camera || !THREE || !cameraVelocity || !lastCameraPosition) {
    // Return zero vector if not initialized
    if (THREE && THREE.Vector3) {
      return new THREE.Vector3();
    }
    return { x: 0, y: 0, z: 0 };
  }

  const currentPosition = camera.position.clone();
  cameraVelocity.subVectors(currentPosition, lastCameraPosition);
  lastCameraPosition.copy(currentPosition);

  return cameraVelocity.clone();
}

/**
 * Stop any ongoing camera animation
 */
export function stopCameraAnimation() {
  isAnimating = false;
  if (animationTween) {
    animationTween.stop();
    animationTween = null;
  }
}

