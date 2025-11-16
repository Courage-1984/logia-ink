/**
 * Procedural Noise Generation
 * Provides noise functions for procedural texture generation
 * Uses improved Perlin noise implementation for better quality
 */

// Permutation table for Perlin noise (256 values)
const PERMUTATION = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
  247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
  74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
  65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
  52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
  119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
  218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
  184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];

// Double the permutation table for wrapping
const P = [...PERMUTATION, ...PERMUTATION];

/**
 * Fade function for smooth interpolation (6t^5 - 15t^4 + 10t^3)
 * @param {number} t - Input value (0-1)
 * @returns {number} Faded value
 */
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Linear interpolation
 * @param {number} a - First value
 * @param {number} b - Second value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(a, b, t) {
  return a + t * (b - a);
}

/**
 * Gradient function for Perlin noise
 * @param {number} hash - Hash value
 * @param {number} x - X component
 * @param {number} y - Y component
 * @param {number} z - Z component (optional, for 3D)
 * @returns {number} Gradient value
 */
function grad(hash, x, y, z = 0) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

/**
 * Improved 2D Perlin noise function
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} seed - Random seed offset
 * @returns {number} Noise value (-1 to 1, typically normalized to 0-1)
 */
export function noise(x, y, seed = 0) {
  // Find unit grid cell containing point
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;

  // Get relative x,y coordinates of point within that cell
  x -= Math.floor(x);
  y -= Math.floor(y);

  // Compute fade curves for each of x,y
  const u = fade(x);
  const v = fade(y);

  // Hash coordinates of the 4 square corners
  const A = (P[X] + Y + seed) & 255;
  const AA = (P[A] + seed) & 255;
  const AB = (P[A + 1] + seed) & 255;
  const B = (P[X + 1] + Y + seed) & 255;
  const BA = (P[B] + seed) & 255;
  const BB = (P[B + 1] + seed) & 255;

  // And add blended results from 4 corners of the square
  return lerp(
    lerp(grad(P[AA], x, y), grad(P[BA], x - 1, y), u),
    lerp(grad(P[AB], x, y - 1), grad(P[BB], x - 1, y - 1), u),
    v
  );
}

/**
 * 3D Perlin noise function
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @param {number} seed - Random seed offset
 * @returns {number} Noise value (-1 to 1, typically normalized to 0-1)
 */
export function noise3D(x, y, z, seed = 0) {
  // Find unit grid cell containing point
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  // Get relative x,y,z coordinates of point within that cell
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);

  // Compute fade curves for each of x,y,z
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);

  // Hash coordinates of the 8 cube corners
  const A = (P[X] + Y + seed) & 255;
  const AA = (P[A] + Z + seed) & 255;
  const AB = (P[A + 1] + Z + seed) & 255;
  const B = (P[X + 1] + Y + seed) & 255;
  const BA = (P[B] + Z + seed) & 255;
  const BB = (P[B + 1] + Z + seed) & 255;

  // And add blended results from 8 corners of the cube
  return lerp(
    lerp(
      lerp(grad(P[AA], x, y, z), grad(P[BA], x - 1, y, z), u),
      lerp(grad(P[AB], x, y - 1, z), grad(P[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(grad(P[AA + 1], x, y, z - 1), grad(P[BA + 1], x - 1, y, z - 1), u),
      lerp(grad(P[AB + 1], x, y - 1, z - 1), grad(P[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  );
}

/**
 * Smooth interpolation (smoothstep)
 * @param {number} edge0 - Lower edge
 * @param {number} edge1 - Upper edge
 * @param {number} x - Input value
 * @returns {number} Interpolated value
 */
export function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Fractal noise with multiple octaves
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} octaves - Number of octaves (default 4)
 * @param {number} persistence - Persistence value (default 0.5)
 * @param {number} scale - Scale factor (default 1)
 * @param {number} seed - Random seed (default 0)
 * @returns {number} Fractal noise value (0-1)
 */
export function fractalNoise(x, y, octaves = 4, persistence = 0.5, scale = 1, seed = 0) {
  let value = 0;
  let amplitude = 1;
  let frequency = scale;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    // Perlin noise returns -1 to 1, so we normalize to 0-1
    const n = (noise(x * frequency, y * frequency, seed + i) + 1) * 0.5;

    value += n * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return value / maxValue;
}

/**
 * 3D Fractal noise with multiple octaves
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @param {number} octaves - Number of octaves (default 4)
 * @param {number} persistence - Persistence value (default 0.5)
 * @param {number} scale - Scale factor (default 1)
 * @param {number} seed - Random seed (default 0)
 * @returns {number} Fractal noise value (0-1)
 */
export function fractalNoise3D(x, y, z, octaves = 4, persistence = 0.5, scale = 1, seed = 0) {
  let value = 0;
  let amplitude = 1;
  let frequency = scale;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    // Perlin noise returns -1 to 1, so we normalize to 0-1
    const n = (noise3D(x * frequency, y * frequency, z * frequency, seed + i) + 1) * 0.5;

    value += n * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return value / maxValue;
}

/**
 * Generate seamless noise value that wraps horizontally
 * @param {number} x - X coordinate (will be wrapped)
 * @param {number} y - Y coordinate
 * @param {number} width - Texture width for wrapping
 * @param {number} seed - Random seed
 * @returns {number} Seamless noise value (0-1, normalized from -1 to 1)
 */
export function seamlessNoise(x, y, width, seed = 0) {
  // Wrap x coordinate
  const wrappedX = ((x % width) + width) % width;
  // Perlin noise returns -1 to 1, normalize to 0-1
  return (noise(wrappedX, y, seed) + 1) * 0.5;
}

/**
 * Generate seamless fractal noise that wraps horizontally
 * @param {number} x - X coordinate (will be wrapped)
 * @param {number} y - Y coordinate
 * @param {number} width - Texture width for wrapping
 * @param {number} octaves - Number of octaves
 * @param {number} persistence - Persistence value
 * @param {number} scale - Scale factor
 * @param {number} seed - Random seed
 * @returns {number} Seamless fractal noise value (0-1)
 */
export function seamlessFractalNoise(x, y, width, octaves = 4, persistence = 0.5, scale = 1, seed = 0) {
  let value = 0;
  let amplitude = 1;
  let frequency = scale;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    // Wrap X coordinate for seamless horizontal wrapping
    const wrappedX = ((x * frequency) % width + width) % width;
    // Perlin noise returns -1 to 1, so we normalize to 0-1
    const n = (noise(wrappedX, y * frequency, seed + i) + 1) * 0.5;

    value += n * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return value / maxValue;
}

