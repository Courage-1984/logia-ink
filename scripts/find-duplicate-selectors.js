/**
 * Find Duplicate CSS Selectors
 * Identifies duplicate class/selector definitions across CSS files
 * Based on CSS-Font-Optimization-COMPLETE-Master-Guide.md Section 15.1
 */

import fs from 'fs';
import { glob } from 'glob';
import postcss from 'postcss';

async function findDuplicateSelectors() {
  console.log('🔍 Finding Duplicate CSS Selectors...\n');

  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**', 'build/**', '.old/**']
  });

  const selectorMap = new Map(); // selector -> [locations]

  for (const file of cssFiles) {
    try {
      const css = fs.readFileSync(file, 'utf-8');
      const root = postcss.parse(css);

      root.walkRules(rule => {
        if (!rule.selector) return;

        // Normalize selector (remove whitespace, handle multiple selectors)
        const selectors = rule.selector
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        selectors.forEach(selector => {
          if (!selectorMap.has(selector)) {
            selectorMap.set(selector, []);
          }

          selectorMap.get(selector).push({
            file,
            line: rule.source?.start?.line || 0,
            declarations: rule.nodes.length,
            cssText: rule.toString().substring(0, 100) // First 100 chars for context
          });
        });
      });
    } catch (error) {
      console.warn(`⚠️  Error parsing ${file}: ${error.message}`);
    }
  }

  // Find duplicates
  const duplicates = [];
  selectorMap.forEach((locations, selector) => {
    if (locations.length > 1) {
      duplicates.push({ selector, locations });
    }
  });

  // Sort by frequency
  duplicates.sort((a, b) => b.locations.length - a.locations.length);

  // Print report
  console.log(`Found ${duplicates.length} duplicate selector definitions:\n`);

  const report = {
    totalSelectors: selectorMap.size,
    duplicateCount: duplicates.length,
    duplicates: duplicates.slice(0, 50), // Top 50
    summary: {
      exactDuplicates: duplicates.filter(d => d.locations.length > 1).length,
      highFrequency: duplicates.filter(d => d.locations.length > 3).length
    }
  };

  duplicates.slice(0, 20).forEach(dup => {
    console.log(`❌ ${dup.selector} (defined ${dup.locations.length} times)`);
    dup.locations.forEach(loc => {
      console.log(`   ${loc.file}:${loc.line} (${loc.declarations} declarations)`);
    });
    console.log('');
  });

  if (duplicates.length > 20) {
    console.log(`... and ${duplicates.length - 20} more duplicates\n`);
  }

  // Save report
  const reportDir = 'audit-reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(
    `${reportDir}/duplicate-selectors.json`,
    JSON.stringify(report, null, 2)
  );

  console.log(`✅ Report saved to: ${reportDir}/duplicate-selectors.json`);

  if (duplicates.length > 0) {
    console.log(`\n⚠️  Action required: Review and consolidate ${duplicates.length} duplicate selectors`);
  } else {
    console.log(`\n✅ No duplicate selectors found!`);
  }
}

findDuplicateSelectors().catch(console.error);

