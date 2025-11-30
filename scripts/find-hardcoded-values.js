/**
 * Find Hardcoded CSS Values
 * Identifies hardcoded colors, fonts, spacing that should use CSS variables
 * Based on CSS-Font-Optimization-COMPLETE-Master-Guide.md Section 10.3
 */

import fs from 'fs';
import { glob } from 'glob';

async function findHardcodedValues() {
  console.log('🔍 Finding Hardcoded CSS Values...\n');

  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**', 'build/**', '.old/**']
  });

  const patterns = {
    colors: {
      regex: /(color|background|border-color|fill|stroke):\s*#[0-9a-fA-F]{3,6}/g,
      replacement: 'Use CSS variable (e.g., var(--color-primary))',
      exclude: /var\(--/ // Exclude if already using variables
    },
    fonts: {
      regex: /font-family:\s*['"][^'"]*['"]/g,
      replacement: 'Use CSS variable (e.g., var(--font-heading))',
      exclude: /var\(--font/
    },
    spacing: {
      regex: /(margin|padding|gap|top|right|bottom|left|width|height):\s*(\d+px|\d+rem|\d+em)/g,
      replacement: 'Consider using spacing variable (e.g., var(--space-4))',
      exclude: /var\(--space|var\(--/
    },
    borderRadius: {
      regex: /border-radius:\s*\d+px/g,
      replacement: 'Consider using radius variable (e.g., var(--radius-md))',
      exclude: /var\(--radius/
    }
  };

  const findings = {};

  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    Object.entries(patterns).forEach(([type, pattern]) => {
      lines.forEach((line, index) => {
        // Skip if already using variables
        if (pattern.exclude && pattern.exclude.test(line)) {
          return;
        }

        const matches = [...line.matchAll(pattern.regex)];

        if (matches.length > 0) {
          if (!findings[type]) findings[type] = [];

          matches.forEach(match => {
            findings[type].push({
              file,
              line: index + 1,
              match: match[0],
              suggestion: pattern.replacement
            });
          });
        }
      });
    });
  }

  // Print report
  console.log('Hardcoded Values Report:');
  console.log('========================\n');

  let totalFindings = 0;
  Object.entries(findings).forEach(([type, items]) => {
    if (items.length === 0) return;

    console.log(`\n${type.toUpperCase()} (${items.length} occurrences):`);

    // Group by file
    const byFile = {};
    items.forEach(item => {
      if (!byFile[item.file]) byFile[item.file] = [];
      byFile[item.file].push(item);
    });

    Object.entries(byFile).forEach(([file, fileItems]) => {
      console.log(`\n  📄 ${file}:`);
      fileItems.slice(0, 5).forEach(item => {
        console.log(`     Line ${item.line}: ${item.match}`);
      });
      if (fileItems.length > 5) {
        console.log(`     ... and ${fileItems.length - 5} more`);
      }
    });

    console.log(`\n  💡 Suggestion: ${items[0].suggestion}`);
    totalFindings += items.length;
  });

  if (totalFindings === 0) {
    console.log('✅ No hardcoded values found! All values use CSS variables.');
  } else {
    console.log(`\n\n📊 Total hardcoded values: ${totalFindings}`);
    console.log('💡 Recommendation: Replace with CSS variables for better maintainability');
  }

  // Save report
  const reportDir = 'audit-reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(
    `${reportDir}/hardcoded-values.json`,
    JSON.stringify(findings, null, 2)
  );

  console.log(`\n✅ Report saved to: ${reportDir}/hardcoded-values.json`);
}

findHardcodedValues().catch(console.error);

