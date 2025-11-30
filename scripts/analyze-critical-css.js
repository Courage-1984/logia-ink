/**
 * Critical CSS Analysis Script
 *
 * Analyzes what should be considered critical CSS:
 * - Above-the-fold content on each page
 * - Required CSS variables
 * - Component dependencies
 * - Missing styles in critical.css
 *
 * Based on Phase 4: Performance Profiling & Analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Extract above-the-fold content from HTML
 */
function extractAboveFoldContent(htmlContent) {
  const aboveFold = {
    classes: new Set(),
    ids: new Set(),
    elements: new Set(),
  };

  // Find main content area (usually first <main> or <section>)
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]{0,5000})/i);
  const sectionMatch = htmlContent.match(/<section[^>]*class=["']([^"']+)["'][^>]*>([\s\S]{0,3000})/i);

  if (mainMatch) {
    const mainContent = mainMatch[1];
    // Extract classes
    const classMatches = mainContent.matchAll(/class=["']([^"']+)["']/gi);
    for (const match of classMatches) {
      match[1].split(/\s+/).forEach(cls => aboveFold.classes.add(cls));
    }
    // Extract IDs
    const idMatches = mainContent.matchAll(/id=["']([^"']+)["']/gi);
    for (const match of idMatches) {
      aboveFold.ids.add(match[1]);
    }
    // Extract element types
    const elementMatches = mainContent.matchAll(/<(\w+)/gi);
    for (const match of elementMatches) {
      aboveFold.elements.add(match[1]);
    }
  }

  // Always include navigation (above fold)
  const navMatches = htmlContent.matchAll(/class=["']([^"']*nav[^"']*)["']/gi);
  for (const match of navMatches) {
    match[1].split(/\s+/).forEach(cls => aboveFold.classes.add(cls));
  }

  // Always include hero section
  const heroMatches = htmlContent.matchAll(/class=["']([^"']*hero[^"']*)["']/gi);
  for (const match of heroMatches) {
    match[1].split(/\s+/).forEach(cls => aboveFold.classes.add(cls));
  }

  return aboveFold;
}

/**
 * Find CSS rules for given selectors
 */
function findCSSRules(selectors, cssFiles) {
  const rules = [];

  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf8');
    const lines = content.split('\n');

    selectors.forEach(selector => {
      // Simple pattern matching for selectors
      const patterns = [
        new RegExp(`^\\.${selector.replace(/\./g, '\\.')}\\s*[,\\{]`, 'm'),
        new RegExp(`\\.${selector.replace(/\./g, '\\.')}\\s*[,\\{]`, 'm'),
        new RegExp(`#${selector.replace(/#/g, '\\#')}\\s*[,\\{]`, 'm'),
        new RegExp(`^${selector}\\s*[,\\{]`, 'm'),
      ];

      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          // Find the rule block
          const match = content.match(new RegExp(`(${pattern.source}[^}]+\\})`, 's'));
          if (match) {
            rules.push({
              selector,
              file: path.relative(projectRoot, cssFile),
              rule: match[1].substring(0, 200), // First 200 chars
            });
          }
        }
      });
    });
  }

  return rules;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Analyzing Critical CSS Requirements...\n');

  // Find all HTML files
  const htmlFiles = await glob('*.html', {
    cwd: projectRoot,
    ignore: ['node_modules/**', 'dist/**', '.old/**'],
    absolute: true,
  });

  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Find all CSS files
  const cssFiles = await glob('css/**/*.css', {
    cwd: projectRoot,
    ignore: ['**/*.backup', '**/node_modules/**', '**/dist/**', '**/critical.css'],
    absolute: true,
  });

  // Analyze each HTML file
  const pageAnalysis = [];

  for (const htmlFile of htmlFiles) {
    const relativePath = path.relative(projectRoot, htmlFile);
    const content = fs.readFileSync(htmlFile, 'utf8');
    const aboveFold = extractAboveFoldContent(content);

    pageAnalysis.push({
      file: relativePath,
      aboveFold: {
        classes: Array.from(aboveFold.classes),
        ids: Array.from(aboveFold.ids),
        elements: Array.from(aboveFold.elements),
      },
    });
  }

  // Find common above-fold elements
  const commonClasses = new Map();
  const commonIds = new Set();
  const commonElements = new Set();

  pageAnalysis.forEach(page => {
    page.aboveFold.classes.forEach(cls => {
      commonClasses.set(cls, (commonClasses.get(cls) || 0) + 1);
    });
    page.aboveFold.ids.forEach(id => {
      commonIds.add(id);
    });
    page.aboveFold.elements.forEach(el => {
      commonElements.add(el);
    });
  });

  // Print summary
  console.log('📊 Above-the-Fold Analysis:\n');

  pageAnalysis.forEach(page => {
    console.log(`${page.file}:`);
    console.log(`  Classes: ${page.aboveFold.classes.length}`);
    console.log(`  IDs: ${page.aboveFold.ids.length}`);
    console.log(`  Elements: ${page.aboveFold.elements.length}`);
    console.log('');
  });

  // Find most common classes (likely critical)
  const sortedClasses = Array.from(commonClasses.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  console.log('🎯 Most Common Above-the-Fold Classes:\n');
  sortedClasses.forEach(([cls, count]) => {
    console.log(`  ${cls}: ${count} pages`);
  });
  console.log('');

  // Analyze critical.css
  const criticalCSSPath = path.join(projectRoot, 'css', 'critical.css');
  const criticalCSS = fs.existsSync(criticalCSSPath)
    ? fs.readFileSync(criticalCSSPath, 'utf8')
    : '';

  console.log('📄 Critical CSS Analysis:\n');
  console.log(`Current critical.css size: ${(criticalCSS.length / 1024).toFixed(2)} KB\n`);

  // Check for required variables
  const requiredVariables = [
    '--font-heading',
    '--font-body',
    '--font-weight-',
    '--font-size-',
    '--space-',
    '--bg-primary',
    '--accent-cyan',
    '--text-primary',
  ];

  const missingVariables = [];
  requiredVariables.forEach(varName => {
    if (!criticalCSS.includes(varName)) {
      missingVariables.push(varName);
    }
  });

  if (missingVariables.length > 0) {
    console.log('⚠️  Missing Variables in critical.css:\n');
    missingVariables.forEach(v => console.log(`  - ${v}`));
    console.log('');
  } else {
    console.log('✅ All required variables found\n');
  }

  // Check for circular references
  const circularRefs = criticalCSS.match(/--\w+:\s*var\(--\w+\)/g);
  if (circularRefs) {
    console.log('⚠️  Circular Variable References:\n');
    circularRefs.forEach(ref => console.log(`  - ${ref}`));
    console.log('');
  }

  // Save report
  const report = {
    pages: pageAnalysis,
    commonClasses: sortedClasses.map(([cls, count]) => ({ class: cls, pages: count })),
    commonIds: Array.from(commonIds),
    commonElements: Array.from(commonElements),
    criticalCSSSize: criticalCSS.length,
    missingVariables,
    circularReferences: circularRefs || [],
  };

  const reportPath = path.join(projectRoot, 'audit-reports', 'critical-css-analysis.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log(`✅ Detailed report saved to: audit-reports/critical-css-analysis.json`);
}

main().catch(console.error);

