# Comprehensive CSS and Fonts Audit & Optimization Guide

**Version:** 2.0  
**Last Updated:** 2025-01-27  
**Status:** Complete Reference Guide

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Industry Standards & Best Practices](#industry-standards--best-practices)
4. [CSS Audit Process](#css-audit-process)
5. [Font Audit Process](#font-audit-process)
6. [FOIT/FOUT Mitigation Strategies](#foitfout-mitigation-strategies)
7. [Performance Optimization](#performance-optimization)
8. [Modularization & Granularity](#modularization--granularity)
9. [Duplicate & Conflicting Styles](#duplicate--conflicting-styles)
10. [Unused CSS Removal](#unused-css-removal)
11. [MCP Server Workflow (Cursor IDE)](#mcp-server-workflow-cursor-ide)
12. [Implementation Roadmap](#implementation-roadmap)
13. [Tools & Scripts](#tools--scripts)
14. [References & Best Practices](#references--best-practices)

---

## Executive Summary

This comprehensive guide provides a complete, actionable plan for auditing, optimizing, and restructuring the CSS and font architecture of the Logi-Ink project. The goal is to:

- ✅ Achieve industry-standard CSS architecture and performance
- ✅ Optimize font loading and eliminate unused font files
- ✅ Create a more modular and granular CSS structure
- ✅ Remove duplicate and conflicting styles
- ✅ Eliminate unused CSS to reduce bundle size
- ✅ Mitigate FOIT (Flash of Invisible Text) and FOUT (Flash of Unstyled Text)
- ✅ Leverage MCP servers for automated auditing workflows

**Expected Outcomes:**
- **Reduced CSS bundle size:** 20-40% reduction through deduplication and unused CSS removal
- **Improved Core Web Vitals:** Faster LCP, reduced CLS, better INP
- **Better maintainability:** Granular, well-organized CSS modules
- **Optimized font loading:** Only load required font variants with proper FOIT/FOUT mitigation
- **Automated workflows:** MCP server integration for continuous auditing

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

## Industry Standards & Best Practices

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

### Critical Strategies Beyond Modularization

Beyond making CSS modular and granular (BEM, OOCSS, SMACSS), additional critical strategies include:

#### Performance Optimization
- **Minification and Compression:** Use build tools to minify CSS and serve with Gzip/Brotli compression
- **Critical CSS:** Inline minimum CSS for above-the-fold content
- **Remove Unused CSS (Purge):** Use PurgeCSS to eliminate unused selectors

#### Maintainability and Architecture
- **CSS Preprocessors (Sass/LESS):** Variables, mixins, nesting, functions
- **CSS Custom Properties:** Runtime manipulation with JavaScript, true theming layer
- **Naming Convention Standard:** Strict adherence to BEM or similar standard
- **Documentation:** Style Guide or Component Library (Storybook)

#### Scalability and Consistency
- **Utility-First Approach:** Consider Tailwind CSS for rapid development
- **Design Tokens:** Abstract variables in JSON format, compiled to CSS Custom Properties
- **CSS-in-JS:** For component-heavy applications (React/Vue), automatic scoping

#### Debugging and Safety
- **Linting and Static Analysis:** Stylelint for coding standards
- **Avoid Overly Specific Selectors:** Prefer flat, simple selectors with low specificity

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

## FOIT/FOUT Mitigation Strategies

### Overview

This section outlines industry-standard CSS properties and techniques to manage and mitigate **FOIT** (Flash of Invisible Text) and **FOUT** (Flash of Unstyled Text). The goal is to prioritize **text visibility** (avoiding FOIT) and **minimize layout shift** (reducing FOUT/CLS).

### 1. Primary Control: The `font-display` Descriptor

The `font-display` descriptor, used within the `@font-face` rule, is the single most important tool for controlling how a web font is loaded and displayed.

| `font-display` Value | Block Period | Swap Period | Effect on Text | Recommended Use |
| :--- | :--- | :--- | :--- | :--- |
| **`swap`** | Extremely short (often 0s) | Indefinite | Shows fallback font immediately (**FOUT**), then swaps to the custom font. **Avoids FOIT.** | **Most common recommendation** for readability and performance. Text is always visible. |
| **`block`** | 3 seconds | Indefinite | **Hides text** for up to 3 seconds (**FOIT**), then displays it with the custom font. | **Use with caution** for critical brand fonts where a flash of the wrong font is unacceptable. |
| **`fallback`** | Short (approx. 100ms) | Short (approx. 3s) | **Hides text** briefly (mild **FOIT**), then displays the fallback (**FOUT**). If the custom font loads quickly, it's used. If it loads late, the fallback is used permanently. | For non-essential fonts where rapid loading or permanent fallback is acceptable. |
| **`optional`** | Extremely short (often 0s) | Extremely short (often 0s) | The browser decides whether to load the font based on connection speed. If the font is not cached, the browser may skip loading it entirely for that page view. | For purely aesthetic fonts where its absence does not impact design or function. Avoids both FOIT and FOUT (by not loading the font). |

**Actionable Audit Step 1 (AAS-1):**
> **CHECK:** Audit every `@font-face` declaration in the codebase.
> **GOAL:** Ensure all critical text fonts use `font-display: swap;` to eliminate FOIT and prioritize text visibility. Re-evaluate if any font uses `block` and justify the potential 3-second visibility delay.

### 2. Speed Optimization: Preloading and Self-Hosting

While `font-display: swap` fixes FOIT, it still results in FOUT. The best way to reduce FOUT is to make the custom font load *faster*.

#### Technique 2.1: Preloading (High Priority Fonts)

Use the `rel="preload"` attribute to tell the browser to fetch the font asset much earlier in the critical rendering path.

```html
<link rel="preload" 
  href="/fonts/MyCustomFont.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin> 
```

| Attribute | Purpose |
| :--- | :--- |
| `rel="preload"` | Initiates an early fetch for the resource. |
| `as="font"` | Tells the browser it's a font, which allows it to apply appropriate resource prioritization. |
| `type="font/woff2"` | Optional, but improves performance by allowing the browser to skip the download if it doesn't support the format. |
| `crossorigin` | **MANDATORY** for font preloads, even if the font is on the same domain, as fonts are fetched using an anonymous cross-origin request. |

#### Technique 2.2: Self-Hosting

If your fonts are hosted externally (e.g., Google Fonts, Adobe Fonts), consider self-hosting them. This eliminates an external DNS lookup and connection handshake, often significantly improving performance and reducing FOUT duration. **Ensure you use the highly compressed `woff2` format.**

**Actionable Audit Step 2 (AAS-2):**
> **CHECK:** Review all web fonts used on the most critical pages (LCP candidates).
> **GOAL:** Implement `<link rel="preload">` for the WOFF2 files of these high-priority fonts, ensuring the `crossorigin` attribute is present. Migrate all externally loaded fonts to self-hosting if possible and use `woff2`.

### 3. Minimizing Layout Shift (CLS Reduction)

A layout shift (the "flash" in FOUT) occurs because the custom font and the fallback font have different sizing metrics (width, height, ascent, descent). This can be mitigated using **CSS Font Metric Adjustments**.

#### Technique 3.1: The `font-size-adjust` Property (Fallback only)

The `font-size-adjust` property scales a font's x-height to match the x-height of another font, making the fallback font's size more closely match the custom font.

```css
body {
  /* Set the default font stack */
  font-family: 'CustomFont', Arial, sans-serif; 
  
  /* Apply font-size-adjust based on CustomFont's aspect ratio */
  /* If CustomFont has an aspect ratio of 0.5, and Arial has 0.52... */
  /* Using 0.5 will scale Arial down to match CustomFont's x-height */
  font-size-adjust: 0.5;
}
```

#### Technique 3.2: The `size-adjust` Descriptors (Modern `@font-face`)

The `@font-face` rule now supports descriptors that allow you to precisely modify the metrics of a font, which is most powerful when applied to the **fallback font** to make it mimic your custom font.

**Steps:**

1. Identify a suitable **system font** to use as a fallback.
2. Define a new `@font-face` rule for that system font, giving it a custom family name (e.g., `CustomFont-Fallback`).
3. Use the `size-adjust` and related descriptors (`ascent-override`, `descent-override`, `line-gap-override`) to match its metrics to your desired web font.

```css
/* 1. Define your custom web font with a fallback stack */
@font-face {
  font-family: 'MyCustomWebFont';
  src: url('/fonts/Custom.woff2') format('woff2');
  font-display: swap; 
}

/* 2. Define a "metric-matched" system font as the engineered fallback */
@font-face {
  font-family: 'MyCustomWebFont-Fallback';
  src: local('Arial'); /* Use a local system font */
  /* These values adjust the system font to align with 'MyCustomWebFont' */
  size-adjust: 105%; 
  ascent-override: 95%; 
  descent-override: 20%; 
  /* font-display should match the main font or be 'optional' */
}

/* 3. Use the engineered fallback in your CSS */
.text-area {
  font-family: 'MyCustomWebFont', 'MyCustomWebFont-Fallback', sans-serif;
}
```

**Actionable Audit Step 3 (AAS-3):**
> **CHECK:** Analyze the CLS report for pages impacted by FOUT.
> **GOAL:** For fonts causing significant layout shift, implement the **Font Metric Adjustment** technique. Use tools (e.g., Google Fonts Helper tools) to calculate the precise `size-adjust` values to make the selected fallback font visually match the custom web font, thereby eliminating the jump when the font swaps.

### 4. Codebase Audit Checklist (FOIT/FOUT)

| ID | Issue to Look For | Fix/Solution | Priority |
| :--- | :--- | :--- | :--- |
| **A-1** | Text remains invisible for a period (FOIT). | Change `@font-face` to use **`font-display: swap;`**. | **High** |
| **A-2** | Large, visible jump/shift when text reappears (FOUT/CLS). | **Preload** the font file using `<link rel="preload" as="font" crossorigin>`. | **High** |
| **A-3** | Inefficient font file format. | Ensure only **WOFF2** is used for modern browsers, or WOFF/TTF/OTF for fallbacks (if necessary). | **Medium** |
| **A-4** | Font-loading delays on third-party domains. | **Self-host** all necessary font files to eliminate external connection overhead. | **Medium** |
| **A-5** | Fallback and custom fonts have dramatically different metrics (CLS). | Apply **`size-adjust`** and related override descriptors to the system fallback font to match the custom font's metrics. | **High** |
| **A-6** | Loading non-critical font variants (e.g., Bold, Italic) too early. | **Defer** the loading of non-critical variants or use `font-display: optional;` for them. | **Medium** |

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

## MCP Server Workflow (Cursor IDE)

### Overview

This section provides guidance on using Model Context Protocol (MCP) servers within Cursor IDE for comprehensive CSS and font auditing. MCP servers enable automated workflows and advanced analysis capabilities.

### MCP Server Overview

**Available MCP Servers:**
1. **Filesystem MCP** - Project structure analysis and file operations
2. **Chrome DevTools MCP** - Performance profiling and CSS coverage analysis
3. **Context7 MCP** - Latest documentation and best practices research
4. **Brave Search MCP** - Industry standards and solution research
5. **Playwright MCP** - Automated testing and cross-browser validation
6. **Sequential Thinking MCP** - Strategic planning and decision-making
7. **Firecrawl MCP** - External resource research and documentation scraping

### Phase 1: Discovery & Inventory

#### Step 1.1: Project Structure Analysis
**Using Filesystem MCP:**
- Discover all CSS files
- Find CSS-in-JS files
- Locate font files
- Analyze file sizes

#### Step 1.2: Asset Inventory Creation
**Using Filesystem MCP:**
- Get detailed info for each CSS file
- List all stylesheets
- Identify external dependencies

### Phase 2: CSS Analysis & Documentation Research

#### Step 2.1: Research Latest CSS Best Practices
**Using Context7 MCP:**
- Get latest CSS architecture guidelines
- Research CSS performance optimization

#### Step 2.2: Industry Standards Research
**Using Brave Search MCP:**
- Search for CSS optimization tools and techniques
- Research font loading optimization

#### Step 2.3: Framework-Specific Research
**Using Firecrawl MCP:**
- Scrape CSS optimization guides
- Research CSS modules best practices

### Phase 3: Performance & Usage Analysis

#### Step 3.1: CSS Coverage Analysis
**Using Chrome DevTools MCP:**
- Start performance trace
- Navigate to application
- Stop trace and analyze

#### Step 3.2: CSS Coverage Detection
**Using Chrome DevTools MCP:**
- Enable CSS coverage
- Simulate user interactions
- Get coverage report

#### Step 3.3: Network Performance Analysis
**Using Chrome DevTools MCP:**
- Analyze network requests for CSS and fonts
- Get specific network request details

#### Step 3.4: Cross-Browser Testing
**Using Playwright MCP:**
- Run CSS coverage test across browsers
- Validate compatibility

### Phase 4: Code Quality Audit

#### Step 4.1: Duplicate Detection
**Using Filesystem MCP:**
- Read and analyze main stylesheet
- Search for duplicate color definitions
- Find duplicate font-family declarations

#### Step 4.2: Specificity Analysis
**Using Chrome DevTools MCP:**
- Analyze CSS specificity conflicts
- Calculate selector specificity

#### Step 4.3: Font Declaration Audit
**Using Filesystem MCP:**
- Search for @font-face declarations
- Find font-display usage

### Phase 5: Optimization & Refactoring Plan

#### Step 5.1: Strategic Planning
**Using Sequential Thinking MCP:**
- Analyze CSS optimization challenge
- Generate optimization strategy

#### Step 5.2: Architecture Planning
**Using Sequential Thinking MCP:**
- Evaluate CSS architecture options
- Compare different approaches

#### Step 5.3: Implementation Roadmap
**Using Sequential Thinking MCP:**
- Create step-by-step implementation plan
- Define phases and milestones

### Phase 6: Implementation & Verification

#### Step 6.1: Performance Comparison
**Using Chrome DevTools MCP:**
- Baseline performance measurement
- Take baseline screenshot
- Compare before/after metrics

#### Step 6.2: Regression Testing
**Using Playwright MCP:**
- Compare visual differences after optimization
- Run comprehensive cross-browser tests
- Check for layout issues

#### Step 6.3: Research Additional Solutions
**Using Firecrawl MCP:**
- Research new optimization tools
- Scrape detailed information about recommended tools

### Advanced MCP Workflows

#### Automated CSS Audit Pipeline
Create an automated workflow that combines multiple MCP servers:

1. **Project Discovery** (Filesystem MCP)
2. **Research Best Practices** (Context7 + Brave Search)
3. **Performance Baseline** (Chrome DevTools)
4. **Coverage Analysis** (Playwright)
5. **Strategy Planning** (Sequential Thinking)
6. **Implementation and Verification** (Visual diff)

#### Performance Budget Validation
**Using Playwright MCP:**
- Automated performance budget enforcement
- Validate CSS and font file sizes
- Report violations

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
- [ ] Implement FOIT/FOUT mitigation

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

### FOIT/FOUT Resources

1. **MDN - font-display**
   - https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
   - Property documentation
   - Usage examples

2. **web.dev - Font Loading**
   - https://web.dev/font-loading-api/
   - Font Loading API
   - Best practices

3. **Google Fonts Helper**
   - https://google-webfonts-helper.herokuapp.com/
   - Font metric calculation tools
   - size-adjust values

---

## Quick Reference Checklist

### Immediate Actions

- [ ] **Enable CSS minification** in `vite.config.js`
- [ ] **Remove duplicate** `.pricing-card.pricing-card--magenta` (line 357)
- [ ] **Create font variables** in `variables.css`
- [ ] **Delete unused font files** (non-subset duplicates)
- [ ] **Split `cards.css`** into granular files
- [ ] **Audit font-display** values (ensure critical fonts use `swap`)
- [ ] **Implement font preloading** for critical fonts

### Medium Priority

- [ ] **Enable PurgeCSS** for unused CSS removal
- [ ] **Split `responsive.css`** or co-locate responsive styles
- [ ] **Inline critical CSS** in HTML
- [ ] **Add CSS containment** to large components
- [ ] **Consolidate hover effects** using CSS variables
- [ ] **Implement font metric adjustments** to reduce CLS

### Long-term Improvements

- [ ] **Consider variable fonts** to reduce file count
- [ ] **Implement lazy CSS loading** for below-fold content
- [ ] **Create CSS coverage automation** in CI/CD
- [ ] **Set up Stylelint** for code quality
- [ ] **Document component styles** with Storybook (optional)
- [ ] **Set up MCP server workflows** for continuous auditing

---

## Success Metrics

### Before Optimization
- CSS Bundle Size: **~XXX KB** (gzipped)
- Font Files: **24 files**
- Duplicate Styles: **X instances**
- Unused CSS: **~XX%**
- FOIT/FOUT Issues: **Present**

### Target After Optimization
- CSS Bundle Size: **< 100 KB** (gzipped, 20-40% reduction)
- Font Files: **7-8 files** (only used variants)
- Duplicate Styles: **0 instances**
- Unused CSS: **< 5%**
- FOIT/FOUT Issues: **Mitigated**

### Performance Targets
- **LCP:** < 2.5s (improve by reducing CSS blocking time)
- **CLS:** < 0.1 (optimize font loading and metric matching)
- **INP:** < 200ms (reduce CSS parsing time)
- **FCP:** < 1.8s (critical CSS optimization)

---

**Document Version:** 2.0  
**Last Updated:** 2025-01-27  
**Next Review:** After Phase 1 completion

