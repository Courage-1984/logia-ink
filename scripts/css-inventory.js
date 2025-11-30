/**
 * CSS Inventory Script
 * Analyzes all CSS files in the project
 * Based on CSS-Font-Optimization-COMPLETE-Master-Guide.md Section 8.1
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function analyzeCSSFiles() {
  console.log('🔍 Starting CSS Inventory Analysis...\n');

  // Find all CSS files
  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**', 'build/**', '.old/**']
  });

  const inventory = {
    totalFiles: cssFiles.length,
    files: [],
    totalLines: 0,
    totalSize: 0,
    largestFiles: [],
    statistics: {}
  };

  // Analyze each file
  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').length;
    const size = fs.statSync(file).size;
    const modified = fs.statSync(file).mtime;

    // Count various CSS features
    const classCount = (content.match(/\.[a-zA-Z][a-zA-Z0-9-_]*/g) || []).length;
    const idCount = (content.match(/#[a-zA-Z][a-zA-Z0-9-_]*/g) || []).length;
    const mediaQueryCount = (content.match(/@media/g) || []).length;
    const variableCount = (content.match(/--[a-zA-Z][a-zA-Z0-9-]*:/g) || []).length;
    const importantCount = (content.match(/!important/g) || []).length;
    const fontFaceCount = (content.match(/@font-face/g) || []).length;
    const importCount = (content.match(/@import/g) || []).length;

    const fileInfo = {
      path: file,
      lines,
      size,
      sizeKB: (size / 1024).toFixed(2),
      modified: modified.toISOString().split('T')[0],
      classCount,
      idCount,
      mediaQueryCount,
      variableCount,
      importantCount,
      fontFaceCount,
      importCount,
      concerns: []
    };

    // Flag concerns
    if (lines > 500) fileInfo.concerns.push('LARGE_FILE');
    if (lines > 1000) fileInfo.concerns.push('VERY_LARGE_FILE');
    if (importantCount > 5) fileInfo.concerns.push('EXCESSIVE_IMPORTANT');
    if (idCount > 10) fileInfo.concerns.push('EXCESSIVE_IDS');

    inventory.files.push(fileInfo);
    inventory.totalLines += lines;
    inventory.totalSize += size;
  }

  // Sort by size
  inventory.files.sort((a, b) => b.size - a.size);
  inventory.largestFiles = inventory.files.slice(0, 10);

  // Calculate statistics
  inventory.statistics = {
    avgLinesPerFile: Math.round(inventory.totalLines / inventory.totalFiles),
    avgSizePerFile: (inventory.totalSize / inventory.totalFiles / 1024).toFixed(2) + ' KB',
    totalSizeKB: (inventory.totalSize / 1024).toFixed(2),
    totalSizeGzipped: 'N/A', // Would need zlib to calculate
    filesOver500Lines: inventory.files.filter(f => f.lines > 500).length,
    filesOver1000Lines: inventory.files.filter(f => f.lines > 1000).length,
    totalConcerns: inventory.files.reduce((sum, f) => sum + f.concerns.length, 0),
    totalClasses: inventory.files.reduce((sum, f) => sum + f.classCount, 0),
    totalVariables: inventory.files.reduce((sum, f) => sum + f.variableCount, 0),
    totalImportant: inventory.files.reduce((sum, f) => sum + f.importantCount, 0)
  };

  // Write report
  const reportDir = 'audit-reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportDir, 'css-inventory.json'),
    JSON.stringify(inventory, null, 2)
  );

  // Print summary
  console.log('📊 CSS Inventory Summary:');
  console.log(`Total files: ${inventory.totalFiles}`);
  console.log(`Total lines: ${inventory.totalLines.toLocaleString()}`);
  console.log(`Total size: ${inventory.statistics.totalSizeKB} KB`);
  console.log(`Avg lines/file: ${inventory.statistics.avgLinesPerFile}`);
  console.log(`Files >500 lines: ${inventory.statistics.filesOver500Lines}`);
  console.log(`Files >1000 lines: ${inventory.statistics.filesOver1000Lines}`);
  console.log(`Total classes: ${inventory.statistics.totalClasses.toLocaleString()}`);
  console.log(`Total CSS variables: ${inventory.statistics.totalVariables}`);
  console.log(`Total !important: ${inventory.statistics.totalImportant}`);
  console.log(`\n⚠️  Total concerns: ${inventory.statistics.totalConcerns}`);

  console.log('\n📁 Largest files:');
  inventory.largestFiles.slice(0, 5).forEach((file, i) => {
    console.log(`${i + 1}. ${file.path}`);
    console.log(`   ${file.lines} lines, ${file.sizeKB} KB`);
    if (file.concerns.length > 0) {
      console.log(`   ⚠️  ${file.concerns.join(', ')}`);
    }
  });

  console.log('\n✅ Report saved to: audit-reports/css-inventory.json');
}

analyzeCSSFiles().catch(console.error);

