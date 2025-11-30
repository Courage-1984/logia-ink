import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { promises as fs } from 'fs';
import pa11y from 'pa11y';
import pa11yHtmlReporter from 'pa11y-reporter-html';
import { findChromePath } from './find-chrome-path.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPORTS_DIR = resolve(__dirname, '../reports');
const OUTPUT_FILE = resolve(REPORTS_DIR, 'seo-pa11y.html');
const CONFIG_PATH = resolve(__dirname, '../pa11y.config.json');

// Pages to audit
const PAGES = [
  { path: '/', name: 'Home' },
  { path: '/about.html', name: 'About' },
  { path: '/contact.html', name: 'Contact' },
  { path: '/pricing.html', name: 'Pricing' },
  { path: '/services.html', name: 'Services' },
  { path: '/seo-services.html', name: 'SEO Services' },
  { path: '/projects.html', name: 'Projects' },
  { path: '/reports.html', name: 'Reports' },
];

async function runPa11yReport(baseUrl = 'http://127.0.0.1:4173', outputPath = OUTPUT_FILE) {
  const configRaw = await fs.readFile(CONFIG_PATH, 'utf8');
  const config = JSON.parse(configRaw);

  // Find and set Chrome executable path
  const chromePath = findChromePath();
  if (!chromePath) {
    throw new Error('Chrome executable not found. Please install Google Chrome.');
  }

  // Update config with Chrome path
  if (!config.chromeLaunchConfig) {
    config.chromeLaunchConfig = {};
  }
  config.chromeLaunchConfig.executablePath = chromePath;
  // Note: Do not set config.browser - it must be a Puppeteer Browser instance, not a string
  // The browser will be launched automatically using chromeLaunchConfig

  await fs.mkdir(REPORTS_DIR, { recursive: true });

  console.log(`🔍 Using Chrome at: ${chromePath}\n`);

  console.log('🔍 Running accessibility audits on all pages...\n');

  const allResults = [];
  const summary = {
    total: PAGES.length,
    passed: 0,
    failed: 0,
    errors: 0,
    warnings: 0,
    notices: 0,
  };

  // Run audits for all pages
  for (const page of PAGES) {
    const url = `${baseUrl}${page.path}`;
    console.log(`  Auditing ${page.name} (${url})...`);

    try {
      const results = await pa11y(url, config);
      results.pageName = page.name;
      results.pageUrl = url;
      allResults.push(results);

      // Count issues
      const issues = results.issues || [];
      summary.errors += issues.filter(i => i.type === 'error').length;
      summary.warnings += issues.filter(i => i.type === 'warning').length;
      summary.notices += issues.filter(i => i.type === 'notice').length;

      if (issues.length === 0) {
        summary.passed++;
        console.log(`    ✅ Passed (0 issues)`);
      } else {
        summary.failed++;
        const errorCount = issues.filter(i => i.type === 'error').length;
        const warningCount = issues.filter(i => i.type === 'warning').length;
        console.log(`    ⚠️  ${errorCount} errors, ${warningCount} warnings`);
      }
    } catch (error) {
      console.error(`    ❌ Failed to audit ${page.name}:`, error.message);
      summary.failed++;
      allResults.push({
        pageName: page.name,
        pageUrl: url,
        issues: [],
        documentTitle: page.name,
        error: error.message,
      });
    }
  }

  console.log(`\n📊 Summary: ${summary.passed}/${summary.total} pages passed`);
  console.log(`   ${summary.errors} errors, ${summary.warnings} warnings, ${summary.notices} notices\n`);

  // Generate comprehensive HTML report
  const html = generateComprehensiveReport(allResults, summary);
  await fs.writeFile(outputPath, html, 'utf8');

  console.log(`✅ Comprehensive Pa11y report generated: ${outputPath}`);
}

