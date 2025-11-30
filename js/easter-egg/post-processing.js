/**
 * Post-Processing Effects Module
 * Handles bloom, depth of field, color grading, and motion blur
 */

let composer = null;
let bloomPass = null;
let bokehPass = null;
let colorGradingPass = null;
let motionBlurPass = null;

/**
 * Setup post-processing pipeline
 * @param {Object} THREE - Three.js library
 * @param {THREE.WebGLRenderer} renderer - Renderer
 * @param {THREE.Scene} scene - Scene
 * @param {THREE.Camera} camera - Camera
 * @param {Object} options - Post-processing options
 * @returns {Object} Post-processing passes
 */
export function setupPostProcessing(THREE, renderer, scene, camera, options = {}) {
  const {
    enableBloom = true,
    enableDepthOfField = true,
    enableColorGrading = true,
    enableMotionBlur = true,
    bloomStrength = 1.5,
    bloomRadius = 0.4,
    bloomThreshold = 0.85,
    dofFocus = 1.0,
    dofAperture = 0.025,
    dofMaxBlur = 1.0,
  } = options;

  // Post-processing modules must be available via THREE.addons.postprocessing
  // This assumes explicit ES module imports are used elsewhere to populate THREE.addons:
  // import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
  // import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
  // import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
  // import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
  // import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
  // import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
  //
  // These should be imported and attached to THREE.addons.postprocessing before calling this function.
  if (!THREE.addons || !THREE.addons.postprocessing) {
    // Post-processing addons not available - return null to indicate fallback to standard rendering
    return null;
  }

  const postprocessing = THREE.addons.postprocessing;
  const EffectComposer = postprocessing.EffectComposer;
  const RenderPass = postprocessing.RenderPass;
  const UnrealBloomPass = postprocessing.UnrealBloomPass;
  const BokehPass = postprocessing.BokehPass;
  const ShaderPass = postprocessing.ShaderPass;
  const OutputPass = postprocessing.OutputPass;

  if (!EffectComposer || !RenderPass) {
    // Post-processing not available - return null to indicate fallback to standard rendering
    return null;
  }

  // Create composer
  composer = new EffectComposer(renderer);

  // Render pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Bloom pass
  if (enableBloom && UnrealBloomPass) {
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );
    composer.addPass(bloomPass);
  }

  // Depth of field pass
  if (enableDepthOfField && BokehPass) {
    bokehPass = new BokehPass(scene, camera, {
      focus: dofFocus,
      aperture: dofAperture,
      maxblur: dofMaxBlur,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    composer.addPass(bokehPass);
  }

  // Color grading pass (custom shader)
  if (enableColorGrading && ShaderPass) {
    const colorGradingShader = {
      uniforms: {
        tDiffuse: { value: null },
        saturation: { value: 1.2 },
        contrast: { value: 1.1 },
        brightness: { value: 1.0 },
        exposure: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float saturation;
        uniform float contrast;
        uniform float brightness;
        uniform float exposure;
        varying vec2 vUv;

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);

          // Apply exposure
          vec3 color = texel.rgb * exposure;

          // Apply brightness
          color *= brightness;

          // Apply contrast
          color = ((color - 0.5) * contrast) + 0.5;

          // Apply saturation
          float gray = dot(color, vec3(0.299, 0.587, 0.114));
          color = mix(vec3(gray), color, saturation);

          gl_FragColor = vec4(color, texel.a);
        }
      `,
    };

    colorGradingPass = new ShaderPass(colorGradingShader);
    composer.addPass(colorGradingPass);
  }

  // Motion blur pass (simplified - based on camera velocity)
  if (enableMotionBlur && ShaderPass) {
    const motionBlurShader = {
      uniforms: {
        tDiffuse: { value: null },
        velocity: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float velocity;
        varying vec2 vUv;

        void main() {
          vec2 offset = vec2(velocity * 0.01, 0.0);
          vec4 color1 = texture2D(tDiffuse, vUv);
          vec4 color2 = texture2D(tDiffuse, vUv + offset);
          vec4 color3 = texture2D(tDiffuse, vUv - offset);

          vec4 color = (color1 + color2 + color3) / 3.0;
          color.a = color1.a;

          gl_FragColor = color;
        }
      `,
    };

    motionBlurPass = new ShaderPass(motionBlurShader);
    composer.addPass(motionBlurPass);
  }

  // Output pass
  if (OutputPass) {
    const outputPass = new OutputPass();
    outputPass.renderToScreen = true;
    composer.addPass(outputPass);
  } else {
    // If no OutputPass, make last pass render to screen
    const lastPass = composer.passes[composer.passes.length - 1];
    if (lastPass) {
      lastPass.renderToScreen = true;
    }
  }

  return {
    composer,
    bloomPass,
    bokehPass,
    colorGradingPass,
    motionBlurPass,
  };
}

