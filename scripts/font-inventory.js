/**
 * Font Inventory Script
 * Analyzes all font files and @font-face declarations
 * Based on CSS-Font-Optimization-COMPLETE-Master-Guide.md Section 8.2
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function analyzeFonts() {
  console.log('🔍 Starting Font Inventory Analysis...\n');

  // Find all font files
  const fontFiles = await glob('**/*.{woff,woff2,ttf,otf,eot}', {
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  });

  // Find all @font-face declarations
  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  });

  const fontFaces = [];
  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf-8');
    const matches = content.matchAll(/@font-face\s*{([^}]+)}/g);

    for (const match of matches) {
      const block = match[1];
      const family = block.match(/font-family:\s*['"]([^'"]+)['"]/)?.[1];
      const srcMatch = block.match(/url\(['"]?([^'"()]+)['"]?\)/);
      const src = srcMatch ? srcMatch[1] : null;
      const weight = block.match(/font-weight:\s*(\d+|normal|bold)/)?.[1];
      const style = block.match(/font-style:\s*(normal|italic|oblique)/)?.[1];
      const display = block.match(/font-display:\s*(auto|block|swap|fallback|optional)/)?.[1];

      if (family && src) {
        // Normalize path (remove ../ and leading ./)
        const normalizedSrc = src.replace(/^\.\.\//, '').replace(/^\.\//, '');
        fontFaces.push({
          family,
          src: normalizedSrc,
          weight: weight || 'normal',
          style: style || 'normal',
          display: display || 'auto',
          cssFile
        });
      }
    }
  }

  // Analyze font files
  const inventory = {
    totalFiles: fontFiles.length,
    declaredFonts: fontFaces.length,
    unusedFiles: [],
    usedFiles: [],
    filesByFormat: {},
    totalSize: 0
  };

  for (const fontFile of fontFiles) {
    const size = fs.statSync(fontFile).size;
    const ext = path.extname(fontFile).slice(1);
    const fileName = path.basename(fontFile);

    // Check if font is declared in CSS
    const isDeclared = fontFaces.some(ff => {
      // Match by filename or full path
      const srcPath = ff.src.replace(/^\.\.\//, '').replace(/^\.\//, '');
      return srcPath.includes(fileName) ||
             srcPath === fontFile ||
             fontFile.includes(srcPath) ||
             srcPath.includes(fontFile);
    });

    const fileInfo = {
      path: fontFile,
      fileName,
      size,
      sizeKB: (size / 1024).toFixed(2),
      format: ext,
      declared: isDeclared
    };

    if (isDeclared) {
      inventory.usedFiles.push(fileInfo);
    } else {
      inventory.unusedFiles.push(fileInfo);
    }

    inventory.totalSize += size;
    inventory.filesByFormat[ext] = (inventory.filesByFormat[ext] || 0) + 1;
  }

  // Calculate waste
  const unusedSize = inventory.unusedFiles.reduce((sum, f) => sum + f.size, 0);
  const wastePercentage = inventory.totalSize > 0
    ? ((unusedSize / inventory.totalSize) * 100).toFixed(1)
    : '0';

  // Write report
  const reportDir = 'audit-reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    ...inventory,
    statistics: {
      totalSizeKB: (inventory.totalSize / 1024).toFixed(2),
      unusedFilesCount: inventory.unusedFiles.length,
      unusedSizeKB: (unusedSize / 1024).toFixed(2),
      wastePercentage,
      formatBreakdown: inventory.filesByFormat
    },
    fontFaceDeclarations: fontFaces
  };

  fs.writeFileSync(
    path.join(reportDir, 'font-inventory.json'),
    JSON.stringify(report, null, 2)
  );

  // Print summary
  console.log('📊 Font Inventory Summary:');
  console.log(`Total font files: ${inventory.totalFiles}`);
  console.log(`Declared in CSS: ${inventory.declaredFonts}`);
  console.log(`Used files: ${inventory.usedFiles.length}`);
  console.log(`Unused files: ${inventory.unusedFiles.length} (${wastePercentage}% waste)`);
  console.log(`Total size: ${report.statistics.totalSizeKB} KB`);
  console.log(`Unused size: ${report.statistics.unusedSizeKB} KB`);

  console.log('\n📁 Format breakdown:');
  Object.entries(inventory.filesByFormat).forEach(([format, count]) => {
    console.log(`  ${format}: ${count} files`);
  });

  if (inventory.unusedFiles.length > 0) {
    console.log('\n❌ Unused font files (can be deleted):');
    inventory.unusedFiles.forEach(file => {
      console.log(`  - ${file.path} (${file.sizeKB} KB)`);
    });
  }

  console.log('\n✅ Font declarations found:');
  const familyGroups = {};
  fontFaces.forEach(ff => {
    if (!familyGroups[ff.family]) familyGroups[ff.family] = [];
    familyGroups[ff.family].push(`${ff.weight} ${ff.style} (${ff.display})`);
  });
  Object.entries(familyGroups).forEach(([family, variants]) => {
    console.log(`  ${family}:`);
    variants.forEach(v => console.log(`    - ${v}`));
  });

  console.log('\n✅ Report saved to: audit-reports/font-inventory.json');
}

analyzeFonts().catch(console.error);

