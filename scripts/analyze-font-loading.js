/**
 * Font Loading Performance Analysis Script
 *
 * Analyzes font loading strategy:
 * - Font preloading
 * - Font-display values
 * - Font file sizes
 * - Font loading performance recommendations
 *
 * Based on Phase 4: Performance Profiling & Analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Find all HTML files
 */
async function findHTMLFiles() {
  const htmlFiles = await glob('*.html', {
    cwd: projectRoot,
    ignore: ['node_modules/**', 'dist/**', '.old/**'],
    absolute: true,
  });
  return htmlFiles;
}

/**
 * Parse font preload links from HTML
 */
function parseFontPreloads(content) {
  const preloads = [];
  const preloadRegex = /<link[^>]*rel=["']preload["'][^>]*as=["']font["'][^>]*>/gi;
  const matches = content.matchAll(preloadRegex);

  for (const match of matches) {
    const link = match[0];
    const hrefMatch = link.match(/href=["']([^"']+)["']/i);
    const crossoriginMatch = link.match(/crossorigin=["']([^"']+)["']/i);

    if (hrefMatch) {
      preloads.push({
        href: hrefMatch[1],
        crossorigin: crossoriginMatch ? crossoriginMatch[1] : null,
        fullTag: link,
      });
    }
  }

  return preloads;
}

/**
 * Parse @font-face declarations from CSS
 */
function parseFontFaces(content) {
  const fontFaces = [];
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;

  while ((match = fontFaceRegex.exec(content)) !== null) {
    const block = match[1];
    const fontFace = {
      family: null,
      src: [],
      weight: null,
      style: null,
      display: null,
    };

    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/i);
    if (familyMatch) {
      fontFace.family = familyMatch[1].trim();
    }

    const srcMatch = block.match(/src:\s*([^;]+)/i);
    if (srcMatch) {
      const srcValue = srcMatch[1];
      const urlRegex = /url\(['"]?([^'")]+)['"]?\)/gi;
      let urlMatch;
      while ((urlMatch = urlRegex.exec(srcValue)) !== null) {
        fontFace.src.push(urlMatch[1].trim());
      }
    }

    const weightMatch = block.match(/font-weight:\s*(\d+|normal|bold)/i);
    if (weightMatch) {
      fontFace.weight = weightMatch[1];
    }

    const styleMatch = block.match(/font-style:\s*(normal|italic|oblique)/i);
    if (styleMatch) {
      fontFace.style = styleMatch[1];
    }

    const displayMatch = block.match(/font-display:\s*(\w+)/i);
    if (displayMatch) {
      fontFace.display = displayMatch[1];
    } else {
      fontFace.display = 'auto'; // Default
    }

    fontFaces.push(fontFace);
  }

  return fontFaces;
}

/**
 * Get font file size
 */
function getFontFileSize(fontPath) {
  // Handle relative paths
  const fullPath = path.isAbsolute(fontPath)
    ? fontPath
    : path.resolve(projectRoot, fontPath);

  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    return stats.size;
  }

  // Try in assets/fonts
  const assetsPath = path.join(projectRoot, 'assets', 'fonts', fontPath);
  if (fs.existsSync(assetsPath)) {
    const stats = fs.statSync(assetsPath);
    return stats.size;
  }

  return null;
}

