/**
 * Replace Hardcoded CSS Values with Variables
 * Systematically replaces hardcoded fonts, colors, and spacing with CSS variables
 */

import fs from 'fs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the hardcoded values report
const hardcodedReport = JSON.parse(
  fs.readFileSync(`${__dirname}/../audit-reports/hardcoded-values.json`, 'utf-8')
);

// Font replacements (excluding @font-face which must be literal)
const fontReplacements = [
  {
    pattern: /font-family:\s*['"]Orbitron['"]([^;]*);/g,
    replacement: "font-family: var(--font-heading)$1;",
    exclude: /@font-face/
  },
  {
    pattern: /font-family:\s*['"]Rajdhani['"]([^;]*);/g,
    replacement: "font-family: var(--font-body)$1;",
    exclude: /@font-face/
  },
  {
    pattern: /font-family:\s*['"]Courier New['"]([^;]*);/g,
    replacement: "font-family: var(--font-mono)$1;",
    exclude: /@font-face/
  },
  {
    pattern: /font-family:\s*['"]Fira Code['"]([^;]*);/g,
    replacement: "font-family: var(--font-mono)$1;",
    exclude: /@font-face/
  }
];

// Color replacements
const colorReplacements = [
  { pattern: /#00ffff/g, replacement: 'var(--accent-cyan)' },
  { pattern: /#00cccc/g, replacement: 'var(--accent-cyan-dark)' },
  { pattern: /#ff00ff/g, replacement: 'var(--accent-magenta)' },
  { pattern: /#cc00cc/g, replacement: 'var(--accent-magenta-dark)' },
  { pattern: /#00ff00/g, replacement: 'var(--accent-green)' },
  { pattern: /#00cc00/g, replacement: 'var(--accent-green-dark)' },
  { pattern: /#0066ff/g, replacement: 'var(--accent-blue)' },
  { pattern: /#0052cc/g, replacement: 'var(--accent-blue-dark)' },
  { pattern: /#ff0080/g, replacement: 'var(--accent-pink)' },
  { pattern: /#ffff00/g, replacement: 'var(--accent-yellow)' }
];

// Spacing replacements (common rem values)
const spacingReplacements = [
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*1rem(\s*;)/g, replacement: '$1$2: var(--space-4)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*2rem(\s*;)/g, replacement: '$1$2: var(--space-8)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*4rem(\s*;)/g, replacement: '$1$2: var(--space-16)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*6rem(\s*;)/g, replacement: '$1$2: var(--space-20)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*3rem(\s*;)/g, replacement: '$1$2: var(--space-12)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*1\.5rem(\s*;)/g, replacement: '$1$2: var(--space-6)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*0\.5rem(\s*;)/g, replacement: '$1$2: var(--space-2)$3' },
  { pattern: /(\s+)(padding|margin|gap|top|right|bottom|left):\s*0\.25rem(\s*;)/g, replacement: '$1$2: var(--space-1)$3' }
];

// Files to exclude (backup files, fonts.css @font-face is correct)
const excludePatterns = [
  /\.backup$/,
  /fonts\.css$/ // @font-face must use literal font names
];

async function replaceHardcodedValues() {
  console.log('🔄 Replacing Hardcoded CSS Values...\n');

  const cssFiles = await glob('css/**/*.css', {
    ignore: ['node_modules/**', 'dist/**', 'build/**', '.old/**']
  });

  const stats = {
    filesProcessed: 0,
    fontsReplaced: 0,
    colorsReplaced: 0,
    spacingReplaced: 0,
    filesModified: []
  };

  for (const file of cssFiles) {
    // Skip excluded files
    if (excludePatterns.some(pattern => pattern.test(file))) {
      continue;
    }

    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    const fileStats = {
      fonts: 0,
      colors: 0,
      spacing: 0
    };

    // Replace fonts (skip if in @font-face)
    for (const replacement of fontReplacements) {
      const matches = content.match(replacement.pattern);
      if (matches) {
        // Check if any match is in @font-face (skip those)
        const lines = content.split('\n');
        let inFontFace = false;
        const newLines = lines.map((line, index) => {
          if (line.includes('@font-face')) {
            inFontFace = true;
          }
          if (line.includes('}') && inFontFace && !line.includes('@font-face')) {
            inFontFace = false;
          }

          if (!inFontFace && replacement.pattern.test(line)) {
            const newLine = line.replace(replacement.pattern, replacement.replacement);
            if (newLine !== line) {
              fileStats.fonts++;
              modified = true;
              return newLine;
            }
          }
          return line;
        });

        if (modified) {
          content = newLines.join('\n');
        }
      }
    }

    // Replace colors
    for (const replacement of colorReplacements) {
      const matches = content.match(replacement.pattern);
      if (matches && !content.includes(replacement.replacement)) {
        // Only replace if not already using variable
        const newContent = content.replace(replacement.pattern, replacement.replacement);
        if (newContent !== content) {
          fileStats.colors += matches.length;
          content = newContent;
          modified = true;
        }
      }
    }

    // Replace spacing (be careful not to replace in calc() or other contexts)
    for (const replacement of spacingReplacements) {
      const matches = content.match(replacement.pattern);
      if (matches) {
        // Don't replace if already using variable
        const newContent = content.replace(replacement.pattern, (match) => {
          // Check if this is already a variable
          if (match.includes('var(--')) {
            return match;
          }
          // Apply replacement string
          return match.replace(replacement.pattern, replacement.replacement);
        });

        if (newContent !== content) {
          fileStats.spacing += matches.length;
          content = newContent;
          modified = true;
        }
      }
    }

    // Write back if modified
    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      stats.filesModified.push({
        file,
        fonts: fileStats.fonts,
        colors: fileStats.colors,
        spacing: fileStats.spacing
      });
      stats.fontsReplaced += fileStats.fonts;
      stats.colorsReplaced += fileStats.colors;
      stats.spacingReplaced += fileStats.spacing;
      stats.filesProcessed++;
    }
  }

  // Print summary
  console.log('📊 Replacement Summary:');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Font families replaced: ${stats.fontsReplaced}`);
  console.log(`Colors replaced: ${stats.colorsReplaced}`);
  console.log(`Spacing values replaced: ${stats.spacingReplaced}`);

  if (stats.filesModified.length > 0) {
    console.log('\n📝 Modified files:');
    stats.filesModified.forEach(({ file, fonts, colors, spacing }) => {
      const changes = [];
      if (fonts > 0) changes.push(`${fonts} fonts`);
      if (colors > 0) changes.push(`${colors} colors`);
      if (spacing > 0) changes.push(`${spacing} spacing`);
      console.log(`  ${file}: ${changes.join(', ')}`);
    });
  } else {
    console.log('\n✅ No files needed modification (values already use variables)');
  }

  console.log('\n✅ Replacement complete!');
}

replaceHardcodedValues().catch(console.error);

