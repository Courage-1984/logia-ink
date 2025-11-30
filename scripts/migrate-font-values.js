/**
 * Migrate Font-Size and Font-Weight Values to CSS Variables
 *
 * This script finds hardcoded font-size and font-weight values and replaces them
 * with CSS variables defined in css/variables.css
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Font-size variable mappings (rem values to variables)
const fontSizeMappings = [
  { pattern: /font-size:\s*0\.75rem\b/g, replacement: 'font-size: var(--font-size-xs)', value: '0.75rem' },
  { pattern: /font-size:\s*0\.875rem\b/g, replacement: 'font-size: var(--font-size-sm)', value: '0.875rem' },
  { pattern: /font-size:\s*1rem\b/g, replacement: 'font-size: var(--font-size-base)', value: '1rem' },
  { pattern: /font-size:\s*1\.125rem\b/g, replacement: 'font-size: var(--font-size-lg)', value: '1.125rem' },
  { pattern: /font-size:\s*1\.25rem\b/g, replacement: 'font-size: var(--font-size-xl)', value: '1.25rem' },
  { pattern: /font-size:\s*1\.5rem\b/g, replacement: 'font-size: var(--font-size-2xl)', value: '1.5rem' },
  { pattern: /font-size:\s*1\.875rem\b/g, replacement: 'font-size: var(--font-size-3xl)', value: '1.875rem' },
  { pattern: /font-size:\s*2\.25rem\b/g, replacement: 'font-size: var(--font-size-4xl)', value: '2.25rem' },
  { pattern: /font-size:\s*3rem\b/g, replacement: 'font-size: var(--font-size-5xl)', value: '3rem' },
  { pattern: /font-size:\s*3\.75rem\b/g, replacement: 'font-size: var(--font-size-6xl)', value: '3.75rem' },
];

// Font-weight variable mappings
const fontWeightMappings = [
  { pattern: /font-weight:\s*300\b/g, replacement: 'font-weight: var(--font-weight-light)', value: '300' },
  { pattern: /font-weight:\s*400\b/g, replacement: 'font-weight: var(--font-weight-normal)', value: '400' },
  { pattern: /font-weight:\s*500\b/g, replacement: 'font-weight: var(--font-weight-medium)', value: '500' },
  { pattern: /font-weight:\s*600\b/g, replacement: 'font-weight: var(--font-weight-semibold)', value: '600' },
  { pattern: /font-weight:\s*700\b/g, replacement: 'font-weight: var(--font-weight-bold)', value: '700' },
  { pattern: /font-weight:\s*900\b/g, replacement: 'font-weight: var(--font-weight-black)', value: '900' },
];

// Additional spacing patterns to replace
const spacingMappings = [
  { pattern: /\b0\.75rem\b/g, replacement: 'var(--space-3)', value: '0.75rem', context: 'spacing' },
  { pattern: /\b1\.25rem\b/g, replacement: 'var(--space-5)', value: '1.25rem', context: 'spacing' },
  { pattern: /\b1\.75rem\b/g, replacement: 'var(--space-7)', value: '1.75rem', context: 'spacing' },
  { pattern: /\b6rem\b/g, replacement: 'var(--space-20)', value: '6rem', context: 'spacing' },
  { pattern: /\b8rem\b/g, replacement: 'var(--space-20)', value: '8rem', context: 'spacing' },
];

// Files to exclude (backups, variables.css itself)
const excludePatterns = [
  '**/*.backup',
  '**/variables.css',
  '**/fonts.css', // @font-face rules need hardcoded values
];

/**
 * Check if a value is inside clamp(), calc(), or var()
 */
function isInSpecialContext(content, matchIndex) {
  const beforeMatch = content.substring(0, matchIndex);
  const afterMatch = content.substring(matchIndex);

  // Check if we're inside clamp(), calc(), or var()
  const openParens = (beforeMatch.match(/\(/g) || []).length;
  const closeParens = (beforeMatch.match(/\)/g) || []).length;
  const openClamp = beforeMatch.lastIndexOf('clamp(');
  const openCalc = beforeMatch.lastIndexOf('calc(');
  const openVar = beforeMatch.lastIndexOf('var(');

  // If we're inside a function, check if it's closed
  const lastOpen = Math.max(openClamp, openCalc, openVar);
  if (lastOpen > -1) {
    const funcContent = content.substring(lastOpen, matchIndex);
    const funcOpenParens = (funcContent.match(/\(/g) || []).length;
    const funcCloseParens = (funcContent.match(/\)/g) || []).length;
    if (funcCloseParens < funcOpenParens) {
      return true; // Inside function
    }
  }

  // Check if already using a variable
  if (beforeMatch.includes('var(--') && !beforeMatch.includes(';')) {
    return true;
  }

  return false;
}