/**
 * Format bytes
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return 'Unknown';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Analyzing Font Loading Performance...\n');

  // Find HTML files
  const htmlFiles = await findHTMLFiles();
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Find CSS files
  const cssFiles = await glob('css/**/*.css', {
    cwd: projectRoot,
    ignore: ['**/*.backup', '**/node_modules/**', '**/dist/**'],
    absolute: true,
  });

  // Collect all font preloads from HTML
  const allPreloads = [];
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const preloads = parseFontPreloads(content);
    preloads.forEach(p => {
      p.sourceFile = path.relative(projectRoot, htmlFile);
    });
    allPreloads.push(...preloads);
  }

  // Collect all @font-face declarations
  const allFontFaces = [];
  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf8');
    const fontFaces = parseFontFaces(content);
    fontFaces.forEach(f => {
      f.sourceFile = path.relative(projectRoot, cssFile);
    });
    allFontFaces.push(...fontFaces);
  }

  console.log(`Found ${allPreloads.length} font preloads in HTML\n`);
  console.log(`Found ${allFontFaces.length} @font-face declarations in CSS\n`);

  // Analyze font loading strategy
  const analysis = {
    preloads: allPreloads,
    fontFaces: allFontFaces,
    criticalFonts: [],
    nonCriticalFonts: [],
    recommendations: [],
  };

  // Categorize fonts
  allFontFaces.forEach(face => {
    const fontInfo = {
      family: face.family,
      weight: face.weight,
      style: face.style,
      display: face.display,
      src: face.src,
      fileSize: null,
      preloaded: false,
      sourceFile: face.sourceFile,
    };

    // Check if font is preloaded
    const preloaded = allPreloads.some(preload => {
      return face.src.some(src => {
        const srcPath = src.replace(/^\.\.\//, '');
        return preload.href.includes(srcPath) || srcPath.includes(preload.href);
      });
    });
    fontInfo.preloaded = preloaded;

    // Get file size
    if (face.src.length > 0) {
      const firstSrc = face.src[0];
      fontInfo.fileSize = getFontFileSize(firstSrc);
    }

    // Categorize by font-display
    if (face.display === 'swap') {
      analysis.criticalFonts.push(fontInfo);
    } else {
      analysis.nonCriticalFonts.push(fontInfo);
    }
  });

  // Print summary
  console.log('📊 Font Loading Summary:\n');
  console.log(`Critical fonts (font-display: swap): ${analysis.criticalFonts.length}`);
  console.log(`Non-critical fonts (font-display: optional/auto): ${analysis.nonCriticalFonts.length}`);
  console.log(`Preloaded fonts: ${analysis.criticalFonts.filter(f => f.preloaded).length} / ${analysis.criticalFonts.length}\n`);

  // Print critical fonts
  if (analysis.criticalFonts.length > 0) {
    console.log('🎯 Critical Fonts (font-display: swap):\n');
    analysis.criticalFonts.forEach((font, index) => {
      const preloadStatus = font.preloaded ? '✅' : '❌';
      const size = font.fileSize ? formatBytes(font.fileSize) : 'Unknown';
      console.log(`${index + 1}. ${preloadStatus} ${font.family} (${font.weight || 'normal'})`);
      console.log(`   Size: ${size}`);
      console.log(`   Preloaded: ${font.preloaded ? 'Yes' : 'No'}`);
      console.log(`   Source: ${font.sourceFile}`);
      console.log('');
    });
  }

  // Print non-critical fonts
  if (analysis.nonCriticalFonts.length > 0) {
    console.log('📦 Non-Critical Fonts (font-display: optional/auto):\n');
    analysis.nonCriticalFonts.forEach((font, index) => {
      const size = font.fileSize ? formatBytes(font.fileSize) : 'Unknown';
      console.log(`${index + 1}. ${font.family} (${font.weight || 'normal'})`);
      console.log(`   Size: ${size}`);
      console.log(`   Display: ${font.display}`);
      console.log(`   Source: ${font.sourceFile}`);
      console.log('');
    });
  }

  // Generate recommendations
  const unPreloadedCritical = analysis.criticalFonts.filter(f => !f.preloaded);
  if (unPreloadedCritical.length > 0) {
    analysis.recommendations.push({
      type: 'preload',
      severity: 'warning',
      message: `${unPreloadedCritical.length} critical font(s) not preloaded`,
      fonts: unPreloadedCritical.map(f => `${f.family} (${f.weight || 'normal'})`),
      recommendation: 'Consider preloading critical fonts for faster LCP',
    });
  }

  const autoDisplay = analysis.fontFaces.filter(f => f.display === 'auto');
  if (autoDisplay.length > 0) {
    analysis.recommendations.push({
      type: 'font-display',
      severity: 'info',
      message: `${autoDisplay.length} font(s) using default font-display: auto`,
      recommendation: 'Consider explicitly setting font-display: swap or optional',
    });
  }

  // Print recommendations
  if (analysis.recommendations.length > 0) {
    console.log('💡 Recommendations:\n');
    analysis.recommendations.forEach(rec => {
      const icon = rec.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${rec.message}`);
      if (rec.fonts) {
        rec.fonts.forEach(f => console.log(`   - ${f}`));
      }
      console.log(`   Recommendation: ${rec.recommendation}\n`);
    });
  } else {
    console.log('✅ Font loading strategy is optimal!\n');
  }

  // Calculate total font size
  const totalFontSize = analysis.fontFaces.reduce((total, face) => {
    if (face.src.length > 0) {
      const size = getFontFileSize(face.src[0]);
      return total + (size || 0);
    }
    return total;
  }, 0);

  console.log(`📦 Total Font Size: ${formatBytes(totalFontSize)}\n`);

  // Save report
  const reportPath = path.join(projectRoot, 'audit-reports', 'font-loading-analysis.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2), 'utf8');

  console.log(`✅ Detailed report saved to: audit-reports/font-loading-analysis.json`);
}

main().catch(console.error);

