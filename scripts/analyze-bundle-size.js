/**
 * CSS Bundle Size Analysis Script
 *
 * Analyzes CSS bundle size in production build:
 * - Total CSS size (raw and gzipped)
 * - Per-file breakdown
 * - Largest files
 * - Compression ratios
 * - Comparison with targets
 *
 * Based on Phase 4: Performance Profiling & Analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Performance targets (from master guide)
const TARGETS = {
  totalCSS: 100 * 1024, // 100KB gzipped
  largestFile: 50 * 1024, // 50KB gzipped
  totalFiles: 20, // Max 20 CSS files
};

/**
 * Get file size
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Get gzipped size
 */
function getGzippedSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = gzipSync(content);
    return gzipped.length;
  } catch (error) {
    return 0;
  }
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Calculate compression ratio
 */
function compressionRatio(raw, gzipped) {
  if (raw === 0) return 0;
  return ((raw - gzipped) / raw * 100).toFixed(1);
}

/**
 * Main execution
 */
async function main() {
  console.log('📊 Analyzing CSS Bundle Size...\n');

  // Check if dist directory exists
  const distDir = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distDir)) {
    console.log('⚠️  dist/ directory not found. Running build first...\n');
    console.log('Please run: npm run build\n');
    return;
  }

  // Find all CSS files in dist
  const cssFiles = await glob('**/*.css', {
    cwd: distDir,
    absolute: true,
  });

  if (cssFiles.length === 0) {
    console.log('⚠️  No CSS files found in dist/. Please run: npm run build\n');
    return;
  }

  console.log(`Found ${cssFiles.length} CSS files in dist/\n`);

  // Analyze each file
  const fileAnalysis = [];
  let totalRaw = 0;
  let totalGzipped = 0;

  for (const file of cssFiles) {
    const relativePath = path.relative(distDir, file);
    const rawSize = getFileSize(file);
    const gzippedSize = getGzippedSize(file);
    const ratio = compressionRatio(rawSize, gzippedSize);

    totalRaw += rawSize;
    totalGzipped += gzippedSize;

    fileAnalysis.push({
      file: relativePath,
      rawSize,
      gzippedSize,
      ratio: parseFloat(ratio),
    });
  }

  // Sort by gzipped size (largest first)
  fileAnalysis.sort((a, b) => b.gzippedSize - a.gzippedSize);

  // Calculate overall compression ratio
  const overallRatio = compressionRatio(totalRaw, totalGzipped);

  // Print summary
  console.log('📊 Bundle Size Summary:\n');
  console.log(`Total CSS files: ${cssFiles.length}`);
  console.log(`Total raw size: ${formatBytes(totalRaw)}`);
  console.log(`Total gzipped size: ${formatBytes(totalGzipped)}`);
  console.log(`Overall compression: ${overallRatio}%\n`);

  // Compare with targets
  console.log('🎯 Target Comparison:\n');
  const totalTarget = TARGETS.totalCSS;
  const totalStatus = totalGzipped <= totalTarget ? '✅' : '⚠️';
  console.log(`${totalStatus} Total CSS: ${formatBytes(totalGzipped)} / ${formatBytes(totalTarget)} target`);

  const filesTarget = TARGETS.totalFiles;
  const filesStatus = cssFiles.length <= filesTarget ? '✅' : '⚠️';
  console.log(`${filesStatus} File count: ${cssFiles.length} / ${filesTarget} target`);

  if (fileAnalysis.length > 0) {
    const largest = fileAnalysis[0];
    const largestTarget = TARGETS.largestFile;
    const largestStatus = largest.gzippedSize <= largestTarget ? '✅' : '⚠️';
    console.log(`${largestStatus} Largest file: ${formatBytes(largest.gzippedSize)} / ${formatBytes(largestTarget)} target`);
  }
  console.log('');

  // Print file breakdown
  console.log('📄 File Breakdown (sorted by gzipped size):\n');
  fileAnalysis.forEach((file, index) => {
    const status = file.gzippedSize > TARGETS.largestFile ? '⚠️' : '✅';
    console.log(`${index + 1}. ${status} ${file.file}`);
    console.log(`   Raw: ${formatBytes(file.rawSize)} | Gzipped: ${formatBytes(file.gzippedSize)} | Compression: ${file.ratio}%`);
  });
  console.log('');

  // Identify issues
  const issues = [];

  if (totalGzipped > TARGETS.totalCSS) {
    const overage = totalGzipped - TARGETS.totalCSS;
    issues.push({
      type: 'total-size',
      severity: 'warning',
      message: `Total CSS size (${formatBytes(totalGzipped)}) exceeds target (${formatBytes(TARGETS.totalCSS)}) by ${formatBytes(overage)}`,
      recommendation: 'Consider code splitting, removing unused CSS, or further optimization',
    });
  }

  if (cssFiles.length > TARGETS.totalFiles) {
    issues.push({
      type: 'file-count',
      severity: 'info',
      message: `Number of CSS files (${cssFiles.length}) exceeds target (${TARGETS.totalFiles})`,
      recommendation: 'Consider consolidating files or using CSS imports more efficiently',
    });
  }

  const largeFiles = fileAnalysis.filter(f => f.gzippedSize > TARGETS.largestFile);
  if (largeFiles.length > 0) {
    issues.push({
      type: 'large-files',
      severity: 'warning',
      message: `${largeFiles.length} file(s) exceed ${formatBytes(TARGETS.largestFile)} target`,
      files: largeFiles.map(f => ({ file: f.file, size: formatBytes(f.gzippedSize) })),
      recommendation: 'Consider splitting large files or removing unused styles',
    });
  }

  // Print recommendations
  if (issues.length > 0) {
    console.log('💡 Recommendations:\n');
    issues.forEach(issue => {
      const icon = issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${issue.message}`);
      if (issue.files) {
        issue.files.forEach(f => {
          console.log(`   - ${f.file}: ${f.size}`);
        });
      }
      console.log(`   Recommendation: ${issue.recommendation}\n`);
    });
  } else {
    console.log('✅ All bundle size targets met!\n');
  }

  // Save report
  const report = {
    summary: {
      totalFiles: cssFiles.length,
      totalRawSize: totalRaw,
      totalGzippedSize: totalGzipped,
      overallCompression: parseFloat(overallRatio),
      targets: TARGETS,
      meetsTargets: {
        totalSize: totalGzipped <= TARGETS.totalCSS,
        fileCount: cssFiles.length <= TARGETS.totalFiles,
        largestFile: fileAnalysis.length > 0 ? fileAnalysis[0].gzippedSize <= TARGETS.largestFile : true,
      },
    },
    files: fileAnalysis,
    issues,
  };

  const reportPath = path.join(projectRoot, 'audit-reports', 'bundle-size-analysis.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log(`✅ Detailed report saved to: audit-reports/bundle-size-analysis.json`);
}

main().catch(console.error);

