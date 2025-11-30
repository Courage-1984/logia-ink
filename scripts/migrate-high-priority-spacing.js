/**
 * Migrate High-Priority Spacing Values to CSS Variables
 *
 * This script replaces high-priority spacing values with existing CSS variables:
 * - 1rem → var(--space-4)
 * - 2rem → var(--space-8)
 * - 0.5rem → var(--space-2)
 * - 1.5rem → var(--space-6)
 * - 3rem → var(--space-12)
 *
 * Excludes values inside clamp(), calc(), or var() functions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// High-priority spacing mappings
const spacingMappings = [
  {
    pattern: /\b1rem\b/g,
    replacement: 'var(--space-4)',
    value: '1rem',
    variable: '--space-4'
  },
  {
    pattern: /\b2rem\b/g,
    replacement: 'var(--space-8)',
    value: '2rem',
    variable: '--space-8'
  },
  {
    pattern: /\b0\.5rem\b/g,
    replacement: 'var(--space-2)',
    value: '0.5rem',
    variable: '--space-2'
  },
  {
    pattern: /\b1\.5rem\b/g,
    replacement: 'var(--space-6)',
    value: '1.5rem',
    variable: '--space-6'
  },
  {
    pattern: /\b3rem\b/g,
    replacement: 'var(--space-12)',
    value: '3rem',
    variable: '--space-12'
  },
];

// Files to exclude
const excludePatterns = [
  '**/*.backup',
  '**/variables.css',
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

  // Check if already using a variable
  if (beforeMatch.includes('var(--') && !beforeMatch.includes(';')) {
    return true;
  }

  return false;
}

/**
 * Check if the value is in a spacing property context
 */
function isSpacingProperty(content, matchIndex) {
  const beforeMatch = content.substring(0, matchIndex);
  const afterMatch = content.substring(matchIndex);

  // Look for spacing properties before the match
  const spacingProps = [
    'padding', 'margin', 'gap', 'top', 'bottom', 'left', 'right',
    'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
    'inset', 'outline-offset', 'border-width', 'border-radius',
    'letter-spacing', 'word-spacing', 'line-height'
  ];

  // Find the last property declaration before this match
  const propertyMatch = beforeMatch.match(/([a-z-]+):\s*[^;]*$/);
  if (propertyMatch) {
    const property = propertyMatch[1];
    return spacingProps.some(prop => property.includes(prop));
  }

  return false;
}

/**
 * Process a single CSS file
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const replacements = {};

  // Initialize replacement counts
  spacingMappings.forEach(mapping => {
    replacements[mapping.value] = 0;
  });

  // Replace spacing values
  for (const mapping of spacingMappings) {
    const matches = content.match(mapping.pattern);
    if (matches) {
      let replacementCount = 0;

      // Replace each match, checking context
      const newContent = content.replace(mapping.pattern, (match, offset) => {
        // Don't replace if inside clamp(), calc(), or var()
        if (isInSpecialContext(content, offset)) {
          return match;
        }

        // Only replace in spacing property contexts
        if (!isSpacingProperty(content, offset)) {
          return match;
        }

        // Don't replace if already using a variable
        const beforeMatch = content.substring(0, offset);
        if (beforeMatch.includes('var(--') && !beforeMatch.includes(';')) {
          return match;
        }

        replacementCount++;
        return mapping.replacement;
      });

      if (newContent !== content) {
        replacements[mapping.value] = replacementCount;
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
      '1rem': 0,
      '2rem': 0,
      '0.5rem': 0,
      '1.5rem': 0,
      '3rem': 0,
    },
    fileDetails: [],
  };

  for (const file of cssFiles) {
    const relativePath = path.relative(projectRoot, file);
    const result = processFile(file);

    if (result.modified) {
      results.modifiedFiles++;

      // Sum up replacements
      Object.keys(result.replacements).forEach(key => {
        results.totalReplacements[key] += result.replacements[key];
      });

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
  let total = 0;
  Object.entries(results.totalReplacements).forEach(([value, count]) => {
    const mapping = spacingMappings.find(m => m.value === value);
    console.log(`  ${value} → ${mapping.variable}: ${count}`);
    total += count;
  });
  console.log(`  Total: ${total}\n`);

  if (results.fileDetails.length > 0) {
    console.log('Modified files:');
    results.fileDetails.forEach(({ file, replacements }) => {
      const parts = [];
      Object.entries(replacements).forEach(([value, count]) => {
        if (count > 0) {
          const mapping = spacingMappings.find(m => m.value === value);
          parts.push(`${count}x ${value}→${mapping.variable}`);
        }
      });
      if (parts.length > 0) {
        console.log(`  ${file}: ${parts.join(', ')}`);
      }
    });
  }

  // Save report
  const reportPath = path.join(projectRoot, 'audit-reports', 'high-priority-spacing-migration.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n✅ Report saved to: audit-reports/high-priority-spacing-migration.json`);
}

main().catch(console.error);

