/**
 * Analyze !important Usage
 * Identifies !important declarations and categorizes them for review
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssDir = path.join(__dirname, '..', 'css');

// Find all CSS files
const cssFiles = glob.sync('**/*.css', { cwd: cssDir, absolute: true });

const results = {
  total: 0,
  byFile: [],
  categories: {
    override: [], // Overriding third-party styles
    responsive: [], // Media query overrides
    utility: [], // Utility classes
    component: [], // Component-specific
    animation: [], // Animation-related
    other: [] // Unclassified
  }
};

for (const filePath of cssFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileResults = {
    path: path.relative(cssDir, filePath),
    count: 0,
    instances: []
  };

  lines.forEach((line, index) => {
    if (line.includes('!important')) {
      fileResults.count++;
      results.total++;

      const trimmed = line.trim();
      const selector = trimmed.split('{')[0]?.trim() || 'unknown';
      const property = trimmed.match(/([a-z-]+):\s*[^;]+!important/)?.[1] || 'unknown';

      const instance = {
        line: index + 1,
        selector,
        property,
        fullLine: trimmed.substring(0, 100) // First 100 chars
      };

      fileResults.instances.push(instance);

      // Categorize
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('@media') || lowerLine.includes('responsive')) {
        results.categories.responsive.push(instance);
      } else if (lowerLine.includes('animation') || lowerLine.includes('keyframes')) {
        results.categories.animation.push(instance);
      } else if (selector.startsWith('.') && selector.length < 30) {
        results.categories.utility.push(instance);
      } else if (selector.includes('card') || selector.includes('button') || selector.includes('modal')) {
        results.categories.component.push(instance);
      } else if (lowerLine.includes('override') || lowerLine.includes('reset')) {
        results.categories.override.push(instance);
      } else {
        results.categories.other.push(instance);
      }
    }
  });

  if (fileResults.count > 0) {
    results.byFile.push(fileResults);
  }
}

// Sort by count (descending)
results.byFile.sort((a, b) => b.count - a.count);

// Write report
const reportPath = path.join(__dirname, '..', 'audit-reports', 'important-analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

console.log('📊 !important Analysis Complete\n');
console.log(`Total !important declarations: ${results.total}\n`);
console.log('Top files by count:');
results.byFile.slice(0, 10).forEach(file => {
  console.log(`  ${file.path}: ${file.count}`);
});

console.log('\nBy category:');
Object.entries(results.categories).forEach(([category, instances]) => {
  console.log(`  ${category}: ${instances.length}`);
});

console.log(`\n📄 Full report: ${reportPath}`);