/**
 * Update post-processing effects
 * @param {THREE.Camera} camera - Camera
 * @param {THREE.Vector3} cameraVelocity - Camera velocity for motion blur
 * @param {THREE.Vector3|THREE.Object3D} focusTarget - Target to focus on for depth of field (Vector3 or Object3D)
 * @param {THREE.Raycaster} raycaster - Optional raycaster for dynamic focus calculation
 */
export function updatePostProcessing(camera, cameraVelocity = null, focusTarget = null, raycaster = null) {
  if (!composer) {
    return;
  }

  // Update depth of field focus
  if (bokehPass && focusTarget) {
    let distance;

    // If focusTarget is an Object3D, get its world position
    if (focusTarget.isObject3D) {
      const worldPos = new THREE.Vector3();
      focusTarget.getWorldPosition(worldPos);
      distance = camera.position.distanceTo(worldPos);
    } else if (focusTarget instanceof THREE.Vector3) {
      distance = camera.position.distanceTo(focusTarget);
    } else {
      // Fallback: use simple distance calculation
      distance = camera.position.distanceTo(focusTarget);
    }

    // Use raycaster for more accurate focus if available
    // Use recursive raycasting to check all nested children in scene hierarchy
    if (raycaster && focusTarget.isObject3D) {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      // Recursive flag ensures nested groups and children are checked
      const intersects = raycaster.intersectObject(focusTarget, true);
      if (intersects.length > 0) {
        distance = intersects[0].distance;
      }
    } else if (raycaster && focusTarget instanceof THREE.Scene) {
      // If focusTarget is the scene itself, raycast against all scene children recursively
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      const intersects = raycaster.intersectObjects(focusTarget.children, true);
      if (intersects.length > 0) {
        distance = intersects[0].distance;
      }
    }

    // Normalize distance based on camera's far plane or a reasonable range
    const cameraFar = camera.far || 1000;
    const normalizedDistance = Math.max(0.1, Math.min(1.0, distance / (cameraFar * 0.2)));
    bokehPass.uniforms.focus.value = normalizedDistance;
  }

  // Update motion blur based on camera velocity
  if (motionBlurPass && cameraVelocity) {
    const speed = cameraVelocity.length();
    motionBlurPass.uniforms.velocity.value = Math.min(1.0, speed * 0.1);
  }

  // Render with post-processing
  composer.render();
}

/**
 * Resize post-processing
 * @param {number} width - New width
 * @param {number} height - New height
 */
export function resizePostProcessing(width, height) {
  if (composer) {
    composer.setSize(width, height);
  }

  if (bloomPass) {
    bloomPass.setSize(width, height);
  }

  if (bokehPass) {
    bokehPass.setSize(width, height);
  }
}

/**
 * Set bloom intensity
 * @param {number} strength - Bloom strength
 */
export function setBloomStrength(strength) {
  if (bloomPass) {
    bloomPass.strength = strength;
  }
}

/**
 * Set depth of field focus
 * @param {number} focus - Focus distance (0-1)
 */
export function setDepthOfFieldFocus(focus) {
  if (bokehPass) {
    bokehPass.uniforms.focus.value = focus;
  }
}

/**
 * Get composer for direct access
 * @returns {EffectComposer} Composer instance
 */
export function getComposer() {
  return composer;
}