/**
 * Process a single CSS file
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const replacements = {
    fontSize: 0,
    fontWeight: 0,
    spacing: 0,
  };

  // Replace font-size values
  for (const mapping of fontSizeMappings) {
    const matches = content.match(mapping.pattern);
    if (matches) {
      // Don't replace if inside clamp(), calc(), or var()
      const newContent = content.replace(mapping.pattern, (match, offset) => {
        if (isInSpecialContext(content, offset)) {
          return match;
        }
        return mapping.replacement;
      });

      if (newContent !== content) {
        replacements.fontSize += matches.length;
        content = newContent;
        modified = true;
      }
    }
  }

  // Replace font-weight values
  for (const mapping of fontWeightMappings) {
    const matches = content.match(mapping.pattern);
    if (matches) {
      const newContent = content.replace(mapping.pattern, (match, offset) => {
        if (isInSpecialContext(content, offset)) {
          return match;
        }
        return mapping.replacement;
      });

      if (newContent !== content) {
        replacements.fontWeight += matches.length;
        content = newContent;
        modified = true;
      }
    }
  }

  // Replace additional spacing values (be careful with context)
  for (const mapping of spacingMappings) {
    // Only replace spacing values, not font-size or other contexts
    const spacingPattern = new RegExp(
      `(padding|margin|gap|top|bottom|left|right|width|height|min-height|max-height|min-width|max-width):\\s*${mapping.value.replace('.', '\\.')}\\b`,
      'g'
    );

    const matches = content.match(spacingPattern);
    if (matches) {
      const newContent = content.replace(spacingPattern, (match, offset) => {
        if (isInSpecialContext(content, offset)) {
          return match;
        }
        // Replace the value part
        return match.replace(mapping.value, mapping.replacement);
      });

      if (newContent !== content) {
        replacements.spacing += matches.length;
        content = newContent;
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return { modified, replacements };
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Finding CSS files...\n');

  const cssFiles = await glob('css/**/*.css', {
    cwd: projectRoot,
    ignore: excludePatterns,
    absolute: true,
  });

  console.log(`Found ${cssFiles.length} CSS files to process\n`);

  const results = {
    totalFiles: cssFiles.length,
    modifiedFiles: 0,
    totalReplacements: {
      fontSize: 0,
      fontWeight: 0,
      spacing: 0,
    },
    fileDetails: [],
  };

  for (const file of cssFiles) {
    const relativePath = path.relative(projectRoot, file);
    const result = processFile(file);

    if (result.modified) {
      results.modifiedFiles++;
      results.totalReplacements.fontSize += result.replacements.fontSize;
      results.totalReplacements.fontWeight += result.replacements.fontWeight;
      results.totalReplacements.spacing += result.replacements.spacing;

      results.fileDetails.push({
        file: relativePath,
        replacements: result.replacements,
      });
    }
  }

  // Print summary
  console.log('📊 Migration Summary:\n');
  console.log(`Total files processed: ${results.totalFiles}`);
  console.log(`Files modified: ${results.modifiedFiles}\n`);
  console.log('Replacements made:');
  console.log(`  Font-size: ${results.totalReplacements.fontSize}`);
  console.log(`  Font-weight: ${results.totalReplacements.fontWeight}`);
  console.log(`  Spacing: ${results.totalReplacements.spacing}`);
  console.log(`  Total: ${results.totalReplacements.fontSize + results.totalReplacements.fontWeight + results.totalReplacements.spacing}\n`);

  if (results.fileDetails.length > 0) {
    console.log('Modified files:');
    results.fileDetails.forEach(({ file, replacements }) => {
      const parts = [];
      if (replacements.fontSize > 0) parts.push(`${replacements.fontSize} font-size`);
      if (replacements.fontWeight > 0) parts.push(`${replacements.fontWeight} font-weight`);
      if (replacements.spacing > 0) parts.push(`${replacements.spacing} spacing`);
      console.log(`  ${file}: ${parts.join(', ')}`);
    });
  }

  // Save report
  const reportPath = path.join(projectRoot, 'audit-reports', 'font-migration-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n✅ Report saved to: audit-reports/font-migration-report.json`);
}

main().catch(console.error);

