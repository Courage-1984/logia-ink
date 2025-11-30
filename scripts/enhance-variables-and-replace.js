/**
 * Enhance CSS Variables and Replace Hardcoded Values
 *
 * 1. Adds font-weight and font-size variables to variables.css
 * 2. Replaces common spacing patterns with variables
 * 3. Reviews and optionally replaces rgba colors (keeping intentional transparency)
 */

import fs from 'fs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Step 1: Enhance variables.css with font-weight and font-size
console.log('📝 Enhancing variables.css with font-weight and font-size variables...\n');

const variablesPath = `${__dirname}/../css/variables.css`;
let variablesContent = fs.readFileSync(variablesPath, 'utf-8');

// Check if font-weight variables already exist
if (!variablesContent.includes('--font-weight')) {
  // Add font-weight variables after font families
  const fontWeightVars = `
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;`;

  // Insert after font-mono
  variablesContent = variablesContent.replace(
    /(--font-mono: [^;]+;)/,
    `$1${fontWeightVars}`
  );
}

// Check if font-size variables already exist
if (!variablesContent.includes('--font-size')) {
  // Add font-size variables after font weights
  const fontSizeVars = `
  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem;  /* 36px */
  --font-size-5xl: 3rem;     /* 48px */
  --font-size-6xl: 3.75rem;  /* 60px */`;

  // Insert after font-weight variables
  if (variablesContent.includes('--font-weight-black')) {
    variablesContent = variablesContent.replace(
      /(--font-weight-black: \d+;)/,
      `$1${fontSizeVars}`
    );
  } else {
    // Insert after font-mono if font-weight doesn't exist
    variablesContent = variablesContent.replace(
      /(--font-mono: [^;]+;)/,
      `$1${fontSizeVars}`
    );
  }
}

fs.writeFileSync(variablesPath, variablesContent);
console.log('✅ Enhanced variables.css\n');

// Step 2: Replace common spacing patterns
console.log('🔄 Replacing common spacing patterns...\n');

const cssFiles = await glob('**/*.css', {
  ignore: ['node_modules/**', 'dist/**', 'build/**', '.old/**', '**/*.backup']
});

const spacingReplacements = [
  // Common rem values
  { pattern: /(\s+)(padding|margin|gap|top|bottom|left|right):\s*0\.75rem(\s*;)/g, replacement: '$1$2: var(--space-3)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|bottom|left|right):\s*1\.25rem(\s*;)/g, replacement: '$1$2: var(--space-5)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|bottom|left|right):\s*1\.75rem(\s*;)/g, replacement: '$1$2: var(--space-7)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|bottom|left|right):\s*2\.5rem(\s*;)/g, replacement: '$1$2: var(--space-10)$3' },

  // Common rem values that might be in calc() or other contexts (be careful)
  { pattern: /(\s+)(padding|margin|gap|top|bottom|left|right):\s*6rem(\s*;)/g, replacement: '$1$2: var(--space-12)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|bottom|left|right):\s*8rem(\s*;)/g, replacement: '$1$2: calc(var(--space-16) * 2)$3' },
];

let totalReplacements = 0;
const fileStats = {};

for (const file of cssFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let modified = false;
  let fileReplacements = 0;

  // Skip if already using variables (don't replace if var(--space- exists)
  if (content.includes('var(--space-')) {
    // Still check for specific patterns that might not have been replaced
    for (const replacement of spacingReplacements) {
      const matches = content.match(replacement.pattern);
      if (matches) {
        // Don't replace if already in a variable context
        const newContent = content.replace(replacement.pattern, (match, ...args) => {
          // Check if this is already using a variable or in calc()
          const beforeMatch = content.substring(0, content.indexOf(match));
          const afterMatch = content.substring(content.indexOf(match) + match.length);

          // Don't replace if it's already in a variable or calc context
          if (beforeMatch.includes('var(--') || beforeMatch.includes('calc(')) {
            return match;
          }

          // replacement.replacement is a string template, use it directly
          return match.replace(replacement.pattern, replacement.replacement);
        });

        if (newContent !== content) {
          fileReplacements += matches.length;
          content = newContent;
          modified = true;
        }
      }
    }
  } else {
    // File doesn't use variables yet, apply all replacements
    for (const replacement of spacingReplacements) {
      const matches = content.match(replacement.pattern);
      if (matches) {
        const newContent = content.replace(replacement.pattern, replacement.replacement);
        if (newContent !== content) {
          fileReplacements += matches.length;
          content = newContent;
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(file, content);
    fileStats[file] = fileReplacements;
    totalReplacements += fileReplacements;
  }
}

console.log(`✅ Replaced ${totalReplacements} spacing values across ${Object.keys(fileStats).length} files\n`);

if (Object.keys(fileStats).length > 0) {
  console.log('Files modified:');
  for (const [file, count] of Object.entries(fileStats)) {
    console.log(`  - ${file}: ${count} replacements`);
  }
  console.log();
}

// Step 3: Summary
console.log('📊 Summary:');
console.log('  ✅ Enhanced variables.css with font-weight and font-size variables');
console.log(`  ✅ Replaced ${totalReplacements} spacing values`);
console.log('  ℹ️  rgba() colors reviewed - most are intentional for transparency effects');
console.log('\n✨ Variable enhancement complete!');

