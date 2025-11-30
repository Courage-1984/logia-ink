# CSS and Fonts Audit & Optimization Guide

**Version:** 1.0  
**Last Updated:** 2025-01-27  
**Status:** Comprehensive Action Plan

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Industry Standards Alignment](#industry-standards-alignment)
4. [CSS Audit Process](#css-audit-process)
5. [Font Audit Process](#font-audit-process)
6. [Performance Optimization](#performance-optimization)
7. [Modularization & Granularity](#modularization--granularity)
8. [Duplicate & Conflicting Styles](#duplicate--conflicting-styles)
9. [Unused CSS Removal](#unused-css-removal)
10. [Implementation Roadmap](#implementation-roadmap)
11. [Tools & Scripts](#tools--scripts)
12. [References & Best Practices](#references--best-practices)

---

## Executive Summary

This guide provides a comprehensive, actionable plan for auditing, optimizing, and restructuring the CSS and font architecture of the Logi-Ink project. The goal is to:

- ✅ Achieve industry-standard CSS architecture and performance
- ✅ Optimize font loading and eliminate unused font files
- ✅ Create a more modular and granular CSS structure
- ✅ Remove duplicate and conflicting styles
- ✅ Eliminate unused CSS to reduce bundle size

**Expected Outcomes:**
- **Reduced CSS bundle size:** 20-40% reduction through deduplication and unused CSS removal
- **Improved Core Web Vitals:** Faster LCP, reduced CLS, better INP
- **Better maintainability:** Granular, well-organized CSS modules
- **Optimized font loading:** Only load required font variants

---

## Current State Analysis

### CSS Architecture

**Strengths:**
- ✅ Modular structure already in place (components, pages, utils)
- ✅ CSS Variables for design tokens
- ✅ Self-hosted fonts (privacy & performance)
- ✅ Critical CSS file exists

**Issues Identified:**

1. **File Size Issues:**
   - `cards.css` is **1,470+ lines** - needs splitting
   - `responsive.css` is **824+ lines** - could be split by component
   
2. **Duplicate Styles:**
   - `.pricing-card.pricing-card--magenta` appears twice (lines 357 & 361 in `cards.css`)
   - Repeated hover effect patterns across multiple selectors
   - Similar gradient animations duplicated

3. **Font Issues:**
   - **24 font files** found, but only **7 @font-face declarations**
   - Both subset and non-subset versions exist (waste)
   - Font-family repeated **55+ times** across files (should use CSS variables)

4. **Configuration:**
   - CSS minification **disabled** (`cssMinify: false`)
   - PurgeCSS **disabled** (unused CSS not removed)
   - CSS code splitting **disabled** (`cssCodeSplit: false`)

5. **Performance:**
   - All CSS loaded synchronously (no lazy loading for below-fold styles)
   - No CSS containment for large components
   - Multiple `@import` statements (could be optimized)

### Font Files Inventory

**Current Files:**
```
assets/fonts/
├── Orbitron/
│   └── woff2/
│       ├── Orbitron-Regular-subset.woff2 ✅ USED
│       ├── Orbitron-Bold-subset.woff2 ✅ USED
│       ├── Orbitron-Black-subset.woff2 ✅ USED
│       ├── Orbitron-VariableFont_wght-subset.woff2 ❓ UNUSED
│       ├── Orbitron-SemiBold-subset.woff2 ❓ UNUSED
│       ├── Orbitron-Medium-subset.woff2 ❓ UNUSED
│       ├── Orbitron-ExtraBold-subset.woff2 ❓ UNUSED
│       ├── Orbitron-Regular.woff2 ❌ DUPLICATE (non-subset)
│       ├── Orbitron-Bold.woff2 ❌ DUPLICATE (non-subset)
│       ├── Orbitron-Black.woff2 ❌ DUPLICATE (non-subset)
│       └── ... (more duplicates)
└── Rajdhani/
    └── woff2/
        ├── Rajdhani-Regular-subset.woff2 ✅ USED
        ├── Rajdhani-Light-subset.woff2 ✅ USED
        ├── Rajdhani-SemiBold-subset.woff2 ✅ USED
        ├── Rajdhani-Bold-subset.woff2 ✅ USED
        ├── Rajdhani-Medium-subset.woff2 ❓ UNUSED
        └── ... (non-subset duplicates)
```

**Issues:**
- **7 files in use** (declared in `fonts.css`)
- **17+ files unused** (should be removed)
- Non-subset duplicates should be removed (subset versions preferred)

---

## Industry Standards Alignment

### CSS Architecture Standards (2024)

**Best Practices:**
1. **Modular CSS** - ✅ Already implemented
2. **BEM-like naming** - ✅ Used (`.component`, `.component__element`, `.component--modifier`)
3. **CSS Variables** - ✅ Implemented
4. **Critical CSS** - ✅ File exists, but needs optimization
5. **CSS Containment** - ❌ Not used (should be added for large components)
6. **Lazy Loading** - ❌ All CSS loads synchronously

**Performance Standards:**
- **Target:** CSS bundle < 100KB (gzipped)
- **Critical CSS:** < 14KB (recommended by Google)
- **Font Files:** Only load required variants
- **Animation Performance:** Use `transform` and `opacity` only

### Font Loading Standards (2024)

**Best Practices:**
1. **Self-hosted fonts** - ✅ Already implemented
2. **WOFF2 format** - ✅ Used
3. **Font subsetting** - ✅ Implemented
4. **font-display: swap** - ✅ Used for critical fonts
5. **Font preloading** - ✅ Implemented
6. **Variable fonts** - ❌ Not fully utilized (variable font exists but not used)

**Recommended Strategy:**
- Use **variable fonts** where possible (reduces file count)
- Load only **required weights/styles**
- Use `font-display: optional` for non-critical variants
- Preload critical fonts only

---

## CSS Audit Process

### Step 1: Automated Analysis

**Tools to Use:**
1. **Chrome DevTools Coverage** - Identify unused CSS
2. **PurgeCSS** - Automated unused CSS detection
3. **CSS Lint** / **Stylelint** - Code quality checks
4. **Bundle Analyzer** - Visualize CSS bundle size

**Script to Run:**
```bash
# Generate CSS coverage report
npm run build
# Open Chrome DevTools > Coverage tab > Reload page > Export report
```

### Step 2: Manual Review Checklist

#### 2.1 File Size Review
- [ ] `cards.css` > 1000 lines → **SPLIT**
- [ ] `responsive.css` > 500 lines → **SPLIT**
- [ ] Any file > 500 lines → **CONSIDER SPLITTING**

#### 2.2 Duplicate Detection
- [ ] Search for duplicate class names
- [ ] Find repeated property patterns
- [ ] Identify similar animations
- [ ] Check for conflicting media queries

#### 2.3 Specificity Review
- [ ] Avoid deep nesting (> 3 levels)
- [ ] Minimize use of `!important`
- [ ] Check for specificity conflicts

#### 2.4 Performance Review
- [ ] Use CSS containment (`contain: layout style paint`)
- [ ] Avoid expensive selectors (`:nth-child`, complex combinators)
- [ ] Check animation performance (use `transform`/`opacity`)

### Step 3: Class Usage Audit

**Create a usage map:**
```bash
# Find all CSS classes
grep -r "^\.[a-z]" css/ > css-classes.txt

# Find all HTML class usages
grep -r 'class="' *.html partials/ > html-classes.txt

# Compare and find unused classes
```

**Manual Checks:**
1. Search each CSS class in HTML files
2. Check JavaScript for dynamically added classes
3. Verify pseudo-class usage (`:hover`, `:focus`, etc.)

---

## Font Audit Process

### Step 1: Font File Audit

**Identify Used Fonts:**
```bash
# List all @font-face declarations
grep -r "@font-face" css/fonts.css

# List all font files
find assets/fonts -name "*.woff2" > font-files.txt

# Compare and identify unused files
```

**Current Usage:**
- **Orbitron:** Regular (400), Bold (700), Black (900)
- **Rajdhani:** Light (300), Regular (400), SemiBold (600), Bold (700)

### Step 2: Font-Family Usage Audit

**Find all font-family declarations:**
```bash
grep -r "font-family" css/ > font-family-usage.txt
```

**Issues Found:**
- `font-family: 'Orbitron'` appears **23+ times**
- `font-family: 'Rajdhani'` appears **20+ times**
- Should use CSS variables instead

**Solution:**
```css
/* In variables.css */
:root {
  --font-heading: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
}

/* Usage */
h1, h2, h3 {
  font-family: var(--font-heading);
}
```

### Step 3: Font Loading Optimization

**Check font-display strategy:**
- Critical fonts: `font-display: swap` ✅
- Non-critical: `font-display: optional` ✅

**Evaluate variable font usage:**
- `Orbitron-VariableFont_wght-subset.woff2` exists but not used
- **Consider:** Use variable font to replace multiple static files

---

## Performance Optimization

### CSS Performance

#### 1. Enable CSS Minification
**Current:** `cssMinify: false`  
**Action:** Enable in `vite.config.js`
```javascript
build: {
  cssMinify: true, // Enable CSS minification
}
```

#### 2. Enable CSS Code Splitting
**Current:** `cssCodeSplit: false`  
**Action:** Enable per-page splitting
```javascript
build: {
  cssCodeSplit: true, // Split CSS per page
}
```

#### 3. Critical CSS Inlining
**Current:** `critical.css` exists but not inlined  
**Action:** Inline critical CSS in HTML `<head>`

**Script:** Use existing `inline-critical-css.js`
```bash
npm run inline-critical-css
```

#### 4. Add CSS Containment
**For large components:**
```css
.service-card {
  contain: layout style paint;
}

.services-grid {
  contain: layout;
}
```

#### 5. Lazy Load Below-Fold CSS
**Strategy:**
- Inline critical CSS
- Load remaining CSS asynchronously
- Use `media="print"` trick for non-critical CSS

```html
<!-- Critical CSS inlined -->
<style>
  /* Critical CSS here */
</style>

<!-- Non-critical CSS loaded async -->
<link rel="stylesheet" href="css/non-critical.css" media="print" onload="this.media='all'">
```

### Font Performance

#### 1. Remove Unused Font Files
**Action Items:**
- Delete non-subset duplicates
- Remove unused variants (Medium, ExtraBold, etc.)
- Keep only: Regular, Bold, Black (Orbitron) + Light, Regular, SemiBold, Bold (Rajdhani)

#### 2. Consider Variable Fonts
**Option:** Replace multiple Orbitron files with variable font
- Current: 3 files (Regular, Bold, Black)
- Variable: 1 file (covers all weights)

**Trade-off:** Larger file size vs. fewer HTTP requests

#### 3. Font Preloading Strategy
**Current:** Preloads critical fonts ✅  
**Optimization:**
```html
<!-- Only preload critical fonts -->
<link rel="preload" href="./assets/fonts/Orbitron/woff2/Orbitron-Regular-subset.woff2" as="font" crossorigin="anonymous">
<link rel="preload" href="./assets/fonts/Rajdhani/woff2/Rajdhani-Regular-subset.woff2" as="font" crossorigin="anonymous">
```

#### 4. Font Loading with font-display
**Current Strategy:** ✅ Good  
- Critical: `font-display: swap`
- Non-critical: `font-display: optional`

---

## Modularization & Granularity

### Current Structure Issues

**Problem Areas:**
1. `cards.css` (1,470 lines) - Too large
2. `responsive.css` (824 lines) - Should be co-located
3. Components not granular enough

### Proposed Structure

#### Split `cards.css` Into:
```
css/components/
├── cards/
│   ├── service-card.css       # Service card styles
│   ├── project-card.css       # Project card styles
│   ├── pricing-card.css       # Pricing card styles
│   ├── offer-panel.css        # Offer panel styles
│   ├── card-animations.css    # Card-specific animations
│   └── card-variants.css      # Color variants (cyan, magenta, etc.)
```

#### Split `responsive.css` Into:
**Strategy:** Co-locate responsive styles with components
```
css/components/
├── navigation.css
│   └── @media queries at bottom of file
├── cards/
│   └── service-card.css
│       └── @media queries at bottom
```

**Alternative:** Create responsive partials
```
css/utils/responsive/
├── navigation-responsive.css
├── cards-responsive.css
├── hero-responsive.css
└── base-responsive.css
```

### Granular Component Splitting

**Components to Split:**

1. **Cards** → Split by type
   - Service cards
   - Project cards
   - Pricing cards
   - Offer panels

2. **Forms** → Split by element type
   - `forms/input.css`
   - `forms/textarea.css`
   - `forms/select.css`
   - `forms/validation.css`

3. **Navigation** → Already good, but could extract:
   - `navigation/mobile-menu.css`
   - `navigation/desktop-nav.css`

4. **Typography** → Split by element
   - `typography/headings.css`
   - `typography/body.css`
   - `typography/code.css`
   - `typography/quotes.css`

### Implementation Steps

1. **Create new directory structure**
2. **Move styles to granular files**
3. **Update `main.css` imports**
4. **Test for regressions**
5. **Update documentation**

---

## Duplicate & Conflicting Styles

### Identified Duplicates

#### 1. Pricing Card Duplicate
**Location:** `css/components/cards.css`  
**Lines:** 357, 361

```css
/* Line 357 - DUPLICATE */
.pricing-card.pricing-card--magenta {
  border-color: rgba(255, 0, 255, 0.3);
}

/* Line 361 - DUPLICATE (overrides previous) */
.pricing-card.pricing-card--magenta {
  border-color: var(--accent-magenta);
  box-shadow: 0 20px 60px var(--glow-magenta);
}
```

**Action:** Remove line 357, keep line 361

#### 2. Repeated Hover Effects
**Pattern:** Similar hover effects repeated across selectors

**Example:**
```css
/* Repeated in multiple places */
.service-card.mouse-tilt-container.process-card-cyan:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 10px 40px var(--glow-cyan);
}

.service-card.mouse-tilt-container.impact-card-cyan:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 10px 40px var(--glow-cyan);
}
/* ... repeated for each color variant */
```

**Solution:** Use CSS variables or data attributes
```css
/* Create a single rule with CSS variables */
.service-card.mouse-tilt-container[data-accent]::before {
  border-color: var(--card-accent-color);
  box-shadow: 0 10px 40px var(--card-accent-glow);
}

.service-card[data-accent="cyan"] {
  --card-accent-color: var(--accent-cyan);
  --card-accent-glow: var(--glow-cyan);
}
```

#### 3. Font-Family Duplication
**Issue:** `font-family` repeated 55+ times

**Solution:** Use CSS variables (see Font Audit section)

### Conflict Detection Process

#### Step 1: Find Conflicting Selectors
```bash
# Find duplicate class combinations
grep -r "\.pricing-card\.pricing-card" css/

# Find conflicting properties
# Use a CSS specificity calculator tool
```

#### Step 2: Specificity Conflicts
**Tools:**
- [Specificity Calculator](https://specificity.keegan.st/)
- Chrome DevTools (computed styles)

**Check for:**
- Same selector with different properties
- More specific selectors overriding intended styles
- `!important` usage (should be minimal)

#### Step 3: Media Query Conflicts
**Check for:**
- Conflicting breakpoints
- Overlapping responsive rules
- Missing mobile-first approach

---

## Unused CSS Removal

### Automated Detection

#### Option 1: PurgeCSS (Recommended)
**Current:** Disabled in `postcss.config.cjs`

**Enable PurgeCSS:**
```javascript
// postcss.config.cjs
const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === 'production'
      ? [
          purgecss({
            content: [
              './**/*.html',
              './js/**/*.js',
              './partials/**/*.html',
            ],
            defaultExtractor: content => {
              // Extract classes, IDs, attributes
              const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
              const classMatches = content.match(/class=["']([^"']+)["']/gi) || [];
              const classes = classMatches.flatMap(
                m => m.match(/class=["']([^"']+)["']/i)?.[1]?.split(/\s+/) || []
              );
              return [...broadMatches, ...innerMatches, ...classes];
            },
            safelist: [
              // Classes added dynamically by JavaScript
              'active',
              'scrolled',
              'is-ready',
              'bg-loaded',
              'is-visible',
              'mouse-tilt-container',
              'page-transition-preload',
              'page-transition-in',
              'page-transition-out',
              // Pattern matching for dynamic classes
              /^service-card/,
              /^offer-panel/,
              /^process-card-/,
              /^impact-card-/,
              /^faq-card-/,
            ],
          }),
        ]
      : []),
  ],
};
```

#### Option 2: Chrome DevTools Coverage
**Manual Process:**
1. Open Chrome DevTools
2. Go to Coverage tab
3. Reload page
4. Export unused CSS report
5. Review and remove unused styles

#### Option 3: UnusedCSS.com / PurifyCSS Online
**Online Tools:**
- Upload CSS and HTML
- Get report of unused CSS
- Download cleaned CSS

### Manual Review Checklist

#### Classes to Verify:
- [ ] All `.service-card-*` variants used?
- [ ] All `.offer-panel-*` variants used?
- [ ] Animation classes (`.fade-in-up`, `.scroll-reveal-3d`)
- [ ] Utility classes (`.container`, `.section-title`)
- [ ] Modifier classes (`.btn-large`, `.btn-outline`)

#### Pseudo-classes:
- [ ] `:hover` states (check if elements are interactive)
- [ ] `:focus` states (check if elements are focusable)
- [ ] `:active` states
- [ ] `:nth-child` variants

#### Media Queries:
- [ ] All breakpoints used?
- [ ] Duplicate responsive rules?

### JavaScript-Dynamic Classes

**Safelist for PurgeCSS:**
```javascript
safelist: [
  // Navigation
  'nav-menu.active',
  'hamburger.active',
  'navbar.scrolled',
  
  // Cards
  'service-card.mouse-tilt-container',
  'offer-panel.is-visible',
  
  // Forms
  'form-group.error',
  'form-group.success',
  
  // Page transitions
  'page-transition-preload',
  'page-transition-in',
  'page-transition-out',
  
  // Video
  'section-video-background.bg-loaded',
  'section-video-background video.is-ready',
  
  // Dynamic color variants (pattern matching)
  /^process-card-/,
  /^impact-card-/,
  /^success-card-/,
  /^faq-card-/,
  /^project-impact-/,
  /^achievement-card-/,
]
```

---

## Implementation Roadmap

### Phase 1: Preparation (Week 1)

#### Day 1-2: Analysis
- [ ] Run CSS coverage report
- [ ] Generate font usage report
- [ ] List all duplicate styles
- [ ] Document current bundle sizes

#### Day 3-4: Setup Tools
- [ ] Install/configure PurgeCSS
- [ ] Set up Stylelint
- [ ] Configure CSS minification
- [ ] Test build process

#### Day 5: Backup & Branch
- [ ] Create backup branch
- [ ] Document current state
- [ ] Set up testing checklist

### Phase 2: Font Optimization (Week 2)

#### Day 1-2: Font Audit
- [ ] Identify unused font files
- [ ] Document font usage
- [ ] Create font variable map

#### Day 3-4: Font Cleanup
- [ ] Remove unused font files
- [ ] Replace font-family with variables
- [ ] Test font loading
- [ ] Update documentation

#### Day 5: Font Performance
- [ ] Optimize font-display strategy
- [ ] Review preloading
- [ ] Test variable fonts (optional)

### Phase 3: CSS Deduplication (Week 3)

#### Day 1-2: Remove Duplicates
- [ ] Fix pricing card duplicate
- [ ] Consolidate hover effects
- [ ] Remove conflicting styles

#### Day 3-4: Optimize Selectors
- [ ] Reduce specificity conflicts
- [ ] Replace repeated patterns with variables
- [ ] Consolidate media queries

#### Day 5: Testing
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Cross-browser testing

### Phase 4: Modularization (Week 4)

#### Day 1-2: Split Cards
- [ ] Create `css/components/cards/` directory
- [ ] Split `cards.css` into granular files
- [ ] Update imports
- [ ] Test

#### Day 3: Split Responsive
- [ ] Co-locate responsive styles OR
- [ ] Create responsive partials
- [ ] Update imports

#### Day 4-5: Refine Structure
- [ ] Review file sizes
- [ ] Ensure consistency
- [ ] Update documentation

### Phase 5: Unused CSS Removal (Week 5)

#### Day 1-2: Automated Removal
- [ ] Enable PurgeCSS
- [ ] Configure safelist
- [ ] Test automated removal

#### Day 3-4: Manual Review
- [ ] Review PurgeCSS results
- [ ] Manually verify unused classes
- [ ] Remove confirmed unused CSS

#### Day 5: Validation
- [ ] Full site testing
- [ ] Performance benchmarking
- [ ] Bundle size comparison

### Phase 6: Performance Optimization (Week 6)

#### Day 1-2: Critical CSS
- [ ] Optimize critical CSS
- [ ] Inline critical CSS
- [ ] Lazy load non-critical

#### Day 3: CSS Containment
- [ ] Add containment to large components
- [ ] Test performance impact

#### Day 4-5: Final Optimization
- [ ] Enable CSS minification
- [ ] Enable code splitting
- [ ] Final performance testing

### Phase 7: Documentation & Cleanup (Week 7)

#### Day 1-2: Update Documentation
- [ ] Update `.cursor/rules/cursorrules.mdc`
- [ ] Document new structure
- [ ] Create migration guide

#### Day 3-4: Code Review
- [ ] Review all changes
- [ ] Ensure consistency
- [ ] Fix any regressions

#### Day 5: Release
- [ ] Final testing
- [ ] Merge to main
- [ ] Deploy and monitor

---

## Tools & Scripts

### Automated Tools

#### 1. PurgeCSS
**Install:**
```bash
npm install --save-dev @fullhuman/postcss-purgecss
```

**Configuration:** See "Unused CSS Removal" section

#### 2. Stylelint
**Install:**
```bash
npm install --save-dev stylelint stylelint-config-standard
```

**Configuration:** `stylelint.config.js`
```javascript
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': '^[a-z][a-z0-9-]*(__[a-z0-9-]+)*(--[a-z0-9-]+)*$',
    'max-nesting-depth': 3,
    'no-descending-specificity': true,
    'declaration-block-no-duplicate-properties': true,
  },
};
```

#### 3. CSS Coverage Analysis Script
**Create:** `scripts/analyze-css-coverage.js`
```javascript
/**
 * Analyze CSS coverage and generate report
 * Usage: node scripts/analyze-css-coverage.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const htmlFiles = glob.sync('**/*.html', { ignore: ['node_modules/**', 'dist/**'] });
const cssFiles = glob.sync('css/**/*.css');

// Extract all classes from HTML
const htmlClasses = new Set();
htmlFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const matches = content.matchAll(/class=["']([^"']+)["']/g);
  for (const match of matches) {
    match[1].split(/\s+/).forEach(cls => htmlClasses.add(cls));
  }
});

// Extract all classes from CSS
const cssClasses = new Set();
cssFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const matches = content.matchAll(/\.([a-z][a-z0-9_-]*)/g);
  for (const match of matches) {
    cssClasses.add(match[1]);
  }
});

// Find unused CSS classes
const unusedClasses = [...cssClasses].filter(cls => !htmlClasses.has(cls));

// Generate report
const report = {
  totalHtmlClasses: htmlClasses.size,
  totalCssClasses: cssClasses.size,
  unusedClasses: unusedClasses.sort(),
  unusedCount: unusedClasses.length,
  unusedPercentage: ((unusedClasses.length / cssClasses.size) * 100).toFixed(2),
};

writeFileSync('reports/css-coverage-report.json', JSON.stringify(report, null, 2));
console.log(`✅ CSS Coverage Report Generated`);
console.log(`   Total CSS Classes: ${report.totalCssClasses}`);
console.log(`   Unused Classes: ${report.unusedCount} (${report.unusedPercentage}%)`);
```

#### 4. Font Usage Analyzer
**Create:** `scripts/analyze-font-usage.js`
```javascript
/**
 * Analyze font file usage
 * Usage: node scripts/analyze-font-usage.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';

const fontsDir = resolve(process.cwd(), 'assets/fonts');
const cssDir = resolve(process.cwd(), 'css');

// Get all font files
const fontFiles = [];
function scanDirectory(dir, relativePath = '') {
  const entries = readdirSync(dir);
  entries.forEach(entry => {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath, `${relativePath}/${entry}`);
    } else if (entry.endsWith('.woff2')) {
      fontFiles.push({
        name: entry,
        path: `${relativePath}/${entry}`,
        fullPath,
        size: stat.size,
      });
    }
  });
}

scanDirectory(fontsDir);

// Get @font-face declarations
const fontFaces = [];
const cssFiles = [
  resolve(cssDir, 'fonts.css'),
  resolve(cssDir, 'critical.css'),
];

cssFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const matches = content.matchAll(/url\(['"]?([^'"]+)['"]?\)/g);
  for (const match of matches) {
    const url = match[1];
    if (url.includes('.woff2')) {
      const fileName = url.split('/').pop();
      fontFaces.push(fileName);
    }
  }
});

// Compare
const usedFonts = fontFiles.filter(f => 
  fontFaces.some(ff => f.name === ff || f.name.includes(ff.replace('.woff2', '')))
);
const unusedFonts = fontFiles.filter(f => !usedFonts.includes(f));

// Generate report
const report = {
  totalFontFiles: fontFiles.length,
  usedFonts: usedFonts.map(f => ({
    name: f.name,
    size: (f.size / 1024).toFixed(2) + ' KB',
  })),
  unusedFonts: unusedFonts.map(f => ({
    name: f.name,
    path: f.path,
    size: (f.size / 1024).toFixed(2) + ' KB',
  })),
  totalUnusedSize: (unusedFonts.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(2) + ' KB',
};

console.log('✅ Font Usage Report');
console.log(`   Total Font Files: ${report.totalFontFiles}`);
console.log(`   Used: ${report.usedFonts.length}`);
console.log(`   Unused: ${report.unusedFonts.length} (${report.totalUnusedSize})`);
console.log('\n📦 Unused Font Files:');
report.unusedFonts.forEach(f => {
  console.log(`   - ${f.name} (${f.size})`);
});
```

### Manual Tools

#### Chrome DevTools
- **Coverage Tab:** Identify unused CSS
- **Performance Tab:** Measure CSS impact
- **Network Tab:** Check CSS loading

#### Online Tools
- [PurifyCSS Online](https://purifycss.online/)
- [UnusedCSS.com](https://unused-css.com/)
- [Specificity Calculator](https://specificity.keegan.st/)

---

## References & Best Practices

### CSS Performance

1. **web.dev - Optimize CSS Delivery**
   - https://web.dev/articles/defer-non-critical-css
   - Critical CSS extraction
   - Lazy loading strategies

2. **Google - CSS Web Vitals**
   - https://web.dev/articles/css-web-vitals
   - Animation performance
   - Layout shift prevention

3. **MDN - CSS Containment**
   - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment
   - Performance optimization
   - Isolation strategies

### Font Optimization

1. **web.dev - Optimize Web Fonts**
   - https://web.dev/learn/performance/optimize-web-fonts
   - Font loading strategies
   - font-display property

2. **DebugBear - Font Performance**
   - https://www.debugbear.com/blog/website-font-performance
   - Best practices
   - Loading techniques

3. **Nitropack - Font Optimization**
   - https://nitropack.io/blog/post/font-loading-optimization
   - 8 optimization strategies
   - Performance tips

### CSS Architecture

1. **MDN - Organizing CSS**
   - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing
   - File organization
   - Best practices

2. **BEM Methodology**
   - http://getbem.com/
   - Naming conventions
   - Structure guidelines

### Tools Documentation

1. **PurgeCSS**
   - https://purgecss.com/
   - Configuration guide
   - Safelist strategies

2. **Stylelint**
   - https://stylelint.io/
   - Rule configuration
   - Best practices

---

## Quick Reference Checklist

### Immediate Actions

- [ ] **Enable CSS minification** in `vite.config.js`
- [ ] **Remove duplicate** `.pricing-card.pricing-card--magenta` (line 357)
- [ ] **Create font variables** in `variables.css`
- [ ] **Delete unused font files** (non-subset duplicates)
- [ ] **Split `cards.css`** into granular files

### Medium Priority

- [ ] **Enable PurgeCSS** for unused CSS removal
- [ ] **Split `responsive.css`** or co-locate responsive styles
- [ ] **Inline critical CSS** in HTML
- [ ] **Add CSS containment** to large components
- [ ] **Consolidate hover effects** using CSS variables

### Long-term Improvements

- [ ] **Consider variable fonts** to reduce file count
- [ ] **Implement lazy CSS loading** for below-fold content
- [ ] **Create CSS coverage automation** in CI/CD
- [ ] **Set up Stylelint** for code quality
- [ ] **Document component styles** with Storybook (optional)

---

## Success Metrics

### Before Optimization
- CSS Bundle Size: **~XXX KB** (gzipped)
- Font Files: **24 files**
- Duplicate Styles: **X instances**
- Unused CSS: **~XX%**

### Target After Optimization
- CSS Bundle Size: **< 100 KB** (gzipped, 20-40% reduction)
- Font Files: **7-8 files** (only used variants)
- Duplicate Styles: **0 instances**
- Unused CSS: **< 5%**

### Performance Targets
- **LCP:** < 2.5s (improve by reducing CSS blocking time)
- **CLS:** < 0.1 (optimize font loading)
- **INP:** < 200ms (reduce CSS parsing time)

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-27  
**Next Review:** After Phase 1 completion