function generateComprehensiveReport(results, summary) {
  const timestamp = new Date().toLocaleString();
  const pageReports = results.map((result, index) => {
    if (result.error) {
      return `
        <section class="page-report">
          <h2>${result.pageName}</h2>
          <p class="error">Failed to audit: ${result.error}</p>
          <p><strong>URL:</strong> <a href="${result.pageUrl}" target="_blank">${result.pageUrl}</a></p>
        </section>
      `;
    }

    const issues = result.issues || [];
    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');
    const notices = issues.filter(i => i.type === 'notice');

    const statusClass = issues.length === 0 ? 'pass' : errors.length > 0 ? 'fail' : 'warning';
    const statusText = issues.length === 0 ? '✅ Passed' : errors.length > 0 ? '❌ Failed' : '⚠️ Warnings';

    return `
      <section class="page-report ${statusClass}">
        <h2>${result.pageName} ${statusText}</h2>
        <p><strong>URL:</strong> <a href="${result.pageUrl}" target="_blank">${result.pageUrl}</a></p>
        <p><strong>Document Title:</strong> ${result.documentTitle || 'N/A'}</p>

        <div class="issue-summary">
          <span class="issue-count error">${errors.length} errors</span>
          <span class="issue-count warning">${warnings.length} warnings</span>
          <span class="issue-count notice">${notices.length} notices</span>
        </div>

        ${issues.length > 0 ? `
          <details class="issues-details">
            <summary>View ${issues.length} issue${issues.length !== 1 ? 's' : ''}</summary>
            <table class="issues-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Code</th>
                  <th>Message</th>
                  <th>Selector</th>
                </tr>
              </thead>
              <tbody>
                ${issues.map(issue => `
                  <tr class="issue-${issue.type}">
                    <td><span class="badge badge-${issue.type}">${issue.type}</span></td>
                    <td><code>${issue.code || 'N/A'}</code></td>
                    <td>${escapeHtml(issue.message)}</td>
                    <td><code>${escapeHtml(issue.selector || 'N/A')}</code></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </details>
        ` : '<p class="no-issues">✅ No accessibility issues found!</p>'}
      </section>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Audit Report - All Pages</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #e0e0e0;
      background: #0a0a0a;
      padding: 2rem;
    }
    .header {
      background: #1a1a2e;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }
    .header h1 {
      color: #00ffff;
      margin-bottom: 1rem;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .summary-item {
      background: rgba(0, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }
    .summary-item strong {
      display: block;
      color: #00ffff;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .page-report {
      background: #1a1a2e;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }
    .page-report.pass { border-color: rgba(0, 255, 0, 0.3); }
    .page-report.fail { border-color: rgba(255, 0, 0, 0.3); }
    .page-report.warning { border-color: rgba(255, 255, 0, 0.3); }
    .page-report h2 {
      color: #00ffff;
      margin-bottom: 1rem;
    }
    .page-report p {
      margin: 0.5rem 0;
      color: #b0b0b0;
    }
    .page-report a {
      color: #00ffff;
      text-decoration: none;
    }
    .page-report a:hover {
      text-decoration: underline;
    }
    .issue-summary {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }
    .issue-count {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
    }
    .issue-count.error {
      background: rgba(255, 0, 0, 0.2);
      color: #ff6666;
      border: 1px solid rgba(255, 0, 0, 0.3);
    }
    .issue-count.warning {
      background: rgba(255, 255, 0, 0.2);
      color: #ffff66;
      border: 1px solid rgba(255, 255, 0, 0.3);
    }
    .issue-count.notice {
      background: rgba(0, 255, 255, 0.2);
      color: #66ffff;
      border: 1px solid rgba(0, 255, 255, 0.3);
    }
    .issues-details {
      margin-top: 1rem;
    }
    .issues-details summary {
      cursor: pointer;
      color: #00ffff;
      padding: 0.5rem;
      background: rgba(0, 255, 255, 0.1);
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .issues-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    .issues-table th,
    .issues-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid rgba(0, 255, 255, 0.1);
    }
    .issues-table th {
      background: rgba(0, 255, 255, 0.1);
      color: #00ffff;
      font-weight: bold;
    }
    .issues-table code {
      background: rgba(0, 0, 0, 0.3);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-size: 0.9em;
    }
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .badge-error {
      background: rgba(255, 0, 0, 0.2);
      color: #ff6666;
    }
    .badge-warning {
      background: rgba(255, 255, 0, 0.2);
      color: #ffff66;
    }
    .badge-notice {
      background: rgba(0, 255, 255, 0.2);
      color: #66ffff;
    }
    .no-issues {
      color: #00ff00;
      font-weight: bold;
      margin-top: 1rem;
    }
    .error {
      color: #ff6666;
    }
    .timestamp {
      color: #666;
      font-size: 0.9em;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Accessibility Audit Report - All Pages</h1>
    <p class="timestamp">Generated: ${timestamp}</p>
    <div class="summary">
      <div class="summary-item">
        <strong>${summary.total}</strong>
        <span>Pages Audited</span>
      </div>
      <div class="summary-item">
        <strong>${summary.passed}</strong>
        <span>Pages Passed</span>
      </div>
      <div class="summary-item">
        <strong>${summary.failed}</strong>
        <span>Pages Failed</span>
      </div>
      <div class="summary-item">
        <strong>${summary.errors}</strong>
        <span>Total Errors</span>
      </div>
      <div class="summary-item">
        <strong>${summary.warnings}</strong>
        <span>Total Warnings</span>
      </div>
    </div>
  </div>

  ${pageReports}
</body>
</html>`;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPa11yReport().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { runPa11yReport };
