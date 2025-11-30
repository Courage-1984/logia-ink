/**
 * Convert Poster Image to Modern Formats
 * Converts ripples-poster.jpg to WebP and AVIF formats
 *
 * Usage:
 *   npm run convert-poster
 *
 * Requirements:
 *   npm install sharp
 */

import sharp from 'sharp';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const POSTER_PATH = join(__dirname, '../assets/video/optimized/ripples-poster.jpg');
const OUTPUT_DIR = dirname(POSTER_PATH);

async function convertPoster() {
  console.log('🖼️  Converting poster image to modern formats...\n');

  if (!existsSync(POSTER_PATH)) {
    console.error(`❌ Poster image not found: ${POSTER_PATH}`);
    console.error('   Run npm run optimize-video first to generate the poster image.');
    process.exit(1);
  }

  try {
    const webpPath = join(OUTPUT_DIR, 'ripples-poster.webp');
    const avifPath = join(OUTPUT_DIR, 'ripples-poster.avif');

    console.log('📦 Converting to WebP...');
    await sharp(POSTER_PATH)
      .webp({
        quality: 85,
        effort: 6,
      })
      .toFile(webpPath);

    const webpStats = await import('fs/promises').then(m => m.stat(webpPath));
    console.log(`   ✅ WebP: ${(webpStats.size / 1024).toFixed(2)} KB`);

    console.log('📦 Converting to AVIF...');
    await sharp(POSTER_PATH)
      .avif({
        quality: 80,
        effort: 4,
      })
      .toFile(avifPath);

    const avifStats = await import('fs/promises').then(m => m.stat(avifPath));
    console.log(`   ✅ AVIF: ${(avifStats.size / 1024).toFixed(2)} KB`);

    const jpgStats = await import('fs/promises').then(m => m.stat(POSTER_PATH));
    const webpSavings = (((jpgStats.size - webpStats.size) / jpgStats.size) * 100).toFixed(1);
    const avifSavings = (((jpgStats.size - avifStats.size) / jpgStats.size) * 100).toFixed(1);

    console.log(`\n📊 Original JPG: ${(jpgStats.size / 1024).toFixed(2)} KB`);
    console.log(`   WebP savings: ${webpSavings}%`);
    console.log(`   AVIF savings: ${avifSavings}%`);
    console.log('\n✅ Poster image formats generated successfully!');
  } catch (error) {
    console.error('❌ Error converting poster:', error.message);
    process.exit(1);
  }
}

convertPoster();

