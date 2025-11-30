/**
 * Analyze Remaining Opportunities
 *
 * This script finds remaining hardcoded values that could potentially
 * be migrated to CSS variables, excluding intentional cases.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Exclude patterns
const excludePatterns = [
  '**/*.backup',
  '**/variables.css',
  '**/fonts.css',
];

/**
 * Check if a value is inside clamp(), calc(), or var()
 */
function isInSpecialContext(content, matchIndex) {
  const beforeMatch = content.substring(0, matchIndex);

  // Check if we're inside clamp(), calc(), or var()
  const openClamp = beforeMatch.lastIndexOf('clamp(');
  const openCalc = beforeMatch.lastIndexOf('calc(');
  const openVar = beforeMatch.lastIndexOf('var(');

  const lastOpen = Math.max(openClamp, openCalc, openVar);
  if (lastOpen > -1) {
    const funcContent = content.substring(lastOpen, matchIndex);
    const funcOpenParens = (funcContent.match(/\(/g) || []).length;
    const funcCloseParens = (funcContent.match(/\)/g) || []).length;
    if (funcCloseParens < funcOpenParens) {
      return true; // Inside function
    }
  }

  return false;
}

/**
 * Analyze a CSS file for remaining opportunities
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(projectRoot, filePath);
  const opportunities = {
    fontSizes: [],
    spacing: [],
    other: [],
  };

  // Find font-size values (excluding clamp, calc, var)
  const fontSizePattern = /font-size:\s*([0-9.]+rem|([0-9.]+px))/g;
  let match;
  while ((match = fontSizePattern.exec(content)) !== null) {
    const value = match[1];
    const matchIndex = match.index;

    // Skip if inside clamp(), calc(), or var()
    if (isInSpecialContext(content, matchIndex)) {
      continue;
    }

    // Skip if already using variable
    if (match[0].includes('var(--')) {
      continue;
    }

    // Extract line number
    const beforeMatch = content.substring(0, matchIndex);
    const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

    opportunities.fontSizes.push({
      value,
      line: lineNumber,
      context: match[0],
    });
  }

  // Find spacing values (padding, margin, gap, etc.)
  const spacingPattern = /(padding|margin|gap|top|bottom|left|right|width|height|min-height|max-height|min-width|max-width):\s*([0-9.]+rem|([0-9.]+px))/g;
  while ((match = spacingPattern.exec(content)) !== null) {
    const property = match[1];
    const value = match[2];
    const matchIndex = match.index;

    // Skip if inside clamp(), calc(), or var()
    if (isInSpecialContext(content, matchIndex)) {
      continue;
    }

    // Skip if already using variable
    if (match[0].includes('var(--')) {
      continue;
    }

    // Extract line number
    const beforeMatch = content.substring(0, matchIndex);
    const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

    opportunities.spacing.push({
      property,
      value,
      line: lineNumber,
      context: match[0],
    });
  }

  return {
    file: relativePath,
    opportunities,
    total: opportunities.fontSizes.length + opportunities.spacing.length,
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Analyzing remaining opportunities...\n');

  const cssFiles = await glob('css/**/*.css', {
    cwd: projectRoot,
    ignore: excludePatterns,
    absolute: true,
  });

  console.log(`Found ${cssFiles.length} CSS files to analyze\n`);

  const results = {
    totalFiles: cssFiles.length,
    filesWithOpportunities: 0,
    totalOpportunities: {
      fontSizes: 0,
      spacing: 0,
    },
    fileDetails: [],
    valueFrequency: {
      fontSizes: {},
      spacing: {},
    },
  };

  for (const file of cssFiles) {
    const analysis = analyzeFile(file);

    if (analysis.total > 0) {
      results.filesWithOpportunities++;
      results.totalOpportunities.fontSizes += analysis.opportunities.fontSizes.length;
      results.totalOpportunities.spacing += analysis.opportunities.spacing.length;

      results.fileDetails.push(analysis);

      // Count value frequency
      analysis.opportunities.fontSizes.forEach(({ value }) => {
        results.valueFrequency.fontSizes[value] = (results.valueFrequency.fontSizes[value] || 0) + 1;
      });

      analysis.opportunities.spacing.forEach(({ value }) => {
        results.valueFrequency.spacing[value] = (results.valueFrequency.spacing[value] || 0) + 1;
      });
    }
  }

  // Print summary
  console.log('📊 Analysis Summary:\n');
  console.log(`Total files analyzed: ${results.totalFiles}`);
  console.log(`Files with opportunities: ${results.filesWithOpportunities}\n`);
  console.log('Opportunities found:');
  console.log(`  Font-size: ${results.totalOpportunities.fontSizes}`);
  console.log(`  Spacing: ${results.totalOpportunities.spacing}`);
  console.log(`  Total: ${results.totalOpportunities.fontSizes + results.totalOpportunities.spacing}\n`);

  // Print value frequency
  console.log('Most common font-size values:');
  const sortedFontSizes = Object.entries(results.valueFrequency.fontSizes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sortedFontSizes.forEach(([value, count]) => {
    console.log(`  ${value}: ${count} occurrences`);
  });

  console.log('\nMost common spacing values:');
  const sortedSpacing = Object.entries(results.valueFrequency.spacing)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sortedSpacing.forEach(([value, count]) => {
    console.log(`  ${value}: ${count} occurrences`);
  });

  // Save report
  const reportPath = path.join(projectRoot, 'audit-reports', 'remaining-opportunities.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n✅ Report saved to: audit-reports/remaining-opportunities.json`);
}

main().catch(console.error);

