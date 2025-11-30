# The Ultimate CSS & Font Architecture, Audit, and Optimization Master Guide

**Version:** 3.0 - Master Consolidated Edition  
**Last Updated:** January 2025  
**Status:** Comprehensive Master Reference  
**Sources:** Cross-referenced from Gemini, Cursor, and Genspark documentation

---

## 📋 Table of Contents

### Part I: Strategic Foundation
1. [Executive Summary](#1-executive-summary)
2. [Introduction & Prerequisites](#2-introduction--prerequisites)
3. [Industry Standards & Methodologies](#3-industry-standards--methodologies)
4. [Performance Targets & Benchmarks](#4-performance-targets--benchmarks)

### Part II: Complete Audit Methodology
5. [MCP Server Overview & Setup](#5-mcp-server-overview--setup)
6. [Current State Analysis Framework](#6-current-state-analysis-framework)
7. [7-Phase Audit Workflow](#7-seven-phase-audit-workflow)
8. [Automated Discovery & Inventory](#8-automated-discovery--inventory)
9. [Performance Profiling & Analysis](#9-performance-profiling--analysis)
10. [Code Quality Assessment](#10-code-quality-assessment)

### Part III: Optimization Strategies
11. [Font Optimization Masterclass](#11-font-optimization-masterclass)
12. [FOIT/FOUT Mitigation Techniques](#12-foitfout-mitigation-techniques)
13. [Critical CSS Strategy](#13-critical-css-strategy)
14. [CSS Architecture & Modularization](#14-css-architecture--modularization)
15. [Duplicate & Conflict Resolution](#15-duplicate--conflict-resolution)
16. [Unused CSS Elimination](#16-unused-css-elimination)

### Part IV: Implementation & Automation
17. [7-Week Implementation Roadmap](#17-seven-week-implementation-roadmap)
18. [Automation Scripts & Tools](#18-automation-scripts--tools)
19. [Build Configuration Optimization](#19-build-configuration-optimization)
20. [Testing & Validation Procedures](#20-testing--validation-procedures)

### Part V: Reference Materials
21. [Complete MCP Tool Reference](#21-complete-mcp-tool-reference)
22. [Comprehensive Checklists](#22-comprehensive-checklists)
23. [Common Issues & Solutions](#23-common-issues--solutions)
24. [Code Snippet Library](#24-code-snippet-library)
25. [Resources & Further Reading](#25-resources--further-reading)

---

## Part I: Strategic Foundation

---

## 1. Executive Summary

### 1.1 Purpose & Scope

This comprehensive master guide provides a systematic, end-to-end approach to auditing, optimizing, and restructuring CSS and font architectures for modern web applications. It combines industry best practices, automated tooling, and Model Context Protocol (MCP) server integration to deliver measurable performance improvements.

**What This Guide Delivers:**
- ✅ Complete CSS architecture audit methodology
- ✅ Font loading optimization with FOIT/FOUT elimination
- ✅ Automated workflows using MCP servers in Cursor IDE
- ✅ Performance optimization targeting Core Web Vitals
- ✅ Modular CSS structure implementation
- ✅ Duplicate and unused code elimination
- ✅ 7-week implementation roadmap with daily tasks

### 1.2 Key Objectives

**Primary Goals:**
1. **Performance Excellence:** Achieve industry-standard Core Web Vitals metrics
2. **Architectural Refinement:** Create maintainable, modular CSS structure
3. **Bundle Optimization:** Reduce CSS/font file sizes by 20-40%
4. **Visual Stability:** Eliminate layout shifts (CLS) from font loading
5. **Developer Experience:** Improve codebase maintainability and scalability

### 1.3 Expected Outcomes

**Quantifiable Results:**

| Metric | Before | Target | Improvement |
|--------|--------|--------|-------------|
| **CSS Bundle Size** | 200KB+ | <100KB (gzipped) | 50%+ reduction |
| **Font Files** | 24 files | 7-10 files | 60%+ reduction |
| **Unused CSS** | 30-40% | <5% | 85%+ cleanup |
| **CLS Score** | 0.25+ | <0.1 | Layout stability |
| **LCP Time** | 4-6s | <2.5s | 50%+ faster |
| **File Count** | Monolithic | Modular | Better maintainability |

**Qualitative Improvements:**
- ✅ Zero FOIT (Flash of Invisible Text)
- ✅ Minimal FOUT (Flash of Unstyled Text)
- ✅ Consistent design token system
- ✅ BEM-compliant naming conventions
- ✅ Automated CSS purging in production
- ✅ Component-scoped modular architecture

### 1.4 Document Structure Overview

This guide is organized into five major parts:

1. **Strategic Foundation** (You are here) - Philosophy, standards, and goals
2. **Complete Audit Methodology** - Discovery, analysis, and assessment
3. **Optimization Strategies** - Specific techniques for CSS and fonts
4. **Implementation & Automation** - Roadmap, scripts, and tooling
5. **Reference Materials** - Checklists, snippets, and resources

---

## 2. Introduction & Prerequisites

### 2.1 Who Should Use This Guide

**Target Audience:**
- Front-end developers auditing existing codebases
- Web performance engineers optimizing Core Web Vitals
- Tech leads planning CSS architecture refactoring
- DevOps engineers implementing build optimizations
- UI/UX engineers concerned with visual stability

**Skill Level:** Intermediate to Advanced
- Solid understanding of CSS fundamentals
- Experience with build tools (Vite, Webpack, Rollup)
- Familiarity with browser DevTools
- Basic knowledge of performance metrics
- (Optional) Experience with MCP servers in Cursor IDE

### 2.2 Required Tools & Environment

**Essential Software:**

1. **Cursor IDE** (v0.30+)
   - MCP server support enabled
   - Recommended extensions installed

2. **Node.js** (v18+)
   - npm or yarn package manager
   - Access to install global packages

3. **Chrome Browser** (latest)
   - DevTools Coverage tab
   - Lighthouse extension

4. **Project Access**
   - Ability to modify CSS files
   - Build tool configuration access
   - Git for version control

**Optional but Recommended:**
- Visual Studio Code (for comparison)
- Firefox Developer Edition (cross-browser testing)
- Playwright (automated testing)
- PostCSS CLI (for standalone processing)

### 2.3 MCP Servers Overview

**Model Context Protocol (MCP) Servers** enable AI-assisted automation for complex audit workflows. This guide leverages seven specialized servers:

| Server | Purpose | Key Capabilities |
|--------|---------|------------------|
| **Filesystem** | File analysis & operations | Read, search, analyze project structure |
| **Chrome DevTools** | Performance profiling | Coverage, traces, network analysis |
| **Context7** | Documentation research | Latest standards, best practices |
| **Brave Search** | Web research | Tool discovery, solution finding |
| **Playwright** | Automated testing | CSS coverage, visual regression |
| **Sequential Thinking** | Strategic planning | Problem analysis, decision-making |
| **Firecrawl** | External research | Scrape documentation, gather insights |

**Note:** While MCP servers significantly accelerate the audit process, all workflows in this guide can be executed manually using the tools listed in each section.

### 2.4 Before You Begin: Critical Checklist

**⚠️ MANDATORY PREPARATION:**

- [ ] **Create backup branch:** `git checkout -b css-optimization-backup`
- [ ] **Document current performance:** Run Lighthouse audit, save results
- [ ] **Take visual screenshots:** Capture all pages in current state
- [ ] **List all CSS files:** Create inventory with line counts
- [ ] **Identify dynamic classes:** Document JavaScript-added classes
- [ ] **Review font usage:** List all `@font-face` declarations
- [ ] **Check build config:** Note current minification/optimization settings
- [ ] **Set up local dev server:** Ensure hot reload works
- [ ] **Configure staging environment:** Have rollback capability
- [ ] **Notify stakeholders:** Communicate optimization timeline

**💡 Pro Tip:** CSS changes can have cascading visual effects. Always maintain the ability to quickly revert changes if unexpected issues arise.

---

## 3. Industry Standards & Methodologies

### 3.1 CSS Architecture Methodologies

Understanding and applying established CSS methodologies is crucial for creating maintainable, scalable stylesheets.

#### 3.1.1 BEM (Block Element Modifier)

**Philosophy:** Component-based naming that eliminates ambiguity and conflicts.

**Naming Convention:**
```css
/* Block: Standalone component */
.block {}

/* Element: Part of a block */
.block__element {}

/* Modifier: Variation of block or element */
.block--modifier {}
.block__element--modifier {}
```

**Real-World Example:**
```css
/* Card component using BEM */
.card {}                        /* Block */
.card__header {}                /* Element */
.card__header--large {}         /* Modified element */
.card__body {}                  /* Element */
.card__footer {}                /* Element */
.card--featured {}              /* Modified block */
.card--featured .card__header { /* Scoped modification */
  background: var(--accent-color);
}
```

**Benefits:**
- ✅ No naming conflicts
- ✅ Self-documenting HTML
- ✅ Easy to search and refactor
- ✅ Clear component boundaries
- ✅ Predictable specificity

**Implementation Checklist:**
- [ ] All class names follow `.block__element--modifier` pattern
- [ ] No generic class names like `.content` or `.wrapper`
- [ ] Maximum 2 underscores, 2 dashes per class name
- [ ] Element names describe function, not appearance

#### 3.1.2 OOCSS (Object-Oriented CSS)

**Philosophy:** Separate structure from skin, and container from content.

**Core Principles:**

1. **Separate Structure from Skin**
```css
/* Structure (layout/positioning) */
.media {
  display: flex;
  align-items: flex-start;
}

.media__object {
  flex-shrink: 0;
  margin-right: 1rem;
}

.media__body {
  flex: 1;
}

/* Skin (visual appearance) */
.media--bordered {
  border: 1px solid var(--border-color);
  padding: 1rem;
}

.media--shadowed {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

2. **Separate Container from Content**
```css
/* Bad: Component depends on container */
.sidebar .card {
  width: 300px;
}

/* Good: Component is independent */
.card--sidebar {
  width: 300px;
}
```

**Benefits:**
- ✅ Highly reusable components
- ✅ Smaller CSS footprint
- ✅ Easier theming
- ✅ Faster development

#### 3.1.3 SMACSS (Scalable and Modular Architecture)

**Philosophy:** Organize CSS into five categories with clear purposes.

**Categories:**

1. **Base:** Element defaults (no classes)
```css
html { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }
body { margin: 0; font-family: var(--font-body); }
```

2. **Layout:** Major page sections (prefix: `l-`)
```css
.l-header { /* ... */ }
.l-sidebar { /* ... */ }
.l-main { /* ... */ }
```

3. **Module:** Reusable components
```css
.card { /* ... */ }
.button { /* ... */ }
```

4. **State:** Current states (prefix: `is-` or `has-`)
```css
.is-active { /* ... */ }
.is-hidden { /* ... */ }
.has-error { /* ... */ }
```

5. **Theme:** Visual variations
```css
.theme-dark { /* ... */ }
.theme-high-contrast { /* ... */ }
```

#### 3.1.4 ITCSS (Inverted Triangle CSS)

**Philosophy:** Organize CSS by specificity, from generic to explicit.

**Layer Structure:**
```
Settings    → Variables, design tokens
Tools       → Mixins, functions
Generic     → Resets, normalize
Elements    → Bare HTML elements
Objects     → OOCSS patterns (layouts)
Components  → Specific UI components
Utilities   → Helper classes (!important allowed)
```

**File Organization:**
```
css/
├── 1-settings/
│   ├── _colors.css
│   ├── _typography.css
│   └── _spacing.css
├── 2-tools/
│   └── _mixins.css
├── 3-generic/
│   └── _reset.css
├── 4-elements/
│   ├── _headings.css
│   └── _forms.css
├── 5-objects/
│   ├── _container.css
│   └── _media-object.css
├── 6-components/
│   ├── _button.css
│   ├── _card.css
│   └── _navigation.css
└── 7-utilities/
    ├── _spacing.css
    └── _display.css
```

### 3.2 Utility-First CSS (Tailwind Approach)

**Philosophy:** Compose interfaces using small, single-purpose utility classes.

**Pros:**
- ✅ Extremely fast development
- ✅ Small production bundle (when purged)
- ✅ No naming decisions needed
- ✅ Consistent spacing/sizing system

**Cons:**
- ❌ Verbose HTML
- ❌ Learning curve for utility names
- ❌ Harder to visualize components in CSS
- ❌ Requires build tooling

**Hybrid Approach (Recommended):**
Use utility classes for common patterns, custom components for complex UI:

```html
<!-- Utilities for layout/spacing -->
<div class="flex items-center gap-4 p-6">
  <!-- Custom component for complex card -->
  <div class="service-card service-card--featured">
    <h3 class="service-card__title">Title</h3>
  </div>
</div>
```

### 3.3 CSS Custom Properties (Design Tokens)

**Philosophy:** Abstract visual values into reusable, semantic variables.

**Implementation Layers:**

1. **Primitive Tokens:** Raw values
```css
:root {
  /* Colors */
  --color-blue-500: #3498db;
  --color-magenta-500: #e91e63;
  --color-gray-100: #f8f9fa;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}
```

2. **Semantic Tokens:** Purpose-driven aliases
```css
:root {
  /* Brand colors */
  --color-primary: var(--color-blue-500);
  --color-accent: var(--color-magenta-500);
  --color-background: var(--color-gray-100);
  
  /* Component-specific */
  --button-padding: var(--space-4) var(--space-8);
  --card-border-radius: 8px;
  --heading-font-size: var(--font-size-lg);
}
```

3. **Component Tokens:** Scoped to components
```css
.card {
  --card-bg: var(--color-background);
  --card-padding: var(--space-6);
  --card-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  background: var(--card-bg);
  padding: var(--card-padding);
  box-shadow: var(--card-shadow);
}

/* Easy theming */
.card--dark {
  --card-bg: #1a1a1a;
  --card-shadow: 0 2px 8px rgba(255,255,255,0.1);
}
```

**Benefits:**
- ✅ Runtime theming (light/dark mode)
- ✅ Consistent design system
- ✅ Easy maintenance (change once, apply everywhere)
- ✅ JavaScript manipulation via `element.style.setProperty()`

### 3.4 Naming Conventions: Best Practices

**Class Naming Rules:**

1. **Use lowercase with hyphens** (kebab-case)
   - ✅ `.service-card`
   - ❌ `.ServiceCard`, `.service_card`

2. **Be descriptive, not presentational**
   - ✅ `.error-message`, `.featured-product`
   - ❌ `.red-text`, `.big-box`

3. **Avoid abbreviations unless universal**
   - ✅ `.navigation`, `.button`
   - ❌ `.nav`, `.btn` (acceptable if consistent project-wide)

4. **Prefix state classes**
   - ✅ `.is-active`, `.is-loading`, `.has-error`
   - ❌ `.active`, `.loading`, `.error`

5. **Namespace component variants**
   - ✅ `.card--featured`, `.button--primary`
   - ❌ `.featured`, `.primary`

**Variable Naming Rules:**

1. **Use semantic names over presentational**
   - ✅ `--color-primary`, `--font-heading`
   - ❌ `--blue`, `--big-font`

2. **Hierarchical structure with dashes**
   - ✅ `--button-primary-bg`, `--card-header-padding`

3. **Group related variables**
   - ✅ `--space-1`, `--space-2`, `--space-4`

---

## 4. Performance Targets & Benchmarks

### 4.1 Core Web Vitals Standards

**Google's Core Web Vitals** are user-centric performance metrics essential for SEO and user experience.

#### 4.1.1 Largest Contentful Paint (LCP)

**What it measures:** Loading performance - time until largest element renders.

**Target Thresholds:**
- ✅ **Good:** ≤ 2.5 seconds
- ⚠️ **Needs Improvement:** 2.5 - 4.0 seconds
- ❌ **Poor:** > 4.0 seconds

**CSS/Font Impact:**
- Render-blocking CSS delays LCP
- Font loading can delay text rendering
- Large CSS bundles increase parse time

**Optimization Strategies:**
```html
<!-- 1. Inline critical CSS -->
<style>
  /* Only above-the-fold styles */
  .hero { /* ... */ }
</style>

<!-- 2. Preload critical fonts -->
<link rel="preload" href="/fonts/heading.woff2" as="font" type="font/woff2" crossorigin>

<!-- 3. Async non-critical CSS -->
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
```

#### 4.1.2 Cumulative Layout Shift (CLS)

**What it measures:** Visual stability - unexpected layout shifts.

**Target Thresholds:**
- ✅ **Good:** ≤ 0.1
- ⚠️ **Needs Improvement:** 0.1 - 0.25
- ❌ **Poor:** > 0.25

**CSS/Font Impact:**
- Font swapping (FOUT) causes layout shifts
- Missing width/height on images
- Dynamic content insertion

**Optimization Strategies:**
```css
/* 1. Font metric matching */
@font-face {
  font-family: 'CustomFont-Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 20%;
}

/* 2. Reserve space for fonts */
body {
  font-family: 'CustomFont', 'CustomFont-Fallback', sans-serif;
}

/* 3. Use font-display: swap */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}
```

#### 4.1.3 Interaction to Next Paint (INP)

**What it measures:** Responsiveness - time from interaction to visual response.

**Target Thresholds:**
- ✅ **Good:** ≤ 200ms
- ⚠️ **Needs Improvement:** 200 - 500ms
- ❌ **Poor:** > 500ms

**CSS/Font Impact:**
- Heavy CSS selector matching
- Forced synchronous layouts
- Animation performance

**Optimization Strategies:**
```css
/* 1. Use CSS containment */
.complex-component {
  contain: layout style paint;
}

/* 2. Optimize animations (GPU-accelerated) */
.animated {
  transform: translateX(100px); /* Good */
  /* left: 100px; */ /* Bad: triggers layout */
}

/* 3. Avoid expensive selectors */
/* Bad */
div > div > div > .nested {
  /* ... */
}

/* Good */
.specific-component {
  /* ... */
}
```

### 4.2 CSS Performance Targets

**Bundle Size Targets:**

| Asset Type | Current (Typical) | Target | Good | Excellent |
|------------|-------------------|--------|------|-----------|
| **Critical CSS** | 50-100KB | <20KB | <14KB | <10KB |
| **Total CSS (gzipped)** | 150-300KB | <100KB | <75KB | <50KB |
| **Main CSS File** | 500-1000 lines | <500 lines | <300 lines | Modular |
| **Unused CSS** | 30-50% | <10% | <5% | <2% |

**Loading Performance Targets:**

| Metric | Target | Method |
|--------|--------|--------|
| **CSS Parse Time** | <50ms | Minimize file size, reduce complexity |
| **First CSS Load** | <500ms | CDN, compression, preloading |
| **CSS Coverage** | >90% | Remove unused styles |
| **Number of Requests** | <5 CSS files | Bundle/split strategically |

### 4.3 Font Performance Targets

**File Size Targets:**

| Font Type | Target Size | Method |
|-----------|-------------|--------|
| **Single Font File** | <50KB | WOFF2 compression, subsetting |
| **Total Font Bundle** | <200KB | Limit variants, use variable fonts |
| **Variable Font** | 50-100KB | Replaces multiple static files |

**Loading Performance:**

| Metric | Target | Implementation |
|--------|--------|----------------|
| **FOIT Duration** | 0ms (eliminate) | `font-display: swap` |
| **FOUT Impact** | <0.05 CLS | Font metric matching |
| **Font Load Time** | <1s | Preload, self-host, WOFF2 |
| **Fonts Loaded** | 2-4 families | Limit variety |

**Font-Display Strategy:**

| Use Case | Strategy | Reasoning |
|----------|----------|-----------|
| **Body text** | `swap` | Text must be readable immediately |
| **Headings (critical)** | `swap` | Important for LCP |
| **Decorative fonts** | `optional` | Only load on fast connections |
| **Icons** | `block` (short) | Small file, quick load |

### 4.4 Recommended Performance Budget

Create a performance budget to maintain optimization gains:

```javascript
// performance-budget.json
{
  "budget": [
    {
      "resourceType": "stylesheet",
      "budget": 100 // KB (gzipped)
    },
    {
      "resourceType": "font",
      "budget": 200 // KB (total)
    }
  ],
  "timings": [
    {
      "metric": "first-contentful-paint",
      "budget": 2000 // ms
    },
    {
      "metric": "largest-contentful-paint",
      "budget": 2500 // ms
    },
    {
      "metric": "cumulative-layout-shift",
      "budget": 0.1
    }
  ]
}
```

**Enforcement Methods:**
1. Lighthouse CI in deployment pipeline
2. Bundle analyzer alerts
3. Pre-commit hooks for file size checks
4. Automated performance testing with Playwright

---

## Part II: Complete Audit Methodology

---

## 5. MCP Server Overview & Setup

### 5.1 What are MCP Servers?

**Model Context Protocol (MCP)** is a standardized protocol for AI-assisted development workflows. MCP servers provide specialized capabilities that can be invoked by AI assistants within compatible IDEs like Cursor.

**Benefits for CSS/Font Auditing:**
- 🚀 **Automation:** Execute complex multi-step workflows automatically
- 🔍 **Deep Analysis:** Combine filesystem, browser, and research tools
- 📊 **Data Aggregation:** Gather insights from multiple sources simultaneously
- ⚡ **Speed:** Parallel execution of independent audit tasks
- 🎯 **Consistency:** Reproducible audit procedures

**Note:** While this guide leverages MCP servers for efficiency, all workflows can be executed manually using the equivalent tools mentioned in each section.

### 5.2 MCP Server Directory

#### 5.2.1 Filesystem MCP Server

**Purpose:** Project structure analysis, file operations, pattern searching

**Key Capabilities:**
- List and search files by pattern
- Read file contents with line numbers
- Analyze file sizes and metadata
- Search for content patterns across files

**Installation Verification:**
```bash
# Test filesystem access
Use tool: list_directory
Arguments: {"path": "./src"}
```

**Common Audit Uses:**
```bash
# Find all CSS files
Use tool: search_files
Arguments: {
  "path": "./",
  "pattern": "**/*.css",
  "include_content": false
}

# Get file size and line count
Use tool: get_file_info
Arguments: {"path": "./css/main.css"}

# Search for duplicate color values
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "color:\\s*#[0-9a-fA-F]{6}",
  "include_line_numbers": true
}
```

#### 5.2.2 Chrome DevTools MCP Server

**Purpose:** Browser automation, performance profiling, coverage analysis

**Key Capabilities:**
- Start/stop performance traces
- Capture CSS coverage reports
- Analyze network requests
- Take screenshots for visual regression
- Execute JavaScript in browser context

**Installation Verification:**
```bash
# Test Chrome DevTools connection
Use tool: navigate_page
Arguments: {"url": "about:blank"}
```

**Common Audit Uses:**
```bash
# Performance trace for CSS/font loading
Use tool: performance_start_trace
Arguments: {
  "categories": ["loading", "rendering", "painting"]
}

# Analyze CSS coverage
Use tool: evaluate_script
Arguments: {
  "script": "await page.coverage.startCSSCoverage(); /* interact */ await page.coverage.stopCSSCoverage();"
}

# Network analysis for fonts
Use tool: list_network_requests
Arguments: {
  "filter": {
    "resourceType": ["font", "stylesheet"]
  }
}
```

#### 5.2.3 Context7 MCP Server

**Purpose:** Documentation research, best practices discovery

**Key Capabilities:**
- Search official documentation (MDN, W3C, etc.)
- Retrieve code examples
- Access web standards specifications
- Get up-to-date API references

**Installation Verification:**
```bash
# Test Context7 access
Use tool: search_docs
Arguments: {
  "query": "CSS performance optimization",
  "source": "MDN"
}
```

**Common Audit Uses:**
```bash
# Research font-display strategies
Use tool: search_docs
Arguments: {
  "query": "font-display swap vs optional",
  "source": "MDN"
}

# Get latest CSS containment examples
Use tool: get_examples
Arguments: {
  "topic": "CSS contain property",
  "source": "web.dev"
}
```

#### 5.2.4 Brave Search MCP Server

**Purpose:** Web research for tools, solutions, and comparisons

**Key Capabilities:**
- Search the web for specific tools
- Find solution articles and tutorials
- Discover optimization techniques
- Compare tool options

**Installation Verification:**
```bash
# Test Brave Search
Use tool: web_search
Arguments: {
  "query": "CSS unused styles detection tools 2024",
  "limit": 5
}
```

**Common Audit Uses:**
```bash
# Find CSS optimization tools
Use tool: web_search
Arguments: {
  "query": "best CSS purge tools comparison",
  "limit": 10
}

# Research font subsetting tools
Use tool: web_search
Arguments: {
  "query": "WOFF2 font subsetting tool",
  "limit": 5
}
```

#### 5.2.5 Playwright MCP Server

**Purpose:** Automated browser testing, cross-browser validation

**Key Capabilities:**
- Execute automated test scripts
- Capture CSS coverage across user interactions
- Perform visual regression testing
- Test across multiple browsers (Chromium, Firefox, WebKit)

**Installation Verification:**
```bash
# Test Playwright functionality
Use tool: run_test
Arguments: {
  "script": "await page.goto('about:blank');",
  "browser": "chromium"
}
```

**Common Audit Uses:**
```bash
# Advanced CSS coverage with interactions
Use tool: run_test
Arguments: {
  "script": `
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    
    await page.coverage.startCSSCoverage();
    await page.goto('http://localhost:3000');
    
    // Simulate user interactions
    await page.click('.menu-button');
    await page.hover('.dropdown-item');
    await page.fill('input[type="search"]', 'test');
    
    const coverage = await page.coverage.stopCSSCoverage();
    await browser.close();
    
    return coverage;
  `,
  "timeout": 60000
}
```

#### 5.2.6 Sequential Thinking MCP Server

**Purpose:** Strategic planning, problem analysis, decision-making

**Key Capabilities:**
- Break down complex problems systematically
- Generate step-by-step strategies
- Evaluate multiple solution options
- Create implementation roadmaps

**Installation Verification:**
```bash
# Test Sequential Thinking
Use tool: analyze_problem
Arguments: {
  "problem": "Large CSS bundle with unused styles"
}
```

**Common Audit Uses:**
```bash
# Analyze CSS architecture issues
Use tool: analyze_problem
Arguments: {
  "problem": "CSS bundle >200KB with 40% unused styles",
  "context": "React app with 50+ components",
  "constraints": ["Maintain visual consistency", "Improve Core Web Vitals"]
}

# Generate optimization strategy
Use tool: generate_strategy
Arguments: {
  "goal": "Reduce CSS bundle size by 50%",
  "considerations": [
    "Unused style removal",
    "Modular architecture",
    "Performance optimization"
  ]
}
```

#### 5.2.7 Firecrawl MCP Server

**Purpose:** Web scraping for external documentation and resources

**Key Capabilities:**
- Scrape content from documentation sites
- Crawl multiple pages for comprehensive information
- Extract structured data from web pages
- Search specific sites for resources

**Installation Verification:**
```bash
# Test Firecrawl functionality
Use tool: scrape
Arguments: {
  "url": "https://web.dev/fast/#optimize-your-css",
  "formats": ["markdown"]
}
```

**Common Audit Uses:**
```bash
# Scrape CSS optimization guides
Use tool: scrape
Arguments: {
  "url": "https://csswizardry.com/2023/10/the-three-c-concatenate-compress-cache/",
  "formats": ["markdown"]
}

# Crawl font optimization resources
Use tool: crawl
Arguments: {
  "url": "https://web.dev/font-best-practices/",
  "max_pages": 5
}
```

### 5.3 MCP Server Setup in Cursor IDE

**Step 1: Enable MCP Support**
```json
// .cursor/config.json
{
  "mcp": {
    "enabled": true,
    "servers": [
      {
        "name": "filesystem",
        "type": "builtin"
      },
      {
        "name": "chrome-devtools",
        "type": "external",
        "command": "npx",
        "args": ["@modelcontextprotocol/server-chrome-devtools"]
      },
      {
        "name": "playwright",
        "type": "external",
        "command": "npx",
        "args": ["@modelcontextprotocol/server-playwright"]
      }
    ]
  }
}
```

**Step 2: Verify Installation**
1. Open Cursor IDE
2. Open Command Palette (Cmd/Ctrl + Shift + P)
3. Type "MCP: List Servers"
4. Verify all servers show "Connected" status

**Step 3: Test Each Server**
Run the verification commands listed in each server section above.

### 5.4 Manual Alternatives (Without MCP)

If MCP servers are unavailable, use these equivalent manual approaches:

| MCP Server | Manual Alternative |
|------------|-------------------|
| **Filesystem** | `find`, `grep`, `wc -l`, file explorer |
| **Chrome DevTools** | Chrome DevTools directly (F12) |
| **Context7** | Direct documentation browsing |
| **Brave Search** | Google/Brave search manually |
| **Playwright** | Manual Playwright scripts |
| **Sequential Thinking** | Manual planning documents |
| **Firecrawl** | Manual copy-paste from websites |

---

## 6. Current State Analysis Framework

### 6.1 Initial Assessment Checklist

Before beginning optimization, thoroughly document your current CSS/font architecture.

**📋 Project Information:**
- [ ] Project name and repository URL
- [ ] Primary framework (React, Vue, vanilla, etc.)
- [ ] Build tool (Vite, Webpack, Parcel, etc.)
- [ ] CSS preprocessor (Sass, Less, PostCSS, none)
- [ ] Current bundle size (dev vs. prod)
- [ ] Hosting/CDN configuration
- [ ] Browser support requirements

**📋 CSS Architecture Inventory:**
- [ ] Total number of CSS files
- [ ] Largest CSS file (name and line count)
- [ ] Naming convention used (BEM, SMACSS, custom, none)
- [ ] Use of CSS variables/custom properties
- [ ] Modular structure (yes/no/partial)
- [ ] Critical CSS implementation (yes/no)
- [ ] CSS-in-JS usage (styled-components, emotion, etc.)

**📋 Font Assets Inventory:**
- [ ] Total font files (count and total KB)
- [ ] Font families in use
- [ ] Weights and styles per family
- [ ] Format(s): WOFF2, WOFF, TTF, OTF, EOT
- [ ] Self-hosted vs. external (Google Fonts, etc.)
- [ ] Font loading strategy (`font-display` value)
- [ ] Subset vs. full character sets

**📋 Performance Baseline:**
- [ ] Lighthouse score (Performance, Accessibility, Best Practices)
- [ ] LCP score
- [ ] CLS score
- [ ] INP score
- [ ] Total page load time
- [ ] CSS load time
- [ ] Font load time

### 6.2 Common Issues Identification

Use this checklist to identify common problems in existing codebases:

#### 6.2.1 File Size Issues

**Indicators:**
- ❌ Single CSS file > 500 lines
- ❌ Total CSS bundle > 150KB (gzipped)
- ❌ Individual file > 1000 lines
- ❌ Multiple files each > 800 lines

**Example Findings:**
```
File Size Analysis:
- cards.css: 1,470 lines ❌ (needs splitting)
- responsive.css: 824 lines ⚠️ (consider splitting)
- main.css: 650 lines ⚠️ (borderline, review)
- navigation.css: 320 lines ✅ (good)
```

**Recommended Actions:**
- Split files > 500 lines into component modules
- Separate responsive styles or co-locate with components
- Create logical groupings (components, utilities, layouts)

#### 6.2.2 Duplicate Styles

**Detection Methods:**
```bash
# Find duplicate class definitions
grep -r "^\.[a-zA-Z]" css/ | sort | uniq -d

# Find repeated color values
grep -rh "color:" css/ | sort | uniq -c | sort -rn

# Find repeated font-family declarations
grep -rh "font-family:" css/ | sort | uniq -c | sort -rn
```

**Common Duplicate Patterns:**
1. **Exact duplicate selectors:**
```css
/* Line 357 */
.pricing-card.pricing-card--magenta {
  border-color: rgba(255, 0, 255, 0.3);
}

/* Line 361 - OVERWRITES ABOVE */
.pricing-card.pricing-card--magenta {
  border-color: var(--accent-magenta);
  box-shadow: 0 20px 60px var(--glow-magenta);
}
```

2. **Repeated effects:**
```css
/* Repeated across multiple selectors */
.card-cyan:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 10px 40px var(--glow-cyan);
}
.card-magenta:hover {
  border-color: var(--accent-magenta);
  box-shadow: 0 10px 40px var(--glow-magenta);
}
/* Solution: Create mixin or utility class */
```

3. **Hardcoded values:**
```css
/* font-family repeated 55+ times */
h1 { font-family: 'Orbitron', sans-serif; }
h2 { font-family: 'Orbitron', sans-serif; }
.heading { font-family: 'Orbitron', sans-serif; }
/* Solution: Use CSS variable */
```

#### 6.2.3 Font File Waste

**Audit Template:**
```
Font Inventory Results:

Total files found: 24
@font-face declarations: 7
Unused files: 17 (71% waste)

Used Fonts:
✅ Orbitron-Regular-subset.woff2 (45KB)
✅ Orbitron-Bold-subset.woff2 (47KB)
✅ Orbitron-Black-subset.woff2 (48KB)
✅ Rajdhani-Regular-subset.woff2 (38KB)
✅ Rajdhani-Light-subset.woff2 (36KB)
✅ Rajdhani-SemiBold-subset.woff2 (39KB)
✅ Rajdhani-Bold-subset.woff2 (40KB)

Unused Fonts (Delete):
❌ Orbitron-Regular.woff2 (non-subset duplicate)
❌ Orbitron-Bold.woff2 (non-subset duplicate)
❌ Orbitron-Medium-subset.woff2 (not in @font-face)
❌ Orbitron-ExtraBold-subset.woff2 (not in @font-face)
❌ Orbitron-VariableFont_wght-subset.woff2 (not used)
... (12 more)

Recommendations:
1. Delete all non-subset versions
2. Remove unused weights (Medium, ExtraBold)
3. Consider using variable font to reduce file count
4. Total savings: ~350KB
```

#### 6.2.4 Configuration Issues

**Build Configuration Audit:**
```javascript
// vite.config.js (Example issues)
export default {
  build: {
    cssMinify: false,        // ❌ Should be true in production
    cssCodeSplit: false,     // ❌ Should be true for route-based splitting
    rollupOptions: {
      output: {
        manualChunks: undefined // ❌ No CSS chunking strategy
      }
    }
  }
}
```

**PostCSS Configuration Audit:**
```javascript
// postcss.config.cjs (Example issues)
module.exports = {
  plugins: [
    require('autoprefixer'),
    // ❌ PurgeCSS commented out or not configured
    // ❌ CSS Nano not enabled
  ]
}
```

**Common Issues:**
- [ ] CSS minification disabled
- [ ] Code splitting disabled
- [ ] PurgeCSS not configured
- [ ] No compression (gzip/brotli)
- [ ] Source maps enabled in production

#### 6.2.5 Performance Issues

**DevTools Coverage Analysis:**
```
CSS Coverage Report:

Total CSS: 245KB (uncompressed)
Used: 147KB (60%)
Unused: 98KB (40%) ❌

Files with High Waste:
- cards.css: 45% unused
- utilities.css: 62% unused ❌
- responsive.css: 38% unused

Recommendation: Enable PurgeCSS, review utility classes
```

**Network Analysis:**
```
Font Loading Timeline:

0ms    - HTML loaded
150ms  - CSS parsed
200ms  - Font requests started ⚠️ (could be preloaded)
850ms  - Fonts loaded
900ms  - FOUT flash ❌ (0.15 CLS)

Issues:
1. Fonts not preloaded (200ms delay)
2. No font-display strategy (FOUT visible)
3. All 7 fonts load simultaneously (network congestion)

Recommendation: Preload critical fonts, use font-display: swap
```

### 6.3 Documentation Template

Create a standardized audit report using this template:

```markdown
# CSS & Font Audit Report

**Date:** [YYYY-MM-DD]
**Project:** [Project Name]
**Auditor:** [Your Name]

## Executive Summary

- Total CSS files: [X]
- Total CSS size: [X KB] (gzipped: [X KB])
- Total font files: [X]
- Total font size: [X KB]
- Unused CSS: [X%]
- Core Web Vitals: LCP [Xs], CLS [X], INP [Xms]

## Critical Issues

1. [Issue description]
   - Severity: High/Medium/Low
   - Impact: [Description]
   - Recommendation: [Action]

## File Analysis

### CSS Files
| File | Lines | Size | Unused % | Action |
|------|-------|------|----------|--------|
| main.css | 500 | 45KB | 30% | Modularize |

### Font Files
| File | Size | Used | Action |
|------|------|------|--------|
| font.woff2 | 45KB | ✅ | Keep |

## Performance Baseline

- Lighthouse Score: [X/100]
- LCP: [X.Xs]
- CLS: [X.XX]
- Total CSS Load: [Xms]
- Font Load Time: [Xms]

## Recommendations Priority List

### High Priority
1. [Action 1]
2. [Action 2]

### Medium Priority
1. [Action 1]

### Low Priority
1. [Action 1]

## Implementation Estimate

- Estimated effort: [X weeks]
- Expected bundle reduction: [X%]
- Expected performance improvement: [X%]
```

---

## 7. Seven-Phase Audit Workflow

This comprehensive workflow uses MCP servers (where available) to automate discovery, analysis, and optimization of CSS and font assets.

### 7.1 Phase 1: Discovery & Inventory

**🎯 Objective:** Create a complete inventory of all CSS and font assets

**Duration:** 1-2 hours

#### Step 1.1: Project Structure Scan

**Using Filesystem MCP:**
```bash
# Discover all CSS files (including nested)
Use tool: search_files
Arguments: {
  "path": "./",
  "pattern": "**/*.css",
  "include_content": false,
  "exclude": ["node_modules", "dist", "build"]
}

# Find CSS-in-JS files
Use tool: search_files
Arguments: {
  "path": "./src",
  "pattern": "**/*.{js,jsx,ts,tsx}",
  "content_pattern": "(styled\\.|css`|makeStyles|createStyles)",
  "include_line_numbers": true
}

# Locate all font files
Use tool: search_files
Arguments: {
  "path": "./",
  "pattern": "**/*.{woff,woff2,ttf,otf,eot}",
  "include_content": false
}
```

**Manual Alternative:**
```bash
# Find CSS files
find . -name "*.css" -not -path "*/node_modules/*" > css-files.txt

# Find font files
find . -type f \( -name "*.woff" -o -name "*.woff2" \) > font-files.txt

# Count lines in CSS files
wc -l $(cat css-files.txt)
```

**Expected Output:**
```
CSS Files Inventory:
- Found 28 CSS files
- Total lines: 8,450
- Largest: cards.css (1,470 lines)
- Average: 302 lines per file

Font Files Inventory:
- Found 24 font files
- Total size: 1.2MB
- Formats: 18 WOFF2, 6 WOFF
- Families: Orbitron (12 files), Rajdhani (12 files)
```

#### Step 1.2: File Size & Metadata Analysis

**Using Filesystem MCP:**
```bash
# Get detailed info for each CSS file
Use tool: get_file_info
Arguments: {"path": "./src/styles/main.css"}

# Repeat for all significant files
# Or batch process with list_directory

Use tool: list_directory
Arguments: {
  "path": "./public/css",
  "recursive": true,
  "include_hidden": false,
  "sort_by": "size",
  "sort_order": "desc"
}
```

**Manual Alternative:**
```bash
# Get file sizes
ls -lh public/css/*.css | sort -k5 -h

# Get detailed stats
stat -f "%N: %z bytes, %Sm" public/css/*.css
```

**Create Inventory Spreadsheet:**
| File Path | Lines | Size (KB) | Last Modified | Notes |
|-----------|-------|-----------|---------------|-------|
| css/main.css | 650 | 58 | 2025-01-15 | Entry point |
| css/cards.css | 1470 | 124 | 2025-01-10 | ⚠️ Too large |
| css/responsive.css | 824 | 67 | 2025-01-12 | ⚠️ Consider splitting |

#### Step 1.3: @font-face Declaration Audit

**Using Filesystem MCP:**
```bash
# Find all @font-face declarations
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "@font-face",
  "include_context": 10,
  "include_line_numbers": true
}
```

**Manual Alternative:**
```bash
# Extract all @font-face blocks
grep -A 10 "@font-face" css/**/*.css > font-face-declarations.txt

# Count declarations
grep -c "@font-face" css/**/*.css
```

**Document Findings:**
```css
/* Found 7 @font-face declarations in css/fonts.css: */

1. Orbitron Regular (400)
2. Orbitron Bold (700)
3. Orbitron Black (900)
4. Rajdhani Light (300)
5. Rajdhani Regular (400)
6. Rajdhani SemiBold (600)
7. Rajdhani Bold (700)

Status: 7 declared, 24 files exist → 17 unused files
```

#### Step 1.4: CSS Variable Inventory

**Using Filesystem MCP:**
```bash
# Find all CSS variable definitions
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "--[a-zA-Z][a-zA-Z0-9-]*:",
  "include_line_numbers": true
}
```

**Expected Output:**
```
CSS Variables Found: 45

Categories:
- Colors: 18 variables (--color-*, --accent-*)
- Spacing: 8 variables (--space-*)
- Typography: 6 variables (--font-size-*)
- Shadows: 5 variables (--shadow-*, --glow-*)
- Other: 8 variables

Issues:
- ❌ No --font-heading or --font-body variables
- ⚠️ Some colors hardcoded instead of using variables
```

### 7.2 Phase 2: Performance & Usage Analysis

**🎯 Objective:** Measure actual CSS/font usage and performance impact

**Duration:** 2-3 hours

#### Step 2.1: CSS Coverage Analysis

**Using Chrome DevTools MCP:**
```bash
# Start performance trace
Use tool: performance_start_trace
Arguments: {
  "categories": ["loading", "rendering", "painting", "scripting"]
}

# Navigate to application
Use tool: navigate_page
Arguments: {"url": "http://localhost:3000"}

# Wait for page to fully load
Use tool: wait_for_load_state
Arguments: {"state": "networkidle"}

# Stop trace and analyze
Use tool: performance_stop_trace
Arguments: {"analyze": true}
```

**Manual Alternative:**
1. Open Chrome DevTools (F12)
2. Go to "Coverage" tab (Cmd+Shift+P → "Show Coverage")
3. Click record button
4. Reload page
5. Interact with all UI elements (menus, modals, etc.)
6. Stop recording
7. Export report

**Expected Output:**
```
CSS Coverage Report:

Total CSS: 245KB (uncompressed)
Used: 147KB (60%)
Unused: 98KB (40%)

File-by-file breakdown:
- main.css: 65% used (35% unused)
- cards.css: 55% used (45% unused) ⚠️
- utilities.css: 38% used (62% unused) ❌
- navigation.css: 85% used (15% unused) ✅
```

#### Step 2.2: Advanced Coverage with User Interactions

**Using Playwright MCP:**
```bash
Use tool: run_test
Arguments: {
  "script": `
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    
    // Start CSS coverage
    await page.coverage.startCSSCoverage();
    
    // Navigate and wait
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Simulate comprehensive user interactions
    const interactions = [
      // Navigation
      () => page.click('[data-testid="menu-button"]'),
      () => page.waitForSelector('.menu.open'),
      () => page.click('[data-testid="close-menu"]'),
      
      // Forms
      () => page.fill('input[type="email"]', 'test@example.com'),
      () => page.focus('input[type="email"]'),
      () => page.blur('input[type="email"]'),
      
      // Hover effects
      () => page.hover('.service-card'),
      () => page.hover('.pricing-card'),
      
      // Modals
      () => page.click('[data-modal-trigger]'),
      () => page.waitForSelector('.modal.visible'),
      () => page.click('[data-modal-close]'),
      
      // Scroll interactions
      () => page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)),
      () => page.waitForTimeout(1000),
      () => page.evaluate(() => window.scrollTo(0, 0)),
    ];
    
    for (const interaction of interactions) {
      try {
        await interaction();
        await page.waitForTimeout(300);
      } catch (e) {
        console.warn('Interaction failed:', e.message);
      }
    }
    
    // Get coverage report
    const coverage = await page.coverage.stopCSSCoverage();
    
    // Calculate metrics
    const report = coverage.map(entry => {
      const totalBytes = entry.text.length;
      const usedBytes = entry.ranges.reduce(
        (sum, range) => sum + (range.end - range.start),
        0
      );
      return {
        url: entry.url,
        totalBytes,
        usedBytes,
        unusedBytes: totalBytes - usedBytes,
        usagePercentage: Math.round((usedBytes / totalBytes) * 100)
      };
    });
    
    await browser.close();
    return report;
  `,
  "timeout": 60000
}
```

**Expected Output:**
```json
[
  {
    "url": "http://localhost:3000/css/main.css",
    "totalBytes": 65432,
    "usedBytes": 42531,
    "unusedBytes": 22901,
    "usagePercentage": 65
  },
  {
    "url": "http://localhost:3000/css/cards.css",
    "totalBytes": 124567,
    "usedBytes": 68512,
    "unusedBytes": 56055,
    "usagePercentage": 55
  }
]
```

#### Step 2.3: Font Loading Performance Analysis

**Using Chrome DevTools MCP:**
```bash
# Analyze font loading with detailed script
Use tool: evaluate_script
Arguments: {
  "script": `
    const fontAnalysis = {
      webFonts: [],
      preloadedFonts: [],
      loadingMetrics: {}
    };
    
    // Check @font-face declarations
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules).forEach(rule => {
          if (rule.constructor.name === 'CSSFontFaceRule') {
            fontAnalysis.webFonts.push({
              family: rule.style.fontFamily.replace(/['"]/g, ''),
              display: rule.style.fontDisplay || 'auto',
              weight: rule.style.fontWeight || 'normal',
              style: rule.style.fontStyle || 'normal',
              src: rule.style.src
            });
          }
        });
      } catch (e) {
        console.warn('Cannot access stylesheet:', e);
      }
    });
    
    // Check font preloads
    const preloads = document.querySelectorAll('link[rel="preload"][as="font"]');
    fontAnalysis.preloadedFonts = Array.from(preloads).map(link => ({
      href: link.href,
      crossorigin: link.crossOrigin,
      type: link.type
    }));
    
    // Font loading timing from Resource Timing API
    const fontResources = performance
      .getEntriesByType('resource')
      .filter(r => r.name.includes('.woff') || r.name.includes('.ttf'));
    
    fontAnalysis.loadingMetrics = fontResources.map(r => ({
      name: r.name.split('/').pop(),
      duration: Math.round(r.duration),
      transferSize: r.transferSize,
      startTime: Math.round(r.startTime),
      responseEnd: Math.round(r.responseEnd)
    }));
    
    // Calculate total font loading time
    fontAnalysis.totalLoadTime = fontResources.length > 0
      ? Math.max(...fontResources.map(r => r.responseEnd))
      : 0;
    
    return fontAnalysis;
  `
}
```

**Expected Output:**
```json
{
  "webFonts": [
    {
      "family": "Orbitron",
      "display": "swap",
      "weight": "400",
      "style": "normal",
      "src": "url('./fonts/Orbitron-Regular-subset.woff2') format('woff2')"
    }
  ],
  "preloadedFonts": [
    {
      "href": "http://localhost:3000/fonts/Orbitron-Regular-subset.woff2",
      "crossorigin": "anonymous",
      "type": "font/woff2"
    }
  ],
  "loadingMetrics": [
    {
      "name": "Orbitron-Regular-subset.woff2",
      "duration": 85,
      "transferSize": 45234,
      "startTime": 150,
      "responseEnd": 235
    }
  ],
  "totalLoadTime": 650
}
```

#### Step 2.4: Network Request Analysis

**Using Chrome DevTools MCP:**
```bash
# Get all CSS and font network requests
Use tool: list_network_requests
Arguments: {
  "filter": {
    "resourceType": ["stylesheet", "font"]
  }
}
```

**Expected Output:**
```json
[
  {
    "url": "http://localhost:3000/css/main.css",
    "method": "GET",
    "status": 200,
    "size": 65432,
    "timing": {
      "startTime": 50,
      "responseEnd": 180
    },
    "cacheControl": "public, max-age=31536000"
  },
  {
    "url": "http://localhost:3000/fonts/Orbitron-Regular-subset.woff2",
    "method": "GET",
    "status": 200,
    "size": 45234,
    "timing": {
      "startTime": 150,
      "responseEnd": 235
    },
    "cacheControl": "public, max-age=31536000"
  }
]
```

**Analysis:**
- ✅ Font loaded at 150ms (good - indicates preloading)
- ⚠️ CSS loaded at 50ms but blocks rendering
- ✅ Proper cache headers (1-year cache)
- ❌ No compression visible (check server config)

### 7.3 Phase 3: Code Quality Assessment

**🎯 Objective:** Identify duplicates, conflicts, and quality issues

**Duration:** 2-4 hours

#### Step 3.1: Duplicate Detection

**Using Filesystem MCP:**
```bash
# Find duplicate CSS class definitions
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "^\\.[a-zA-Z][a-zA-Z0-9-_]*\\s*\\{",
  "include_line_numbers": true,
  "include_context": 0
}
```

**Manual Alternative:**
```bash
# Extract all class definitions with line numbers
grep -n "^\.[a-zA-Z]" css/**/*.css > class-definitions.txt

# Find duplicates
awk -F: '{print $2}' class-definitions.txt | sort | uniq -d > duplicates.txt

# Show context for duplicates
while read class; do
  echo "=== $class ==="
  grep -n "$class" class-definitions.txt
done < duplicates.txt
```

**Search for Specific Duplicate Patterns:**
```bash
# Duplicate color definitions
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "color:\\s*#[0-9a-fA-F]{6}",
  "group_by_file": true
}

# Duplicate font-family declarations
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "font-family:",
  "include_context": 1
}

# Duplicate box-shadow/gradient patterns
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "(box-shadow|background.*gradient)",
  "include_line_numbers": true
}
```

**Document Findings:**
```markdown
## Duplicate Styles Found:

### 1. Exact Duplicate Selectors
- `.pricing-card.pricing-card--magenta` (lines 357, 361 in cards.css)
  - Action: Remove line 357, keep 361
  
### 2. Repeated Effects (38 instances)
- Hover effects with same pattern across color variants
  - Pattern: `border-color` + `box-shadow` for each accent color
  - Action: Create mixin or use CSS variables with data attributes

### 3. Hardcoded Values
- `font-family: 'Orbitron'` appears 23 times
- `font-family: 'Rajdhani'` appears 20 times
  - Action: Create CSS variables `--font-heading`, `--font-body`

### 4. Repeated Gradients (12 instances)
- Similar gradient patterns with slight variations
  - Action: Parameterize with CSS variables
```

#### Step 3.2: Specificity Analysis

**Using Chrome DevTools MCP:**
```bash
# Analyze CSS specificity and conflicts
Use tool: evaluate_script
Arguments: {
  "script": `
    function calculateSpecificity(selector) {
      // Specificity calculation: [inline, IDs, classes/attrs/pseudo, elements]
      let specificity = [0, 0, 0, 0];
      
      // Count IDs
      specificity[1] = (selector.match(/#[\\w-]+/g) || []).length;
      
      // Count classes, attributes, pseudo-classes
      specificity[2] = (selector.match(/\\.[\\w-]+|\\[[^\\]]+\\]|:[\\w-]+(?!:)/g) || []).length;
      
      // Count elements and pseudo-elements
      specificity[3] = (selector.match(/^[\\w-]+|\\s[\\w-]+|::[\\w-]+/g) || []).length;
      
      return specificity.join('');
    }
    
    const sheets = Array.from(document.styleSheets);
    const specificityReport = [];
    const conflicts = [];
    
    sheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules);
        rules.forEach(rule => {
          if (rule.selectorText) {
            const spec = calculateSpecificity(rule.selectorText);
            specificityReport.push({
              selector: rule.selectorText,
              specificity: spec,
              sheet: sheet.href || 'inline',
              hasImportant: rule.style.cssText.includes('!important')
            });
          }
        });
      } catch (e) {
        console.warn('Cannot access stylesheet:', sheet.href, e.message);
      }
    });
    
    // Find high specificity selectors (potential conflicts)
    const highSpecificity = specificityReport
      .filter(r => parseInt(r.specificity) > 30 || r.hasImportant)
      .sort((a, b) => parseInt(b.specificity) - parseInt(a.specificity));
    
    // Group by selector to find conflicts
    const selectorGroups = {};
    specificityReport.forEach(r => {
      if (!selectorGroups[r.selector]) {
        selectorGroups[r.selector] = [];
      }
      selectorGroups[r.selector].push(r);
    });
    
    // Find selectors defined multiple times
    Object.entries(selectorGroups).forEach(([selector, rules]) => {
      if (rules.length > 1) {
        conflicts.push({
          selector,
          count: rules.length,
          locations: rules.map(r => r.sheet)
        });
      }
    });
    
    return {
      totalSelectors: specificityReport.length,
      highSpecificity: highSpecificity.slice(0, 20),
      conflicts: conflicts.slice(0, 10),
      importantCount: specificityReport.filter(r => r.hasImportant).length
    };
  `
}
```

**Expected Output:**
```json
{
  "totalSelectors": 847,
  "highSpecificity": [
    {
      "selector": "div.container .content .card .header .title",
      "specificity": "0014",
      "sheet": "http://localhost:3000/css/main.css",
      "hasImportant": false
    }
  ],
  "conflicts": [
    {
      "selector": ".pricing-card.pricing-card--magenta",
      "count": 2,
      "locations": ["cards.css", "cards.css"]
    }
  ],
  "importantCount": 12
}
```

**Analysis & Recommendations:**
```markdown
## Specificity Issues:

### High Specificity Selectors (>30)
1. `div.container .content .card .header .title` (0014)
   - Issue: Too specific, hard to override
   - Recommendation: Use BEM, reduce to `.card__title`

### Conflicts
1. `.pricing-card.pricing-card--magenta` defined twice
   - Issue: Second definition overwrites first
   - Recommendation: Remove duplicate

### !important Usage
- Found 12 instances of `!important`
- Recommendation: Refactor to use proper specificity
```

#### Step 3.3: Font Declaration Audit

**Using Filesystem MCP:**
```bash
# Find all @font-face declarations
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "@font-face",
  "include_context": 15,
  "include_line_numbers": true
}

# Find font-display usage
Use tool: search_files
Arguments: {
  "path": "./css",
  "pattern": "**/*.css",
  "content_pattern": "font-display:",
  "include_context": 3
}
```

**Manual Alternative:**
```bash
# Extract all @font-face blocks
awk '/@font-face/,/}/' css/**/*.css > font-faces.txt

# Check font-display values
grep -A 10 "@font-face" css/**/*.css | grep "font-display"
```

**Document Findings:**
```markdown
## Font Declaration Audit:

### @font-face Declarations Found: 7

1. Orbitron Regular (400)
   - Source: Orbitron-Regular-subset.woff2
   - font-display: swap ✅
   - Preloaded: ✅

2. Orbitron Bold (700)
   - Source: Orbitron-Bold-subset.woff2
   - font-display: swap ✅
   - Preloaded: ❌ (consider for headings)

3. Orbitron Black (900)
   - Source: Orbitron-Black-subset.woff2
   - font-display: optional ✅ (decorative)
   - Preloaded: ❌

4. Rajdhani Light (300)
   - Source: Rajdhani-Light-subset.woff2
   - font-display: swap ✅
   - Preloaded: ❌

5. Rajdhani Regular (400)
   - Source: Rajdhani-Regular-subset.woff2
   - font-display: swap ✅
   - Preloaded: ✅

6. Rajdhani SemiBold (600)
   - Source: Rajdhani-SemiBold-subset.woff2
   - font-display: swap ✅
   - Preloaded: ❌

7. Rajdhani Bold (700)
   - Source: Rajdhani-Bold-subset.woff2
   - font-display: optional ✅
   - Preloaded: ❌

### Issues:
- ❌ 17 font files exist but not declared (waste)
- ⚠️ Only 2 fonts preloaded (consider preloading Orbitron Bold for headings)
- ✅ Good: All use WOFF2 format
- ✅ Good: All use subset versions
- ✅ Good: Proper font-display strategy
```

### 7.4 Phase 4: Research & Best Practices

**🎯 Objective:** Gather latest standards and optimization techniques

**Duration:** 1-2 hours

#### Step 4.1: Documentation Research

**Using Context7 MCP:**
```bash
# Research latest CSS optimization techniques
Use tool: search_docs
Arguments: {
  "query": "CSS performance optimization 2024",
  "source": "MDN",
  "limit": 10
}

# Research font-display strategies
Use tool: search_docs
Arguments: {
  "query": "font-display swap vs optional performance",
  "source": "web.dev"
}

# Get CSS containment examples
Use tool: get_examples
Arguments: {
  "topic": "CSS contain property usage",
  "source": "MDN"
}
```

#### Step 4.2: Tool Discovery

**Using Brave Search MCP:**
```bash
# Find CSS optimization tools
Use tool: web_search
Arguments: {
  "query": "best CSS unused styles detection tools 2024",
  "limit": 10
}

# Research PurgeCSS alternatives
Use tool: web_search
Arguments: {
  "query": "PurgeCSS vs UnCSS vs PurifyCSS comparison",
  "limit": 5
}

# Font subsetting tools
Use tool: web_search
Arguments: {
  "query": "WOFF2 font subsetting tools command line",
  "limit": 5
}
```

#### Step 4.3: External Resource Scraping

**Using Firecrawl MCP:**
```bash
# Scrape CSS optimization guide
Use tool: scrape
Arguments: {
  "url": "https://web.dev/fast/#optimize-your-css",
  "formats": ["markdown"]
}

# Scrape font loading guide
Use tool: scrape
Arguments: {
  "url": "https://web.dev/font-best-practices/",
  "formats": ["markdown"]
}

# Crawl for comprehensive font optimization resources
Use tool: crawl
Arguments: {
  "url": "https://css-tricks.com/font-display-masses/",
  "max_pages": 3,
  "follow_links": true
}
```

**Document Findings:**
```markdown
## Research Findings:

### Latest CSS Optimization Techniques (2024)
1. CSS Containment (contain property) - reduces layout/paint scope
2. CSS Layers (@layer) - better cascade management
3. Container Queries - responsive without media queries
4. CSS Nesting - native (no preprocessor needed)

### Font Loading Best Practices
1. font-display: swap for critical text (LCP elements)
2. font-display: optional for decorative fonts
3. Preload only 1-2 critical fonts (max)
4. Font metric adjustment with size-adjust to reduce CLS
5. Variable fonts to reduce file count

### Recommended Tools
1. **PurgeCSS** - Most popular, best documentation
2. **UnCSS** - Good for static sites
3. **CSS Nano** - Minification + optimization
4. **Critical** - Extract critical CSS
5. **Fonttools** - Subsetting and optimization
```

### 7.5 Phase 5: Strategic Planning

**🎯 Objective:** Create optimization strategy and roadmap

**Duration:** 2-3 hours

#### Step 5.1: Problem Analysis

**Using Sequential Thinking MCP:**
```bash
# Analyze CSS optimization challenge
Use tool: analyze_problem
Arguments: {
  "problem": "CSS bundle is 245KB with 40% unused styles, cards.css is 1,470 lines, 17 unused font files, no minification enabled",
  "context": "Vite-based project with 50+ components, self-hosted fonts, responsive design across 3 breakpoints",
  "constraints": [
    "Must maintain visual consistency",
    "Cannot break existing functionality",
    "Need to improve Core Web Vitals (LCP >4s, CLS >0.25)",
    "Limited to 7-week timeline",
    "Team has moderate CSS expertise"
  ],
  "goals": [
    "Reduce CSS bundle by 50%",
    "Achieve LCP <2.5s",
    "Achieve CLS <0.1",
    "Improve maintainability"
  ]
}
```

**Expected Output:**
```markdown
## Problem Analysis:

### Root Causes Identified:
1. **Lack of modularization** - Large monolithic files
2. **No build optimization** - Minification/purging disabled
3. **Font asset waste** - 17 unused files (71% waste)
4. **Duplicate code** - Repeated patterns not abstracted
5. **No performance strategy** - No critical CSS, no preloading

### Impact Assessment:
- **Performance:** High (directly affects Core Web Vitals)
- **Maintainability:** Medium (hard to navigate large files)
- **Development velocity:** Low (developers avoid editing large files)

### Risk Factors:
- Visual regressions from CSS changes
- Breaking dynamic classes added by JavaScript
- Time required for comprehensive testing
```

#### Step 5.2: Strategy Generation

**Using Sequential Thinking MCP:**
```bash
# Generate optimization strategy
Use tool: generate_strategy
Arguments: {
  "goal": "Reduce CSS bundle size by 50% and improve Core Web Vitals within 7 weeks",
  "considerations": [
    "Unused style removal",
    "Modular architecture implementation",
    "Font optimization",
    "Build configuration",
    "Performance optimization",
    "Developer experience"
  ],
  "constraints": [
    "7-week timeline",
    "Maintain visual consistency",
    "No breaking changes"
  ]
}
```

**Expected Output:**
```markdown
## Optimization Strategy:

### Phase-Based Approach (7 Weeks):

**Week 1: Preparation & Analysis**
- Run comprehensive audit (this workflow)
- Document current state
- Set up testing infrastructure
- Create backup and rollback plan

**Week 2: Font Optimization**
- Delete 17 unused font files
- Implement CSS variables for font-family
- Verify font-display strategies
- Optimize preloading

**Week 3: CSS Deduplication**
- Fix duplicate selectors
- Abstract repeated patterns to mixins/variables
- Consolidate similar effects

**Week 4: Modularization**
- Split cards.css (1,470 lines) into components
- Reorganize responsive.css
- Implement logical file structure

**Week 5: Unused CSS Removal**
- Configure and enable PurgeCSS
- Test across all pages/interactions
- Adjust safelist for dynamic classes

**Week 6: Build Optimization**
- Enable CSS minification
- Configure code splitting
- Implement critical CSS extraction
- Set up compression

**Week 7: Testing & Deployment**
- Visual regression testing
- Performance benchmarking
- Staged rollout
- Monitor Core Web Vitals

### Success Metrics:
- CSS bundle: 245KB → <120KB (51% reduction)
- Font files: 24 → 7 (71% reduction)
- LCP: 4s → <2.5s (38% improvement)
- CLS: 0.25 → <0.1 (60% improvement)
- Unused CSS: 40% → <5%
```

#### Step 5.3: Architecture Evaluation

**Using Sequential Thinking MCP:**
```bash
# Evaluate CSS architecture options
Use tool: evaluate_options
Arguments: {
  "options": [
    {
      "name": "CSS Modules with component-scoped styles",
      "pros": ["Automatic scoping", "Dead code elimination", "Type safety with TypeScript"],
      "cons": ["Requires refactoring components", "Learning curve", "Build complexity"]
    },
    {
      "name": "BEM methodology with modular files",
      "pros": ["Clear naming", "Maintainable", "Framework agnostic", "No refactoring needed"],
      "cons": ["Verbose class names", "Manual enforcement", "No automatic scoping"]
    },
    {
      "name": "Utility-first with Tailwind CSS",
      "pros": ["Rapid development", "Small bundle when purged", "Consistent design system"],
      "cons": ["Major refactoring needed", "HTML verbosity", "Learning curve"]
    },
    {
      "name": "Hybrid: BEM + Utility Classes",
      "pros": ["Best of both worlds", "Gradual migration", "Flexible"],
      "cons": ["Need conventions", "Potential inconsistency"]
    }
  ],
  "criteria": [
    "maintainability",
    "performance",
    "developer_experience",
    "bundle_size",
    "migration_effort",
    "team_familiarity"
  ],
  "weights": {
    "migration_effort": 2,
    "maintainability": 1.5,
    "performance": 1.5
  }
}
```

**Expected Output:**
```markdown
## Architecture Evaluation:

### Recommendation: Hybrid BEM + Utility Classes

**Scoring:**
1. Hybrid BEM + Utilities: 8.5/10
2. CSS Modules: 7.2/10
3. BEM only: 7.0/10
4. Tailwind CSS: 6.5/10

**Rationale:**
- **Low migration effort** - Can enhance existing BEM structure
- **Maintains current approach** - Team already familiar with BEM
- **Performance benefits** - Utilities reduce duplication
- **Flexibility** - Can adopt gradually
- **Best practices** - Aligns with modern standards

**Implementation Plan:**
1. Keep existing BEM structure
2. Add utility classes for spacing, display, typography
3. Use CSS variables for consistent values
4. Split large files into modules
5. Enable PurgeCSS to remove unused utilities
```

### 7.6 Phase 6: Implementation & Verification

**🎯 Objective:** Execute optimizations and validate results

**Duration:** Ongoing (tracked in Phase 7 roadmap)

#### Step 6.1: Baseline Performance Capture

**Using Chrome DevTools MCP:**
```bash
# Capture baseline performance
Use tool: performance_start_trace
Arguments: {
  "categories": ["loading", "rendering", "painting"]
}

Use tool: navigate_page
Arguments: {"url": "http://localhost:3000"}

Use tool: wait_for_load_state
Arguments: {"state": "networkidle"}

Use tool: performance_stop_trace
Arguments: {
  "analyze": true,
  "export_path": "./audit-reports/baseline-performance.json"
}

# Take baseline screenshot
Use tool: take_screenshot
Arguments: {
  "path": "./audit-reports/screenshots/baseline-homepage.png",
  "fullPage": true
}
```

#### Step 6.2: Apply Optimizations

(Detailed implementation steps provided in Phase 7: Implementation Roadmap)

#### Step 6.3: Post-Optimization Verification

**Using Chrome DevTools MCP:**
```bash
# Capture post-optimization performance
Use tool: performance_start_trace
Arguments: {
  "categories": ["loading", "rendering", "painting"]
}

Use tool: navigate_page
Arguments: {"url": "http://localhost:3000"}

Use tool: wait_for_load_state
Arguments: {"state": "networkidle"}

Use tool: performance_stop_trace
Arguments: {
  "analyze": true,
  "export_path": "./audit-reports/optimized-performance.json"
}

# Take comparison screenshot
Use tool: take_screenshot
Arguments: {
  "path": "./audit-reports/screenshots/optimized-homepage.png",
  "fullPage": true
}
```

#### Step 6.4: Visual Regression Testing

**Using Playwright MCP:**
```bash
# Visual diff comparison
Use tool: visual_diff
Arguments: {
  "baseline": "./audit-reports/screenshots/baseline-homepage.png",
  "current": "./audit-reports/screenshots/optimized-homepage.png",
  "threshold": 0.05,
  "output_path": "./audit-reports/visual-diff.png"
}
```

**Manual Alternative:**
```bash
# Using Percy, BackstopJS, or manual comparison
npm run test:visual-regression
```

#### Step 6.5: Performance Comparison

**Using Node.js Script:**
```javascript
// compare-performance.js
const fs = require('fs');

const baseline = JSON.parse(fs.readFileSync('./audit-reports/baseline-performance.json'));
const optimized = JSON.parse(fs.readFileSync('./audit-reports/optimized-performance.json'));

const metrics = {
  'LCP': {
    before: baseline.lcp,
    after: optimized.lcp,
    target: 2500,
    unit: 'ms'
  },
  'CLS': {
    before: baseline.cls,
    after: optimized.cls,
    target: 0.1,
    unit: ''
  },
  'CSS Bundle Size': {
    before: baseline.cssSize,
    after: optimized.cssSize,
    target: 100,
    unit: 'KB'
  },
  'Font Files': {
    before: baseline.fontCount,
    after: optimized.fontCount,
    target: 10,
    unit: 'files'
  }
};

console.log('Performance Comparison Report');
console.log('==============================\n');

Object.entries(metrics).forEach(([metric, data]) => {
  const improvement = ((data.before - data.after) / data.before * 100).toFixed(1);
  const targetMet = data.unit === 'ms' || data.unit === 'KB'
    ? data.after < data.target
    : data.after <= data.target;
  
  console.log(`${metric}:`);
  console.log(`  Before: ${data.before}${data.unit}`);
  console.log(`  After:  ${data.after}${data.unit}`);
  console.log(`  Improvement: ${improvement}%`);
  console.log(`  Target: ${data.target}${data.unit} ${targetMet ? '✅' : '❌'}`);
  console.log('');
});
```

**Expected Output:**
```
Performance Comparison Report
==============================

LCP:
  Before: 4200ms
  After:  2300ms
  Improvement: 45.2%
  Target: 2500ms ✅

CLS:
  Before: 0.25
  After:  0.08
  Improvement: 68.0%
  Target: 0.1 ✅

CSS Bundle Size:
  Before: 245KB
  After:  115KB
  Improvement: 53.1%
  Target: 100KB ⚠️ (close)

Font Files:
  Before: 24 files
  After:  7 files
  Improvement: 70.8%
  Target: 10 files ✅
```

### 7.7 Phase 7: Continuous Monitoring

**🎯 Objective:** Maintain optimization gains over time

**Duration:** Ongoing

#### Step 7.1: Set Up Performance Budget

**Create performance-budget.json:**
```json
{
  "budget": [
    {
      "resourceType": "stylesheet",
      "budget": 100
    },
    {
      "resourceType": "font",
      "budget": 200
    },
    {
      "resourceType": "total",
      "budget": 1500
    }
  ],
  "timings": [
    {
      "metric": "first-contentful-paint",
      "budget": 2000
    },
    {
      "metric": "largest-contentful-paint",
      "budget": 2500
    },
    {
      "metric": "cumulative-layout-shift",
      "budget": 0.1
    },
    {
      "metric": "total-blocking-time",
      "budget": 300
    }
  ]
}
```

#### Step 7.2: Implement CI/CD Checks

**GitHub Actions Example:**
```yaml
# .github/workflows/performance-check.yml
name: Performance Check

on: [pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Check bundle sizes
        run: npm run check:bundle-size
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --upload.target=temporary-public-storage
      
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            // Post performance results as PR comment
```

#### Step 7.3: Regular Audits

**Schedule quarterly audits:**
```bash
# Create audit reminder
# Run every 3 months:
# 1. Re-run CSS coverage analysis
# 2. Check for new unused styles
# 3. Verify font file inventory
# 4. Update performance baseline
# 5. Review new best practices
```

---

*This concludes the 7-Phase Audit Workflow. Continue to Part III for detailed optimization strategies.*

# The Ultimate CSS & Font Optimization Master Guide - Part 2

## Part III: Optimization Strategies (Continued)

---

## 8. Automated Discovery & Inventory

### 8.1 Automated CSS Inventory Script

Create a comprehensive Node.js script to inventory all CSS assets:

```javascript
// scripts/css-inventory.js
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function analyzeCSSFiles() {
  console.log('🔍 Starting CSS Inventory Analysis...\n');
  
  // Find all CSS files
  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  });
  
  const inventory = {
    totalFiles: cssFiles.length,
    files: [],
    totalLines: 0,
    totalSize: 0,
    largestFiles: [],
    statistics: {}
  };
  
  // Analyze each file
  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').length;
    const size = fs.statSync(file).size;
    const modified = fs.statSync(file).mtime;
    
    // Count various CSS features
    const classCount = (content.match(/\.[a-zA-Z][a-zA-Z0-9-_]*/g) || []).length;
    const idCount = (content.match(/#[a-zA-Z][a-zA-Z0-9-_]*/g) || []).length;
    const mediaQueryCount = (content.match(/@media/g) || []).length;
    const variableCount = (content.match(/--[a-zA-Z][a-zA-Z0-9-]*:/g) || []).length;
    const importantCount = (content.match(/!important/g) || []).length;
    
    const fileInfo = {
      path: file,
      lines,
      size,
      sizeKB: (size / 1024).toFixed(2),
      modified: modified.toISOString().split('T')[0],
      classCount,
      idCount,
      mediaQueryCount,
      variableCount,
      importantCount,
      concerns: []
    };
    
    // Flag concerns
    if (lines > 500) fileInfo.concerns.push('LARGE_FILE');
    if (lines > 1000) fileInfo.concerns.push('VERY_LARGE_FILE');
    if (importantCount > 5) fileInfo.concerns.push('EXCESSIVE_IMPORTANT');
    if (idCount > 10) fileInfo.concerns.push('EXCESSIVE_IDS');
    
    inventory.files.push(fileInfo);
    inventory.totalLines += lines;
    inventory.totalSize += size;
  }
  
  // Sort by size
  inventory.files.sort((a, b) => b.size - a.size);
  inventory.largestFiles = inventory.files.slice(0, 10);
  
  // Calculate statistics
  inventory.statistics = {
    avgLinesPerFile: Math.round(inventory.totalLines / inventory.totalFiles),
    avgSizePerFile: (inventory.totalSize / inventory.totalFiles / 1024).toFixed(2) + ' KB',
    totalSizeKB: (inventory.totalSize / 1024).toFixed(2),
    filesOver500Lines: inventory.files.filter(f => f.lines > 500).length,
    filesOver1000Lines: inventory.files.filter(f => f.lines > 1000).length,
    totalConcerns: inventory.files.reduce((sum, f) => sum + f.concerns.length, 0)
  };
  
  // Write report
  fs.writeFileSync(
    'audit-reports/css-inventory.json',
    JSON.stringify(inventory, null, 2)
  );
  
  // Print summary
  console.log('📊 CSS Inventory Summary:');
  console.log(`Total files: ${inventory.totalFiles}`);
  console.log(`Total lines: ${inventory.totalLines.toLocaleString()}`);
  console.log(`Total size: ${inventory.statistics.totalSizeKB} KB`);
  console.log(`Avg lines/file: ${inventory.statistics.avgLinesPerFile}`);
  console.log(`Files >500 lines: ${inventory.statistics.filesOver500Lines}`);
  console.log(`Files >1000 lines: ${inventory.statistics.filesOver1000Lines}`);
  console.log(`\n⚠️  Total concerns: ${inventory.statistics.totalConcerns}`);
  
  console.log('\n📁 Largest files:');
  inventory.largestFiles.slice(0, 5).forEach((file, i) => {
    console.log(`${i + 1}. ${file.path}`);
    console.log(`   ${file.lines} lines, ${file.sizeKB} KB`);
    if (file.concerns.length > 0) {
      console.log(`   ⚠️  ${file.concerns.join(', ')}`);
    }
  });
  
  console.log('\n✅ Report saved to: audit-reports/css-inventory.json');
}

analyzeCSSFiles().catch(console.error);
```

**Usage:**
```bash
node scripts/css-inventory.js
```

### 8.2 Automated Font Inventory Script

```javascript
// scripts/font-inventory.js
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function analyzeFonts() {
  console.log('🔍 Starting Font Inventory Analysis...\n');
  
  // Find all font files
  const fontFiles = await glob('**/*.{woff,woff2,ttf,otf,eot}', {
    ignore: ['node_modules/**', 'dist/**']
  });
  
  // Find all @font-face declarations
  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**']
  });
  
  const fontFaces = [];
  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf-8');
    const matches = content.matchAll(/@font-face\s*{([^}]+)}/g);
    
    for (const match of matches) {
      const block = match[1];
      const family = block.match(/font-family:\s*['"]([^'"]+)['"]/)?.[1];
      const src = block.match(/url\(['"]?([^'"()]+)['"]?\)/)?.[1];
      const weight = block.match(/font-weight:\s*(\d+|normal|bold)/)?.[1];
      const style = block.match(/font-style:\s*(normal|italic|oblique)/)?.[1];
      const display = block.match(/font-display:\s*(auto|block|swap|fallback|optional)/)?.[1];
      
      if (family && src) {
        fontFaces.push({
          family,
          src: src.replace(/^\.\//, ''),
          weight: weight || 'normal',
          style: style || 'normal',
          display: display || 'auto',
          cssFile
        });
      }
    }
  }
  
  // Analyze font files
  const inventory = {
    totalFiles: fontFiles.length,
    declaredFonts: fontFaces.length,
    unusedFiles: [],
    usedFiles: [],
    filesByFormat: {},
    totalSize: 0
  };
  
  for (const fontFile of fontFiles) {
    const size = fs.statSync(fontFile).size;
    const ext = path.extname(fontFile).slice(1);
    const fileName = path.basename(fontFile);
    
    // Check if font is declared in CSS
    const isDeclared = fontFaces.some(ff => 
      ff.src.includes(fileName) || ff.src.includes(fontFile)
    );
    
    const fileInfo = {
      path: fontFile,
      fileName,
      size,
      sizeKB: (size / 1024).toFixed(2),
      format: ext,
      declared: isDeclared
    };
    
    if (isDeclared) {
      inventory.usedFiles.push(fileInfo);
    } else {
      inventory.unusedFiles.push(fileInfo);
    }
    
    inventory.totalSize += size;
    inventory.filesByFormat[ext] = (inventory.filesByFormat[ext] || 0) + 1;
  }
  
  // Calculate waste
  const unusedSize = inventory.unusedFiles.reduce((sum, f) => sum + f.size, 0);
  const wastePercentage = ((unusedSize / inventory.totalSize) * 100).toFixed(1);
  
  // Write report
  const report = {
    ...inventory,
    statistics: {
      totalSizeKB: (inventory.totalSize / 1024).toFixed(2),
      unusedFilesCount: inventory.unusedFiles.length,
      unusedSizeKB: (unusedSize / 1024).toFixed(2),
      wastePercentage,
      formatBreakdown: inventory.filesByFormat
    },
    fontFaceDeclarations: fontFaces
  };
  
  fs.writeFileSync(
    'audit-reports/font-inventory.json',
    JSON.stringify(report, null, 2)
  );
  
  // Print summary
  console.log('📊 Font Inventory Summary:');
  console.log(`Total font files: ${inventory.totalFiles}`);
  console.log(`Declared in CSS: ${inventory.declaredFonts}`);
  console.log(`Used files: ${inventory.usedFiles.length}`);
  console.log(`Unused files: ${inventory.unusedFiles.length} (${wastePercentage}% waste)`);
  console.log(`Total size: ${report.statistics.totalSizeKB} KB`);
  console.log(`Unused size: ${report.statistics.unusedSizeKB} KB`);
  
  console.log('\n📁 Format breakdown:');
  Object.entries(inventory.filesByFormat).forEach(([format, count]) => {
    console.log(`  ${format}: ${count} files`);
  });
  
  if (inventory.unusedFiles.length > 0) {
    console.log('\n❌ Unused font files (can be deleted):');
    inventory.unusedFiles.forEach(file => {
      console.log(`  - ${file.path} (${file.sizeKB} KB)`);
    });
  }
  
  console.log('\n✅ Font declarations found:');
  const familyGroups = {};
  fontFaces.forEach(ff => {
    if (!familyGroups[ff.family]) familyGroups[ff.family] = [];
    familyGroups[ff.family].push(`${ff.weight} ${ff.style} (${ff.display})`);
  });
  Object.entries(familyGroups).forEach(([family, variants]) => {
    console.log(`  ${family}:`);
    variants.forEach(v => console.log(`    - ${v}`));
  });
  
  console.log('\n✅ Report saved to: audit-reports/font-inventory.json');
}

analyzeFonts().catch(console.error);
```

**Usage:**
```bash
node scripts/font-inventory.js
```

---

## 9. Performance Profiling & Analysis

### 9.1 Lighthouse CI Integration

**Install Lighthouse CI:**
```bash
npm install -g @lhci/cli
```

**Configuration:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        onlyCategories: ['performance'],
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

**Run audit:**
```bash
# Start dev server
npm run dev &

# Run Lighthouse
lhci autorun

# Output will show performance scores and violations
```

### 9.2 Bundle Analysis Script

```javascript
// scripts/analyze-bundle.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { glob } = require('glob');

async function analyzeBundle() {
  console.log('📦 Analyzing CSS Bundle...\n');
  
  const cssFiles = await glob('dist/**/*.css');
  const report = {
    files: [],
    totalSize: 0,
    totalGzipped: 0,
    warnings: []
  };
  
  for (const file of cssFiles) {
    const content = fs.readFileSync(file);
    const size = content.length;
    
    // Gzip compress
    const gzipped = zlib.gzipSync(content);
    const gzippedSize = gzipped.length;
    
    const compression = ((1 - gzippedSize / size) * 100).toFixed(1);
    
    const fileInfo = {
      path: file.replace('dist/', ''),
      size,
      sizeKB: (size / 1024).toFixed(2),
      gzipped: gzippedSize,
      gzippedKB: (gzippedSize / 1024).toFixed(2),
      compression: `${compression}%`
    };
    
    // Check thresholds
    if (gzippedSize > 100 * 1024) {
      report.warnings.push({
        file: fileInfo.path,
        issue: 'LARGE_BUNDLE',
        message: `Gzipped size ${fileInfo.gzippedKB}KB exceeds 100KB target`
      });
    }
    
    report.files.push(fileInfo);
    report.totalSize += size;
    report.totalGzipped += gzippedSize;
  }
  
  report.totalSizeKB = (report.totalSize / 1024).toFixed(2);
  report.totalGzippedKB = (report.totalGzipped / 1024).toFixed(2);
  report.overallCompression = ((1 - report.totalGzipped / report.totalSize) * 100).toFixed(1);
  
  // Print report
  console.log('Bundle Analysis Results:');
  console.log('========================\n');
  
  report.files.forEach(file => {
    console.log(`📄 ${file.path}`);
    console.log(`   Size: ${file.sizeKB} KB`);
    console.log(`   Gzipped: ${file.gzippedKB} KB (${file.compression} compression)`);
    console.log('');
  });
  
  console.log('Overall:');
  console.log(`Total size: ${report.totalSizeKB} KB`);
  console.log(`Total gzipped: ${report.totalGzippedKB} KB`);
  console.log(`Compression: ${report.overallCompression}%`);
  
  if (report.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    report.warnings.forEach(w => {
      console.log(`  ${w.file}: ${w.message}`);
    });
  }
  
  // Budget check
  const budget = 100; // KB
  if (report.totalGzipped / 1024 > budget) {
    console.log(`\n❌ BUDGET EXCEEDED: ${report.totalGzippedKB}KB > ${budget}KB`);
    process.exit(1);
  } else {
    console.log(`\n✅ Within budget: ${report.totalGzippedKB}KB ≤ ${budget}KB`);
  }
  
  // Save report
  fs.writeFileSync(
    'audit-reports/bundle-analysis.json',
    JSON.stringify(report, null, 2)
  );
}

analyzeBundle().catch(console.error);
```

**Usage:**
```bash
npm run build
node scripts/analyze-bundle.js
```

---

## 10. Code Quality Assessment

### 10.1 CSS Linting with Stylelint

**Install Stylelint:**
```bash
npm install --save-dev stylelint stylelint-config-standard
```

**Configuration:**
```javascript
// .stylelintrc.js
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // Naming conventions
    'selector-class-pattern': [
      '^[a-z][a-z0-9-]*(__[a-z0-9-]+)?(--[a-z0-9-]+)*$',
      {
        message: 'Class names must follow BEM convention'
      }
    ],
    
    // Specificity
    'selector-max-id': 0,
    'selector-max-specificity': '0,3,0',
    'selector-max-compound-selectors': 3,
    'max-nesting-depth': 3,
    
    // Declaration order
    'declaration-block-no-duplicate-properties': true,
    'no-duplicate-selectors': true,
    
    // Performance
    'no-descending-specificity': true,
    
    // Best practices
    'font-family-no-missing-generic-family-keyword': true,
    'shorthand-property-no-redundant-values': true,
    
    // Disallow
    'declaration-no-important': [
      true,
      {
        severity: 'warning'
      }
    ]
  }
};
```

**Add to package.json:**
```json
{
  "scripts": {
    "lint:css": "stylelint '**/*.css' --fix",
    "lint:css:check": "stylelint '**/*.css'"
  }
}
```

**Run linting:**
```bash
npm run lint:css
```

### 10.2 Duplicate Class Detection Script

```javascript
// scripts/find-duplicates.js
const fs = require('fs');
const { glob } = require('glob');

async function findDuplicates() {
  console.log('🔍 Finding Duplicate CSS Classes...\n');
  
  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**']
  });
  
  const classDefinitions = new Map(); // className -> [locations]
  
  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Match class selectors
      const matches = line.matchAll(/^\s*\.([a-zA-Z][a-zA-Z0-9-_]*(?:__[a-zA-Z0-9-_]+)?(?:--[a-zA-Z0-9-_]+)?)\s*[,{]/g);
      
      for (const match of matches) {
        const className = match[1];
        const location = `${file}:${index + 1}`;
        
        if (!classDefinitions.has(className)) {
          classDefinitions.set(className, []);
        }
        classDefinitions.get(className).push(location);
      }
    });
  }
  
  // Find duplicates
  const duplicates = [];
  classDefinitions.forEach((locations, className) => {
    if (locations.length > 1) {
      duplicates.push({ className, locations });
    }
  });
  
  // Sort by frequency
  duplicates.sort((a, b) => b.locations.length - a.locations.length);
  
  // Print report
  console.log(`Found ${duplicates.length} duplicate class definitions:\n`);
  
  duplicates.forEach(dup => {
    console.log(`❌ .${dup.className} (defined ${dup.locations.length} times)`);
    dup.locations.forEach(loc => {
      console.log(`   ${loc}`);
    });
    console.log('');
  });
  
  // Save report
  fs.writeFileSync(
    'audit-reports/duplicate-classes.json',
    JSON.stringify(duplicates, null, 2)
  );
  
  console.log(`✅ Report saved to: audit-reports/duplicate-classes.json`);
  
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Action required: Review and consolidate ${duplicates.length} duplicate classes`);
    process.exit(1);
  }
}

findDuplicates().catch(console.error);
```

### 10.3 Hardcoded Value Detection

```javascript
// scripts/find-hardcoded-values.js
const fs = require('fs');
const { glob } = require('glob');

async function findHardcodedValues() {
  console.log('🔍 Finding Hardcoded Values...\n');
  
  const cssFiles = await glob('**/*.css', {
    ignore: ['node_modules/**', 'dist/**']
  });
  
  const patterns = {
    colors: {
      regex: /(color|background|border-color|fill|stroke):\s*#[0-9a-fA-F]{3,6}/g,
      replacement: 'Use CSS variable (e.g., var(--color-primary))'
    },
    fonts: {
      regex: /font-family:\s*['"][^'"]*['"]/g,
      replacement: 'Use CSS variable (e.g., var(--font-heading))'
    },
    spacing: {
      regex: /(margin|padding):\s*\d+px/g,
      replacement: 'Use spacing variable (e.g., var(--space-4))'
    },
    borderRadius: {
      regex: /border-radius:\s*\d+px/g,
      replacement: 'Use radius variable (e.g., var(--radius-md))'
    }
  };
  
  const findings = {};
  
  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      lines.forEach((line, index) => {
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
  
  console.log(`\n\n📊 Total hardcoded values: ${totalFindings}`);
  console.log('💡 Recommendation: Replace with CSS variables for better maintainability');
  
  // Save report
  fs.writeFileSync(
    'audit-reports/hardcoded-values.json',
    JSON.stringify(findings, null, 2)
  );
  
  console.log('\n✅ Report saved to: audit-reports/hardcoded-values.json');
}

findHardcodedValues().catch(console.error);
```

---

## Part III: Optimization Strategies

---

## 11. Font Optimization Masterclass

### 11.1 Understanding FOIT and FOUT

**FOIT (Flash of Invisible Text):**
- Text remains invisible while custom font loads
- Duration: Up to 3 seconds with `font-display: block`
- **Impact:** Poor user experience, high bounce rate, accessibility issues

**FOUT (Flash of Unstyled Text):**
- Fallback font displays, then swaps to custom font
- **Impact:** Layout shift (CLS), visual jarring

**Goal:** Eliminate FOIT, minimize FOUT impact

### 11.2 Font-Display Strategy

#### The `font-display` Descriptor

The `font-display` property in `@font-face` is **the most important tool** for controlling font loading behavior.

**Comparison Table:**

| Value | Block Period | Swap Period | Behavior | Use Case |
|-------|-------------|-------------|----------|----------|
| **swap** | ~0ms | Infinite | Show fallback immediately, swap when loaded | **Recommended** for critical text (body, headings) |
| **optional** | ~100ms | 0ms | Browser decides based on connection speed | Decorative fonts, non-critical |
| **fallback** | ~100ms | ~3s | Brief FOIT, then fallback, permanent if late | Non-essential fonts |
| **block** | ~3s | Infinite | Hide text up to 3s (FOIT) | **Avoid** unless absolutely necessary |
| **auto** | Browser default | Browser default | Typically behaves like `block` | **Avoid** - be explicit |

#### Implementation Examples

**Critical Text (Body, Headings):**
```css
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Regular-subset.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Show fallback immediately */
}

@font-face {
  font-family: 'Rajdhani';
  src: url('./fonts/Rajdhani-Regular-subset.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Show fallback immediately */
}
```

**Decorative/Non-Critical Fonts:**
```css
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Black-subset.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: optional; /* Only load on fast connections */
}
```

### 11.3 Font Preloading

**When to Preload:**
- ✅ Critical fonts for LCP elements (hero text, main heading)
- ✅ Maximum 1-2 fonts (avoid network congestion)
- ❌ All font variants (defeats the purpose)

**Correct Preloading Syntax:**
```html
<!-- CORRECT: All required attributes -->
<link rel="preload" 
      href="./fonts/Orbitron-Regular-subset.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin="anonymous">

<link rel="preload" 
      href="./fonts/Rajdhani-Regular-subset.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin="anonymous">
```

**Common Mistakes:**
```html
<!-- WRONG: Missing crossorigin -->
<link rel="preload" href="./fonts/font.woff2" as="font">

<!-- WRONG: Missing type -->
<link rel="preload" href="./fonts/font.woff2" as="font" crossorigin>

<!-- WRONG: Preloading too many fonts -->
<link rel="preload" href="./fonts/font-regular.woff2" as="font" crossorigin>
<link rel="preload" href="./fonts/font-bold.woff2" as="font" crossorigin>
<link rel="preload" href="./fonts/font-black.woff2" as="font" crossorigin>
<!-- ... 5 more preloads ... -->
```

**Why `crossorigin` is Required:**
Even for same-origin fonts, the browser fetches fonts using anonymous CORS mode. Without `crossorigin`, the preload won't match the actual font request, resulting in a double download.

### 11.4 Advanced: Font Metric Matching (CLS Elimination)

**Problem:** When a custom font loads, it has different metrics (width, height, line-height) than the fallback, causing layout shift.

**Solution:** Adjust the fallback font's metrics to match the custom font using CSS Font descriptors.

#### Step 1: Measure Font Metrics

Use a tool like [Fallback Font Generator](https://screenspan.net/fallback) or manually calculate:

1. Load your custom font and fallback side by side
2. Measure x-height ratio
3. Calculate adjustments needed

#### Step 2: Create Metric-Matched Fallback

```css
/* Custom font (normal declaration) */
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Regular-subset.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Engineered fallback font */
@font-face {
  font-family: 'Orbitron-Fallback';
  src: local('Arial'); /* Use system font */
  
  /* Adjust metrics to match Orbitron */
  size-adjust: 105%;      /* Scale overall size */
  ascent-override: 95%;   /* Adjust top of letters */
  descent-override: 20%;  /* Adjust bottom of letters */
  line-gap-override: 0%;  /* Adjust line spacing */
}

/* Usage: Fallback font appears first in stack during load */
body {
  font-family: 'Orbitron', 'Orbitron-Fallback', sans-serif;
}
```

**Result:** When Orbitron loads and swaps in, there's no visible layout shift because the fallback was sized identically.

#### Metric Adjustment Properties

| Property | Purpose | Typical Range |
|----------|---------|---------------|
| **size-adjust** | Scale overall font size | 80% - 120% |
| **ascent-override** | Adjust top of glyphs | 80% - 110% |
| **descent-override** | Adjust bottom of glyphs | 15% - 30% |
| **line-gap-override** | Adjust line spacing | 0% - 20% |

**Example Adjustments for Common Fonts:**

```css
/* Fallback for Roboto (targeting Arial) */
@font-face {
  font-family: 'Roboto-Fallback';
  src: local('Arial');
  size-adjust: 100%;
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
}

/* Fallback for Open Sans (targeting Arial) */
@font-face {
  font-family: 'OpenSans-Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

/* Fallback for Montserrat (targeting Arial) */
@font-face {
  font-family: 'Montserrat-Fallback';
  src: local('Arial');
  size-adjust: 110%;
  ascent-override: 89%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

### 11.5 Font Optimization Checklist

#### File Format Optimization
- [ ] Use **WOFF2** exclusively for modern browsers (best compression)
- [ ] Keep WOFF as fallback only if supporting IE11
- [ ] Remove TTF, OTF, EOT files (obsolete)
- [ ] Verify all files are subset (remove unused glyphs)

#### Font Loading Strategy
- [ ] Use `font-display: swap` for critical text
- [ ] Use `font-display: optional` for decorative fonts
- [ ] Preload 1-2 critical fonts maximum
- [ ] Ensure `crossorigin="anonymous"` on all preloads

#### Font File Management
- [ ] Audit: List all font files vs. @font-face declarations
- [ ] Delete unused font files
- [ ] Remove non-subset duplicates
- [ ] Consider variable fonts to reduce file count

#### Performance Optimization
- [ ] Self-host all fonts (eliminate external DNS lookups)
- [ ] Implement font metric matching for critical fonts
- [ ] Set long cache headers (1 year) for font files
- [ ] Compress fonts at server level (Content-Encoding: gzip)

#### CSS Variables
- [ ] Create `--font-heading` and `--font-body` variables
- [ ] Replace all hardcoded font-family declarations
- [ ] Document font stack in variables file

**Example Variables Implementation:**
```css
/* css/variables/fonts.css */
:root {
  /* Font families */
  --font-heading: 'Orbitron', 'Orbitron-Fallback', 'Arial Black', sans-serif;
  --font-body: 'Rajdhani', 'Rajdhani-Fallback', 'Arial', sans-serif;
  --font-mono: 'Courier New', monospace;
  
  /* Font sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  /* Font weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;
  
  /* Line heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}

/* Usage throughout codebase */
body {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: var(--line-height-tight);
}

h1 { font-size: var(--font-size-4xl); font-weight: var(--font-weight-black); }
h2 { font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); }
h3 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }
```

### 11.6 Variable Fonts: When to Use

**What are Variable Fonts?**
A single font file that contains multiple weights/widths/styles, controlled via CSS properties.

**Example:**
```css
@font-face {
  font-family: 'Orbitron Variable';
  src: url('./fonts/Orbitron-VariableFont_wght.woff2') format('woff2');
  font-weight: 400 900; /* Range: Regular to Black */
  font-display: swap;
}

/* Usage */
h1 {
  font-family: 'Orbitron Variable', sans-serif;
  font-weight: 650; /* Any value between 400-900 */
}
```

**Pros:**
- ✅ Single file replaces multiple weights
- ✅ Fewer HTTP requests
- ✅ Fine-grained weight control

**Cons:**
- ❌ Larger single file size (50-100KB vs 45KB × 3 = 135KB)
- ❌ More data downloaded if only using 1-2 weights
- ❌ Slightly less browser support (>95% but not universal)

**Decision Matrix:**

| Scenario | Recommendation |
|----------|----------------|
| Using 3+ weights of same font | ✅ Use variable font |
| Using 1-2 weights only | ❌ Use static fonts |
| Need fine weight control (e.g., 450, 550) | ✅ Use variable font |
| Need maximum performance | ❌ Use static fonts (smaller) |
| Supporting older browsers | ❌ Use static fonts |

---

## 12. FOIT/FOUT Mitigation Techniques

### 12.1 Comprehensive FOIT/FOUT Audit Checklist

**Use this checklist to identify and fix font loading issues:**

| ID | Issue | Impact | Fix | Priority |
|----|-------|--------|-----|----------|
| **A-1** | Text invisible during load (FOIT) | Users can't read content, high bounce rate | Change to `font-display: swap` | 🔴 **Critical** |
| **A-2** | Large layout shift when font loads (FOUT → CLS) | Poor visual stability, bad UX | Implement font metric matching | 🔴 **Critical** |
| **A-3** | Font requests start late (not preloaded) | Delayed text rendering, slow LCP | Preload critical fonts | 🟡 **High** |
| **A-4** | Using inefficient font formats (TTF, OTF) | Larger file sizes, slower loads | Convert to WOFF2 | 🟡 **High** |
| **A-5** | External font hosting (Google Fonts CDN) | Extra DNS lookup, connection overhead | Self-host fonts | 🟢 **Medium** |
| **A-6** | Loading non-critical variants too early | Network congestion, delayed critical fonts | Use `font-display: optional`, defer loading | 🟢 **Medium** |
| **A-7** | No fallback font specified | Browser default (Times New Roman) causes massive shift | Define explicit fallback | 🟡 **High** |
| **A-8** | Non-subset font files | Unnecessary file size | Subset to required glyphs | 🟢 **Medium** |

### 12.2 Step-by-Step FOIT Elimination

**Step 1: Audit Current State**
```bash
# Check current font-display values
grep -r "font-display" css/**/*.css
```

**Step 2: Identify FOIT Issues**
1. Open DevTools → Network tab → Filter: Font
2. Note "Initiator" time for each font
3. If fonts load > 200ms, you have FOIT risk

**Step 3: Fix Critical Fonts**
```css
/* Before (causes FOIT) */
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Regular.woff2') format('woff2');
  /* font-display not set = auto = block behavior */
}

/* After (eliminates FOIT) */
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Regular.woff2') format('woff2');
  font-display: swap; /* ✅ Show fallback immediately */
}
```

**Step 4: Test**
1. Open page in DevTools
2. Throttle network: "Slow 3G"
3. Hard reload (Cmd+Shift+R)
4. Verify: Text visible immediately (no blank text)

### 12.3 Step-by-Step FOUT/CLS Reduction

**Step 1: Measure Current CLS**
```javascript
// Run in DevTools Console
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.hadRecentInput) continue;
    console.log('Layout shift:', entry.value);
  }
}).observe({type: 'layout-shift', buffered: true});

// Reload page and watch for shifts during font load
```

**Step 2: Calculate Font Metrics**

Use online tool or manual measurement:

1. Visit [Fallback Font Generator](https://screenspan.net/fallback)
2. Input your custom font name (e.g., "Orbitron")
3. Select system fallback (e.g., "Arial")
4. Tool calculates `size-adjust`, `ascent-override`, etc.

**Alternative: Manual Calculation**
```html
<!-- Create test page -->
<!DOCTYPE html>
<html>
<head>
  <style>
    @font-face {
      font-family: 'Orbitron';
      src: url('./fonts/Orbitron-Regular.woff2') format('woff2');
    }
    
    .custom { font-family: 'Orbitron', sans-serif; }
    .fallback { font-family: Arial, sans-serif; }
    
    span {
      font-size: 100px;
      display: inline-block;
      border: 1px solid red;
    }
  </style>
</head>
<body>
  <div>
    <span class="custom">Test123</span>
    <span class="fallback">Test123</span>
  </div>
  <script>
    // Measure dimensions
    const custom = document.querySelector('.custom').getBoundingClientRect();
    const fallback = document.querySelector('.fallback').getBoundingClientRect();
    
    const sizeAdjust = (custom.width / fallback.width * 100).toFixed(1);
    console.log(`size-adjust: ${sizeAdjust}%`);
  </script>
</body>
</html>
```

**Step 3: Implement Fallback Font**
```css
/* Original custom font */
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Regular.woff2') format('woff2');
  font-display: swap;
}

/* NEW: Metric-matched fallback */
@font-face {
  font-family: 'Orbitron-Fallback';
  src: local('Arial'); /* System font */
  size-adjust: 105%;      /* From calculation tool */
  ascent-override: 95%;   
  descent-override: 20%;  
}

/* Update font stack */
body {
  /* Fallback appears during load, custom font swaps in seamlessly */
  font-family: 'Orbitron', 'Orbitron-Fallback', Arial, sans-serif;
}
```

**Step 4: Verify CLS Improvement**
```javascript
// DevTools Console - measure CLS before and after
new PerformanceObserver((list) => {
  let cls = 0;
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) cls += entry.value;
  }
  console.log('Cumulative Layout Shift:', cls.toFixed(3));
}).observe({type: 'layout-shift', buffered: true});

// Target: CLS < 0.1
```

### 12.4 Font Loading Timeline Optimization

**Ideal Font Loading Sequence:**

```
0ms     - HTML parsed
50ms    - CSS parsed
50ms    - Font preload requests started (due to <link rel="preload">)
100ms   - Fallback fonts render (font-display: swap)
150ms   - Custom fonts downloaded (preloaded)
155ms   - Custom fonts swap in (minimal/no layout shift due to metric matching)
```

**Bad Font Loading Sequence:**

```
0ms     - HTML parsed
50ms    - CSS parsed
200ms   - CSS completely parsed, @font-face discovered
200ms   - Font requests started (NO PRELOAD)
3000ms  - Text invisible (FOIT due to font-display: block)
3200ms  - Custom fonts finally load and display
```

**Optimization Techniques:**

1. **Preload Critical Fonts**
```html
<head>
  <!-- Start font downloads ASAP -->
  <link rel="preload" href="./fonts/critical.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Then load CSS -->
  <link rel="stylesheet" href="main.css">
</head>
```

2. **Inline Font-Face for Critical Fonts**
```html
<head>
  <style>
    /* Inline critical @font-face in <head> */
    @font-face {
      font-family: 'Orbitron';
      src: url('./fonts/Orbitron-Regular.woff2') format('woff2');
      font-display: swap;
    }
  </style>
  
  <!-- Preload after declaration -->
  <link rel="preload" href="./fonts/Orbitron-Regular.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

3. **Lazy Load Non-Critical Font Variants**
```javascript
// fonts-loader.js
// Load decorative/heavy fonts after page load
window.addEventListener('load', () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/fonts-decorative.css';
  document.head.appendChild(link);
});
```

```css
/* fonts-decorative.css */
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Black.woff2') format('woff2');
  font-weight: 900;
  font-display: optional; /* Only load if fast connection */
}
```

### 12.5 Browser Font Loading API

For advanced control, use the **Font Loading API**:

```javascript
// Load fonts programmatically with priority control
async function loadCriticalFonts() {
  const fonts = [
    new FontFace(
      'Orbitron',
      'url(./fonts/Orbitron-Regular.woff2)',
      { weight: '400', display: 'swap' }
    ),
    new FontFace(
      'Rajdhani',
      'url(./fonts/Rajdhani-Regular.woff2)',
      { weight: '400', display: 'swap' }
    )
  ];
  
  // Load fonts
  await Promise.all(fonts.map(font => font.load()));
  
  // Add to document
  fonts.forEach(font => document.fonts.add(font));
  
  console.log('Critical fonts loaded');
}

// Execute after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCriticalFonts);
} else {
  loadCriticalFonts();
}
```

**Benefits:**
- Fine-grained loading control
- Can prioritize critical fonts
- Can defer non-critical fonts
- Can show loading states

**Drawback:**
- More complex than declarative CSS
- Requires JavaScript execution

---

*Continued in Part 3...*
# The Ultimate CSS & Font Optimization Master Guide - Part 3

## Part III: Optimization Strategies (Continued)

---

## 13. Critical CSS Strategy

### 13.1 Understanding Critical CSS

**Critical CSS** is the minimum CSS required to render above-the-fold content (what users see without scrolling).

**Benefits:**
- ⚡ Faster First Contentful Paint (FCP)
- ⚡ Improved Largest Contentful Paint (LCP)
- ⚡ Better perceived performance
- ⚡ Reduced render-blocking time

**Target:** <14KB inlined in `<head>` (fits in first TCP packet)

### 13.2 Manual Critical CSS Extraction

**Step 1: Identify Above-the-Fold Elements**

```javascript
// Run in DevTools Console
const viewport = {
  width: window.innerWidth,
  height: window.innerHeight
};

const criticalElements = Array.from(document.querySelectorAll('*'))
  .filter(el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < viewport.height &&
      rect.left < viewport.width &&
      rect.width > 0 &&
      rect.height > 0
    );
  })
  .map(el => ({
    tag: el.tagName,
    classes: Array.from(el.classList),
    id: el.id
  }));

console.table(criticalElements);
```

**Step 2: Extract Relevant Selectors**

Manually copy CSS for:
- Reset/normalize styles
- Typography base styles
- Hero section
- Navigation
- Any element visible above fold

**Example Critical CSS:**
```css
/* critical.css */

/* Reset */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* Typography */
body{font-family:'Rajdhani',Arial,sans-serif;font-size:1rem;line-height:1.5;color:#333}
h1{font-family:'Orbitron',sans-serif;font-size:2.5rem;font-weight:900;line-height:1.2}

/* Layout */
.container{max-width:1200px;margin:0 auto;padding:0 1rem}

/* Hero */
.hero{display:flex;align-items:center;min-height:100vh;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
.hero__title{font-size:3rem;color:#fff;margin-bottom:1rem}
.hero__subtitle{font-size:1.5rem;color:rgba(255,255,255,0.9)}

/* Navigation */
.navbar{position:fixed;top:0;width:100%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:1000}
.nav-list{display:flex;list-style:none;gap:2rem}
.nav-link{text-decoration:none;color:#333;font-weight:600}
```

### 13.3 Automated Critical CSS Extraction

**Option 1: Using Critical Package**

```bash
npm install --save-dev critical
```

```javascript
// scripts/extract-critical-css.js
const critical = require('critical');

critical.generate({
  inline: false, // Don't inline yet, just extract
  base: 'dist/',
  src: 'index.html',
  target: {
    css: 'critical.css',
    html: 'index.html'
  },
  width: 1300,
  height: 900,
  dimensions: [
    {
      width: 375,
      height: 667
    },
    {
      width: 1920,
      height: 1080
    }
  ]
}).then(() => {
  console.log('✅ Critical CSS extracted');
}).catch(err => {
  console.error('❌ Error:', err);
});
```

**Option 2: Using Critters (Vite/Webpack)**

For Vite:
```bash
npm install --save-dev vite-plugin-compression
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { critters } from 'vite-plugin-critters';

export default defineConfig({
  plugins: [
    critters({
      // Options
    })
  ]
});
```

### 13.4 Inlining Critical CSS

**Method 1: Manual Inline**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Inline critical CSS -->
  <style>
    /* Minified critical CSS here */
    *,*::before,*::after{box-sizing:border-box}
    body{font-family:'Rajdhani',Arial,sans-serif;margin:0}
    .hero{display:flex;min-height:100vh}
    /* ... rest of critical CSS ... */
  </style>
  
  <!-- Preload non-critical CSS -->
  <link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/main.css"></noscript>
</head>
<body>
  <!-- Content -->
</body>
</html>
```

**Method 2: Build-Time Injection**

```javascript
// scripts/inline-critical-css.js
const fs = require('fs');
const { minify } = require('csso');

// Read critical CSS
const criticalCSS = fs.readFileSync('css/critical.css', 'utf-8');

// Minify
const minified = minify(criticalCSS).css;

// Read HTML template
let html = fs.readFileSync('dist/index.html', 'utf-8');

// Inject into <head>
html = html.replace(
  '</head>',
  `<style>${minified}</style></head>`
);

// Write back
fs.writeFileSync('dist/index.html', html);

console.log('✅ Critical CSS inlined');
console.log(`   Size: ${(minified.length / 1024).toFixed(2)} KB`);
```

### 13.5 Loading Non-Critical CSS

**Option 1: Async Load with JavaScript**
```html
<script>
  // Load non-critical CSS asynchronously
  (function() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/main.css';
    document.head.appendChild(link);
  })();
</script>
```

**Option 2: Media Attribute Trick**
```html
<!-- Load with incorrect media, then switch -->
<link rel="stylesheet" 
      href="/css/main.css" 
      media="print" 
      onload="this.media='all'">
```

**Option 3: Preload + JavaScript**
```html
<link rel="preload" 
      href="/css/main.css" 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="/css/main.css">
</noscript>
```

### 13.6 Critical CSS Workflow

**Complete Implementation:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimized Page</title>
  
  <!-- 1. Preload critical fonts -->
  <link rel="preload" 
        href="/fonts/Orbitron-Regular.woff2" 
        as="font" 
        type="font/woff2" 
        crossorigin>
  
  <!-- 2. Inline critical CSS -->
  <style>
    /* Critical CSS (< 14KB) */
    /* ... minified styles ... */
  </style>
  
  <!-- 3. Async load non-critical CSS -->
  <link rel="preload" 
        href="/css/main.css" 
        as="style" 
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript>
    <link rel="stylesheet" href="/css/main.css">
  </noscript>
  
  <!-- 4. Preconnect to external resources (if any) -->
  <link rel="preconnect" href="https://analytics.example.com">
</head>
<body>
  <!-- Content renders immediately with critical CSS -->
  <nav class="navbar"><!-- ... --></nav>
  <section class="hero"><!-- ... --></section>
  
  <!-- Rest of page loads progressively -->
</body>
</html>
```

**Result:**
- ⚡ Hero/navbar render immediately
- ⚡ No render-blocking CSS
- ⚡ Main CSS loads in background
- ⚡ No flash of unstyled content

---

## 14. CSS Architecture & Modularization

### 14.1 File Structure Best Practices

**Recommended Structure (ITCSS-inspired):**

```
css/
├── 01-settings/
│   ├── _colors.css
│   ├── _typography.css
│   ├── _spacing.css
│   └── _breakpoints.css
├── 02-tools/
│   └── _mixins.css (if using preprocessor)
├── 03-generic/
│   ├── _reset.css
│   └── _normalize.css
├── 04-elements/
│   ├── _typography.css
│   ├── _forms.css
│   └── _tables.css
├── 05-objects/
│   ├── _container.css
│   ├── _grid.css
│   └── _media-object.css
├── 06-components/
│   ├── buttons/
│   │   ├── _button-base.css
│   │   ├── _button-primary.css
│   │   └── _button-outline.css
│   ├── cards/
│   │   ├── _card-base.css
│   │   ├── _service-card.css
│   │   ├── _pricing-card.css
│   │   └── _project-card.css
│   ├── navigation/
│   │   ├── _navbar.css
│   │   ├── _mobile-menu.css
│   │   └── _dropdown.css
│   └── forms/
│       ├── _input.css
│       ├── _select.css
│       └── _validation.css
├── 07-utilities/
│   ├── _spacing.css
│   ├── _display.css
│   ├── _text.css
│   └── _colors.css
├── 08-pages/
│   ├── _home.css
│   ├── _about.css
│   └── _contact.css
├── critical.css (auto-generated)
└── main.css (imports all)
```

**main.css (Import Order):**
```css
/* main.css - Orchestration file */

/* Settings */
@import './01-settings/_colors.css';
@import './01-settings/_typography.css';
@import './01-settings/_spacing.css';
@import './01-settings/_breakpoints.css';

/* Generic */
@import './03-generic/_reset.css';

/* Elements */
@import './04-elements/_typography.css';
@import './04-elements/_forms.css';

/* Objects */
@import './05-objects/_container.css';
@import './05-objects/_grid.css';

/* Components */
@import './06-components/buttons/_button-base.css';
@import './06-components/buttons/_button-primary.css';
@import './06-components/cards/_card-base.css';
@import './06-components/cards/_service-card.css';
@import './06-components/navigation/_navbar.css';

/* Utilities */
@import './07-utilities/_spacing.css';
@import './07-utilities/_display.css';

/* Pages (if needed) */
@import './08-pages/_home.css';
```

### 14.2 Splitting Large Files

**Problem: cards.css (1,470 lines)**

**Solution: Split by component type**

```bash
# Create directory structure
mkdir -p css/components/cards

# Split file
# Before: css/cards.css (1,470 lines)
# After:
#   css/components/cards/_card-base.css (80 lines)
#   css/components/cards/_service-card.css (320 lines)
#   css/components/cards/_pricing-card.css (280 lines)
#   css/components/cards/_project-card.css (240 lines)
#   css/components/cards/_offer-panel.css (200 lines)
#   css/components/cards/_animations.css (150 lines)
#   css/components/cards/_variants.css (200 lines)
```

**card-base.css (Shared styles):**
```css
/* css/components/cards/_card-base.css */

/* Base card structure (used by all card types) */
.card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card__header {
  margin-bottom: var(--space-4);
}

.card__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
}

.card__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.card__body {
  margin-bottom: var(--space-4);
}

.card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}
```

**service-card.css (Specific implementation):**
```css
/* css/components/cards/_service-card.css */

/* Service card specific styles */
.service-card {
  /* Inherits from .card base */
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-magenta));
}

.service-card__icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-4);
}

.service-card__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-gray-700);
}

/* Color variants */
.service-card--cyan {
  border-left: 4px solid var(--accent-cyan);
}

.service-card--cyan:hover {
  box-shadow: 0 10px 40px var(--glow-cyan);
}

.service-card--magenta {
  border-left: 4px solid var(--accent-magenta);
}

.service-card--magenta:hover {
  box-shadow: 0 10px 40px var(--glow-magenta);
}

/* Responsive */
@media (max-width: 768px) {
  .service-card {
    padding: var(--space-4);
  }
  
  .service-card__icon {
    width: 48px;
    height: 48px;
  }
}
```

### 14.3 Co-locating Responsive Styles

**Anti-Pattern: Separate responsive.css file**
```css
/* responsive.css - DON'T DO THIS */
@media (max-width: 768px) {
  .navbar { /* ... */ }
  .hero { /* ... */ }
  .service-card { /* ... */ }
  .pricing-card { /* ... */ }
  /* ... 800+ lines of mixed responsive styles ... */
}
```

**Best Practice: Co-locate with components**
```css
/* css/components/navigation/_navbar.css */

.navbar {
  display: flex;
  justify-content: space-between;
  padding: var(--space-4) var(--space-8);
}

.navbar__logo {
  font-size: var(--font-size-xl);
}

.navbar__menu {
  display: flex;
  gap: var(--space-6);
}

/* Responsive styles in same file */
@media (max-width: 768px) {
  .navbar {
    padding: var(--space-3) var(--space-4);
  }
  
  .navbar__menu {
    display: none; /* Mobile menu handled separately */
  }
  
  .navbar__hamburger {
    display: block;
  }
}
```

**Benefits:**
- ✅ All navbar styles in one place
- ✅ Easy to find and modify
- ✅ Component can be copied to other projects
- ✅ No context switching between files

### 14.4 Component Composition Pattern

**Instead of massive monolithic components, compose from smaller pieces:**

```css
/* css/components/buttons/_button-base.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

```css
/* css/components/buttons/_button-primary.css */
.btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}
```

```css
/* css/components/buttons/_button-outline.css */
.btn--outline {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--outline:hover {
  background: var(--color-primary);
  color: var(--color-white);
}
```

```css
/* css/components/buttons/_button-large.css */
.btn--large {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}
```

**Usage in HTML:**
```html
<!-- Compose button styles -->
<button class="btn btn--primary">Default Primary</button>
<button class="btn btn--primary btn--large">Large Primary</button>
<button class="btn btn--outline">Outline Button</button>
<button class="btn btn--outline btn--large">Large Outline</button>
```

**Benefits:**
- ✅ Small, focused files
- ✅ Reusable modifiers
- ✅ Easy to add new variants
- ✅ Predictable composition

---

## 15. Duplicate & Conflict Resolution

### 15.1 Identifying Duplicate Selectors

**Automated Script:**
```javascript
// scripts/find-duplicate-selectors.js
const fs = require('fs');
const postcss = require('postcss');
const { glob } = require('glob');

async function findDuplicateSelectors() {
  const cssFiles = await glob('css/**/*.css');
  const selectorMap = new Map();
  
  for (const file of cssFiles) {
    const css = fs.readFileSync(file, 'utf-8');
    const root = postcss.parse(css);
    
    root.walkRules(rule => {
      const selector = rule.selector;
      
      if (!selectorMap.has(selector)) {
        selectorMap.set(selector, []);
      }
      
      selectorMap.get(selector).push({
        file,
        line: rule.source.start.line,
        declarations: rule.nodes.length
      });
    });
  }
  
  // Find duplicates
  const duplicates = [];
  selectorMap.forEach((locations, selector) => {
    if (locations.length > 1) {
      duplicates.push({ selector, locations });
    }
  });
  
  // Print report
  console.log(`Found ${duplicates.length} duplicate selectors:\n`);
  
  duplicates.forEach(dup => {
    console.log(`Selector: ${dup.selector}`);
    console.log(`Occurrences: ${dup.locations.length}`);
    dup.locations.forEach(loc => {
      console.log(`  ${loc.file}:${loc.line} (${loc.declarations} declarations)`);
    });
    console.log('');
  });
}

findDuplicateSelectors();
```

### 15.2 Resolving Common Duplicates

**Case 1: Exact Duplicate - Remove**
```css
/* Before (cards.css) */

/* Line 357 */
.pricing-card.pricing-card--magenta {
  border-color: rgba(255, 0, 255, 0.3);
}

/* Line 361 - OVERWRITES ABOVE */
.pricing-card.pricing-card--magenta {
  border-color: var(--accent-magenta);
  box-shadow: 0 20px 60px var(--glow-magenta);
}

/* After - Remove line 357 */
.pricing-card.pricing-card--magenta {
  border-color: var(--accent-magenta);
  box-shadow: 0 20px 60px var(--glow-magenta);
}
```

**Case 2: Repeated Pattern - Abstract to Variable**
```css
/* Before - Repeated 20+ times */
.card-cyan:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 10px 40px var(--glow-cyan);
}

.card-magenta:hover {
  border-color: var(--accent-magenta);
  box-shadow: 0 10px 40px var(--glow-magenta);
}

.card-green:hover {
  border-color: var(--accent-green);
  box-shadow: 0 10px 40px var(--glow-green);
}

/* After - Use data attributes and CSS variables */
.card[data-accent]:hover {
  border-color: var(--card-accent);
  box-shadow: 0 10px 40px var(--card-glow);
}

.card[data-accent="cyan"] {
  --card-accent: var(--accent-cyan);
  --card-glow: var(--glow-cyan);
}

.card[data-accent="magenta"] {
  --card-accent: var(--accent-magenta);
  --card-glow: var(--glow-magenta);
}

.card[data-accent="green"] {
  --card-accent: var(--accent-green);
  --card-glow: var(--glow-green);
}
```

**Case 3: Hardcoded Values - Use Variables**
```css
/* Before - font-family repeated 55+ times */
h1 { font-family: 'Orbitron', sans-serif; }
h2 { font-family: 'Orbitron', sans-serif; }
.heading { font-family: 'Orbitron', sans-serif; }
.title { font-family: 'Orbitron', sans-serif; }
/* ... 51 more times ... */

/* After - Define once, use everywhere */
:root {
  --font-heading: 'Orbitron', 'Orbitron-Fallback', sans-serif;
}

h1, h2, h3, h4, h5, h6,
.heading,
.title {
  font-family: var(--font-heading);
}
```

### 15.3 Resolving Specificity Conflicts

**Problem: Overly Specific Selectors**
```css
/* Bad - Specificity: 0,0,4 */
div.container .content .card .title {
  color: blue;
}

/* Later in code - Can't override without !important */
.card--featured .title {
  color: red; /* Doesn't work! */
}
```

**Solution: Use BEM (Flat Specificity)**
```css
/* Good - Specificity: 0,1,0 */
.card__title {
  color: blue;
}

/* Easy to override */
.card--featured .card__title {
  color: red; /* Works! */
}
```

**Refactoring Strategy:**
1. Identify high-specificity selectors (>30)
2. Rewrite using BEM
3. Test thoroughly
4. Remove old selectors

### 15.4 Consolidating Duplicate Patterns

**Create shared utilities for common patterns:**

```css
/* css/utilities/_effects.css */

/* Hover lift effect (was duplicated 30+ times) */
.u-hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.u-hover-lift:hover {
  transform: translateY(-4px);
}

/* Glow effects */
.u-glow-cyan:hover {
  box-shadow: 0 10px 40px var(--glow-cyan);
}

.u-glow-magenta:hover {
  box-shadow: 0 10px 40px var(--glow-magenta);
}

/* Gradient backgrounds */
.u-gradient-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

.u-gradient-accent {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta));
}
```

**Usage:**
```html
<!-- Before: Custom CSS for each card -->
<div class="service-card-cyan">...</div>

<!-- After: Compose with utilities -->
<div class="card u-hover-lift u-glow-cyan">...</div>
```

---

## 16. Unused CSS Elimination

### 16.1 PurgeCSS Configuration

**Installation:**
```bash
npm install --save-dev @fullhuman/postcss-purgecss
```

**PostCSS Configuration:**
```javascript
// postcss.config.cjs
const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
  plugins: [
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production'
      ? [
          purgecss({
            content: [
              './**/*.html',
              './js/**/*.js',
              './partials/**/*.html',
              './src/**/*.{js,jsx,ts,tsx,vue}'
            ],
            
            // Default extractor
            defaultExtractor: content => {
              // Match all possible class names, including those with colons and dots
              const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              
              // Match classes in class="..." attributes
              const classMatches = content.match(/class=["']([^"']+)["']/gi) || [];
              const classes = classMatches.flatMap(
                m => m.match(/class=["']([^"']+)["']/i)?.[1]?.split(/\s+/) || []
              );
              
              return [...broadMatches, ...classes];
            },
            
            // Safelist: Classes to always keep
            safelist: {
              // Standard safelist
              standard: [
                'active',
                'scrolled',
                'is-visible',
                'is-hidden',
                'has-error',
                'bg-loaded',
                'is-ready'
              ],
              
              // Deep safelist (keeps children too)
              deep: [
                /^page-transition-/,
                /^modal-/,
                /^dropdown-/
              ],
              
              // Greedy safelist (keeps anything matching pattern)
              greedy: [
                /^service-card/,
                /^pricing-card/,
                /^offer-panel/,
                /^process-card-/,
                /^impact-card-/,
                /^faq-card-/,
                /^project-/,
                /^achievement-/
              ]
            },
            
            // Blocklist: Classes to always remove
            blocklist: [
              'debug',
              'test-only'
            ],
            
            // Fontface: Keep all @font-face rules
            fontFace: true,
            
            // Keyframes: Keep all @keyframes
            keyframes: true,
            
            // Variables: Keep all CSS variables
            variables: true
          })
        ]
      : [])
  ]
};
```

### 16.2 Safelist Strategy

**Identifying Dynamic Classes:**

```javascript
// scripts/find-dynamic-classes.js
const fs = require('fs');
const { glob } = require('glob');

async function findDynamicClasses() {
  const jsFiles = await glob('js/**/*.js');
  const dynamicClasses = new Set();
  
  for (const file of jsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Find classList.add/remove/toggle
    const classListMatches = content.matchAll(/classList\.(add|remove|toggle)\(['"]([^'"]+)['"]\)/g);
    for (const match of classListMatches) {
      dynamicClasses.add(match[2]);
    }
    
    // Find className assignments
    const classNameMatches = content.matchAll(/\.className\s*=\s*['"]([^'"]+)['"]/g);
    for (const match of classNameMatches) {
      match[1].split(/\s+/).forEach(cls => dynamicClasses.add(cls));
    }
    
    // Find setAttribute('class')
    const setAttributeMatches = content.matchAll(/setAttribute\(['"]class['"],\s*['"]([^'"]+)['"]\)/g);
    for (const match of setAttributeMatches) {
      match[1].split(/\s+/).forEach(cls => dynamicClasses.add(cls));
    }
  }
  
  console.log('Dynamic classes found:');
  console.log(Array.from(dynamicClasses).sort().join('\n'));
  
  // Output safelist config
  console.log('\n\nSafelist config:');
  console.log('safelist: [');
  Array.from(dynamicClasses).sort().forEach(cls => {
    console.log(`  '${cls}',`);
  });
  console.log(']');
}

findDynamicClasses();
```

**Common Dynamic Class Patterns:**

```javascript
// safelist patterns for common scenarios

// Navigation states
/^nav.*active$/
/^menu.*open$/

// Modal/overlay states
/^modal.*visible$/
/^overlay.*show$/

// Form validation
/^form.*error$/
/^input.*invalid$/

// Loading states
/^is-loading$/
/^spinner.*active$/

// Animations
/^animate-/
/^fade-/
/^slide-/

// Color variants (if dynamically applied)
/^bg-/
/^text-/
/^border-/
```

### 16.3 Testing Purge Results

**Before Purging:**
```bash
# Build without purge
NODE_ENV=development npm run build
ls -lh dist/css/main.css
# Output: 245KB
```

**After Purging:**
```bash
# Build with purge
NODE_ENV=production npm run build
ls -lh dist/css/main.css
# Output: 98KB (60% reduction)
```

**Visual Testing Checklist:**
- [ ] Homepage loads correctly
- [ ] All navigation states work (hover, active)
- [ ] Modals/dropdowns open and close
- [ ] Form validation styles appear
- [ ] Mobile menu functions
- [ ] All page transitions work
- [ ] Hover effects on cards/buttons
- [ ] Loading states display correctly
- [ ] Error messages styled properly

### 16.4 Debugging Purged Styles

**If styles are missing after purge:**

1. **Check if class exists in HTML/JS:**
```bash
grep -r "missing-class" ./**/*.{html,js}
```

2. **Add to safelist temporarily:**
```javascript
safelist: ['missing-class']
```

3. **Use PurgeCSS's rejected output:**
```javascript
purgecss({
  // ... other options
  rejected: true, // Log rejected selectors
  rejectedCss: true // Save rejected CSS
})
```

4. **Check extractor pattern:**
```javascript
// Test your extractor
const content = `<div class="my-complex-class:hover">`;
const matches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g);
console.log(matches); // Should include 'my-complex-class:hover'
```

---

*Continued in final part...*
# The Ultimate CSS & Font Optimization Master Guide - Part 4 (Final)

## Part IV: Implementation & Automation

---

## 17. Seven-Week Implementation Roadmap

### 17.1 Week 1: Preparation & Analysis

#### Day 1-2: Initial Assessment
- [ ] Run complete audit using scripts from Section 8
- [ ] Document current performance baseline (Lighthouse)
- [ ] Create inventory of all CSS and font files
- [ ] Identify top 5 critical issues
- [ ] Set up audit-reports/ directory structure

**Deliverables:**
- CSS inventory JSON report
- Font inventory JSON report  
- Performance baseline screenshots
- Priority issues document

#### Day 3-4: Tool Setup & Configuration
- [ ] Install and configure Stylelint
- [ ] Set up PurgeCSS (but don't enable yet)
- [ ] Configure build tools (Vite/Webpack)
- [ ] Install analysis scripts
- [ ] Set up performance monitoring

**Deliverables:**
- Stylelint configuration
- PostCSS configuration (purge disabled)
- Build scripts in package.json
- Pre-commit hooks (optional)

#### Day 5: Backup & Planning
- [ ] Create backup branch: `git checkout -b css-optimization-backup`
- [ ] Create feature branch: `git checkout -b css-font-optimization`
- [ ] Document current bundle sizes
- [ ] Create rollback plan
- [ ] Set up staging environment

**Deliverables:**
- Git branches created
- Rollback procedure documented
- Staging environment ready

### 17.2 Week 2: Font Optimization

#### Day 1: Font Audit
- [ ] Run font inventory script
- [ ] Document all @font-face declarations
- [ ] Identify unused font files (17 in example)
- [ ] Check font-display values
- [ ] Audit preload tags

**Deliverables:**
- List of fonts to delete
- font-display audit report
- Preload optimization plan

#### Day 2: Font Cleanup
- [ ] Delete unused font files
- [ ] Remove non-subset duplicates
- [ ] Verify all @font-face declarations valid
- [ ] Test font loading

**Commands:**
```bash
# Backup fonts directory
cp -r assets/fonts assets/fonts.backup

# Delete unused files (example)
rm assets/fonts/Orbitron/woff2/Orbitron-Medium-subset.woff2
rm assets/fonts/Orbitron/woff2/Orbitron-Regular.woff2
# ... (delete all unused)

# Verify @font-face still works
npm run dev
```

**Deliverables:**
- Unused fonts deleted
- Fonts directory cleaned
- Working font declarations

#### Day 3: Font Variables Implementation
- [ ] Create fonts.css variables file
- [ ] Define --font-heading and --font-body
- [ ] Find all hardcoded font-family declarations
- [ ] Replace with variables

**Before/After:**
```css
/* Before: 55+ instances */
h1 { font-family: 'Orbitron', sans-serif; }

/* After: 1 variable definition */
:root { --font-heading: 'Orbitron', 'Orbitron-Fallback', sans-serif; }
h1 { font-family: var(--font-heading); }
```

**Script:**
```bash
node scripts/replace-font-families.js
```

**Deliverables:**
- fonts.css variables file
- All hardcoded font-families replaced
- Verification tests passed

#### Day 4: Font Loading Optimization
- [ ] Update all font-display values
- [ ] Implement font metric matching
- [ ] Optimize preload tags
- [ ] Test FOIT/FOUT elimination

**Tasks:**
```css
/* Update @font-face declarations */
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Regular-subset.woff2') format('woff2');
  font-display: swap; /* ✅ Add/verify */
}

/* Add metric-matched fallback */
@font-face {
  font-family: 'Orbitron-Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 20%;
}
```

**Deliverables:**
- All fonts use font-display: swap
- Fallback fonts implemented
- Preload tags optimized
- CLS score improved

#### Day 5: Font Testing & Validation
- [ ] Test all pages for font loading
- [ ] Measure CLS score (target: <0.1)
- [ ] Test on slow 3G network
- [ ] Cross-browser testing
- [ ] Document improvements

**Testing Commands:**
```bash
# Lighthouse test
lhci autorun

# Network throttling test (Chrome DevTools)
# Slow 3G → Hard reload → Check for FOIT
```

**Deliverables:**
- CLS score <0.1 ✅
- No FOIT on slow networks ✅
- All browsers tested ✅
- Performance comparison report

### 17.3 Week 3: CSS Deduplication

#### Day 1-2: Find & Fix Duplicates
- [ ] Run duplicate detection scripts
- [ ] Fix exact duplicate selectors
- [ ] Document all findings
- [ ] Create fix plan

**Script:**
```bash
node scripts/find-duplicate-selectors.js > audit-reports/duplicates.txt
```

**Fix Example:**
```css
/* Remove line 357 in cards.css */
/* .pricing-card.pricing-card--magenta { border-color: rgba(255, 0, 255, 0.3); } */

/* Keep line 361 */
.pricing-card.pricing-card--magenta {
  border-color: var(--accent-magenta);
  box-shadow: 0 20px 60px var(--glow-magenta);
}
```

**Deliverables:**
- Duplicate report
- All exact duplicates removed
- Git commit with fixes

#### Day 3: Abstract Repeated Patterns
- [ ] Identify repeated hover effects
- [ ] Identify repeated gradients
- [ ] Create CSS variables or utilities
- [ ] Replace repeated patterns

**Strategy:**
```css
/* Before: 20+ repeated hover effects */
.card-cyan:hover { border-color: var(--accent-cyan); box-shadow: 0 10px 40px var(--glow-cyan); }
.card-magenta:hover { border-color: var(--accent-magenta); box-shadow: 0 10px 40px var(--glow-magenta); }

/* After: Single rule with CSS variables */
.card[data-accent]:hover {
  border-color: var(--card-accent);
  box-shadow: 0 10px 40px var(--card-glow);
}

.card[data-accent="cyan"] {
  --card-accent: var(--accent-cyan);
  --card-glow: var(--glow-cyan);
}
```

**Deliverables:**
- Utility classes created
- Repeated patterns replaced
- HTML updated with new patterns

#### Day 4: Optimize Selectors
- [ ] Run specificity analysis
- [ ] Identify overly specific selectors
- [ ] Refactor to BEM where needed
- [ ] Remove !important where possible

**Deliverables:**
- Specificity report
- High-specificity selectors refactored
- !important usage reduced

#### Day 5: Testing
- [ ] Visual regression testing
- [ ] Test all interactive elements
- [ ] Verify hover states
- [ ] Cross-browser testing

**Deliverables:**
- Visual regression tests passed
- No broken styles
- All interactions work

### 17.4 Week 4: Modularization

#### Day 1-2: Split cards.css
- [ ] Create components/cards/ directory
- [ ] Split cards.css into 7 files
- [ ] Update imports in main.css
- [ ] Test all card components

**Directory Structure:**
```
css/components/cards/
├── _card-base.css (80 lines)
├── _service-card.css (320 lines)
├── _pricing-card.css (280 lines)
├── _project-card.css (240 lines)
├── _offer-panel.css (200 lines)
├── _animations.css (150 lines)
└── _variants.css (200 lines)
```

**Deliverables:**
- cards.css split successfully
- All card types working
- File structure documented

#### Day 3: Reorganize Responsive Styles
- [ ] Choose strategy: co-locate or separate
- [ ] Move responsive styles
- [ ] Update imports
- [ ] Test all breakpoints

**Strategy A: Co-locate (Recommended)**
```css
/* In each component file */
.navbar { /* desktop styles */ }

@media (max-width: 768px) {
  .navbar { /* mobile styles */ }
}
```

**Strategy B: Separate responsive files**
```
css/responsive/
├── _navigation-responsive.css
├── _cards-responsive.css
└── _hero-responsive.css
```

**Deliverables:**
- Responsive styles organized
- All breakpoints working
- Mobile/tablet/desktop tested

#### Day 4-5: Refine & Document
- [ ] Review all split files
- [ ] Ensure consistent naming
- [ ] Add file-level comments
- [ ] Update documentation
- [ ] Verify all imports

**Deliverables:**
- All files properly documented
- Import structure verified
- README updated

### 17.5 Week 5: Unused CSS Removal

#### Day 1-2: Configure PurgeCSS
- [ ] Enable PurgeCSS in PostCSS config
- [ ] Configure content paths
- [ ] Set up safelist (from dynamic class analysis)
- [ ] Test with development build first

**Configuration:**
```javascript
// postcss.config.cjs
purgecss({
  content: ['./**/*.html', './js/**/*.js'],
  safelist: [
    'active', 'is-visible', 'has-error',
    /^service-card/, /^pricing-card/, /^offer-panel/
  ]
})
```

**Deliverables:**
- PurgeCSS configured
- Safelist defined
- Test build successful

#### Day 3: Identify Dynamic Classes
- [ ] Run dynamic class finder script
- [ ] Review JavaScript for classList usage
- [ ] Add dynamic classes to safelist
- [ ] Test purge build

**Script:**
```bash
node scripts/find-dynamic-classes.js
```

**Deliverables:**
- Dynamic classes identified
- Safelist updated
- Purge build tested

#### Day 4: Production Build & Test
- [ ] Run production build with PurgeCSS
- [ ] Compare before/after bundle sizes
- [ ] Test ALL pages thoroughly
- [ ] Fix any missing styles

**Testing Checklist:**
- [ ] Homepage
- [ ] All navigation states
- [ ] Modals/dropdowns
- [ ] Form validation
- [ ] Mobile menu
- [ ] Hover effects
- [ ] Loading states
- [ ] Error messages

**Deliverables:**
- Production build successful
- Bundle size reduced 40%+
- All pages working correctly

#### Day 5: Validation & Documentation
- [ ] Run full test suite
- [ ] Visual regression tests
- [ ] Performance benchmarking
- [ ] Document purge results

**Metrics:**
```
Before PurgeCSS: 245KB (uncompressed)
After PurgeCSS:  98KB (uncompressed)
Reduction:       60%
```

**Deliverables:**
- All tests passed
- Performance metrics documented
- Before/after comparison

### 17.6 Week 6: Build Optimization

#### Day 1: Critical CSS
- [ ] Extract critical CSS
- [ ] Minify critical CSS
- [ ] Inline in HTML <head>
- [ ] Test LCP improvement

**Script:**
```bash
node scripts/extract-critical-css.js
node scripts/inline-critical-css.js
```

**Deliverables:**
- Critical CSS extracted (<14KB)
- Inlined in HTML
- LCP improved

#### Day 2: CSS Minification & Code Splitting
- [ ] Enable cssMinify in build config
- [ ] Enable cssCodeSplit
- [ ] Configure chunking strategy
- [ ] Test build output

**Vite Config:**
```javascript
export default {
  build: {
    cssMinify: true, // ✅ Enable
    cssCodeSplit: true, // ✅ Enable
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['normalize.css'],
          'critical': ['./css/critical.css']
        }
      }
    }
  }
}
```

**Deliverables:**
- Minification enabled
- Code splitting working
- Separate CSS chunks created

#### Day 3: Compression & Caching
- [ ] Enable gzip/brotli compression
- [ ] Set cache headers for fonts/CSS
- [ ] Test compression ratios
- [ ] Verify caching behavior

**Server Config Example (nginx):**
```nginx
# Compression
gzip on;
gzip_types text/css application/javascript font/woff2;
brotli on;
brotli_types text/css application/javascript font/woff2;

# Cache headers
location ~* \.(css)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

**Deliverables:**
- Compression enabled
- Cache headers set
- Performance verified

#### Day 4: CSS Containment
- [ ] Identify large components
- [ ] Add contain property
- [ ] Test rendering performance
- [ ] Measure improvement

**Implementation:**
```css
/* Large/complex components */
.service-card {
  contain: layout style paint;
}

.services-grid {
  contain: layout;
}

.modal {
  contain: layout style;
}
```

**Deliverables:**
- Containment added to 5+ components
- Rendering performance improved
- No visual regressions

#### Day 5: Final Optimization & Testing
- [ ] Run Lighthouse audit
- [ ] Run bundle analyzer
- [ ] Performance budget check
- [ ] Document all optimizations

**Performance Budget:**
```json
{
  "budget": [
    {"resourceType": "stylesheet", "budget": 100},
    {"resourceType": "font", "budget": 200}
  ],
  "timings": [
    {"metric": "first-contentful-paint", "budget": 2000},
    {"metric": "largest-contentful-paint", "budget": 2500},
    {"metric": "cumulative-layout-shift", "budget": 0.1}
  ]
}
```

**Deliverables:**
- Lighthouse score >90
- All budgets met
- Optimization report

### 17.7 Week 7: Testing & Deployment

#### Day 1-2: Comprehensive Testing
- [ ] Visual regression testing (all pages)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Accessibility testing
- [ ] Performance testing (multiple locations)

**Testing Checklist:**
- [ ] Desktop: Chrome, Firefox, Safari, Edge
- [ ] Mobile: iPhone (Safari), Android (Chrome)
- [ ] Tablets: iPad, Android tablet
- [ ] Network conditions: Fast, Slow 3G, Offline
- [ ] Screen readers: VoiceOver, NVDA

**Deliverables:**
- All browsers tested ✅
- All devices tested ✅
- No critical bugs
- Test report document

#### Day 3: Performance Validation
- [ ] Run Lighthouse on all pages
- [ ] Verify Core Web Vitals
- [ ] Compare before/after metrics
- [ ] Document improvements

**Metrics Comparison:**
```
Metric                Before    After     Improvement
====================================================
CSS Bundle (gz)       245KB     98KB      60% ↓
Font Files            24        7         71% ↓
LCP                   4.2s      2.1s      50% ↓
CLS                   0.25      0.06      76% ↓
Lighthouse Score      72        94        31% ↑
Unused CSS            40%       3%        93% ↓
```

**Deliverables:**
- Performance report
- Core Web Vitals ✅
- Before/after comparison

#### Day 4: Staged Rollout
- [ ] Deploy to staging environment
- [ ] Smoke test staging
- [ ] Monitor staging for 24 hours
- [ ] Get stakeholder approval
- [ ] Deploy to production (5% traffic)
- [ ] Monitor error rates
- [ ] Gradually increase to 100%

**Deployment Steps:**
```bash
# 1. Deploy to staging
git checkout css-font-optimization
npm run build
# Deploy dist/ to staging

# 2. Test staging
npm run test:smoke

# 3. Deploy to production (gradual)
# Deploy with feature flag at 5%
# Monitor for 2 hours
# Increase to 25%
# Monitor for 2 hours
# Increase to 100%
```

**Deliverables:**
- Staging deployed ✅
- Production deployed ✅
- No errors detected ✅

#### Day 5: Monitoring & Documentation
- [ ] Set up ongoing monitoring
- [ ] Configure alerts
- [ ] Document final state
- [ ] Create maintenance guide
- [ ] Celebrate! 🎉

**Monitoring Setup:**
```javascript
// Real User Monitoring (RUM)
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // Send to analytics
    analytics.track('performance_metric', {
      name: entry.name,
      value: entry.value,
      timestamp: Date.now()
    });
  }
});

perfObserver.observe({
  entryTypes: ['largest-contentful-paint', 'layout-shift']
});
```

**Deliverables:**
- Monitoring configured
- Alerts set up
- Documentation complete
- Project closed

---

## 18. Automation Scripts & Tools

### 18.1 Complete Script Collection

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:analyze": "vite build && node scripts/analyze-bundle.js",
    
    "audit:css": "node scripts/css-inventory.js",
    "audit:fonts": "node scripts/font-inventory.js",
    "audit:duplicates": "node scripts/find-duplicate-selectors.js",
    "audit:hardcoded": "node scripts/find-hardcoded-values.js",
    "audit:dynamic": "node scripts/find-dynamic-classes.js",
    "audit:all": "npm run audit:css && npm run audit:fonts && npm run audit:duplicates",
    
    "lint:css": "stylelint '**/*.css' --fix",
    "lint:css:check": "stylelint '**/*.css'",
    
    "critical:extract": "node scripts/extract-critical-css.js",
    "critical:inline": "node scripts/inline-critical-css.js",
    
    "test:visual": "playwright test visual-regression.spec.js",
    "test:performance": "lhci autorun",
    "test:smoke": "playwright test smoke.spec.js",
    
    "optimize": "npm run build && npm run build:analyze && npm run test:performance"
  }
}
```

### 18.2 CI/CD Integration

**GitHub Actions Workflow:**
```yaml
# .github/workflows/css-performance.yml
name: CSS Performance Check

on:
  pull_request:
    paths:
      - 'css/**'
      - 'fonts/**'
      - 'vite.config.js'
      - 'postcss.config.cjs'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint CSS
        run: npm run lint:css:check
      
      - name: Run CSS Audit
        run: |
          npm run audit:all
          echo "Audit reports generated"
      
      - name: Build & Analyze
        run: |
          npm run build
          npm run build:analyze
      
      - name: Check Bundle Size
        run: |
          BUNDLE_SIZE=$(du -k dist/css/*.css | awk '{sum+=$1} END {print sum}')
          if [ $BUNDLE_SIZE -gt 102 ]; then
            echo "❌ Bundle size ${BUNDLE_SIZE}KB exceeds 100KB limit"
            exit 1
          fi
          echo "✅ Bundle size: ${BUNDLE_SIZE}KB"
      
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
      
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: audit-reports
          path: audit-reports/
      
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('audit-reports/bundle-analysis.json'));
            
            const comment = `
            ## CSS Performance Report
            
            **Bundle Analysis:**
            - Total Size: ${report.totalSizeKB} KB
            - Gzipped: ${report.totalGzippedKB} KB
            - Compression: ${report.overallCompression}%
            
            ${report.warnings.length > 0 ? '⚠️ **Warnings:**\n' + report.warnings.map(w => `- ${w.message}`).join('\n') : '✅ No warnings'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

---

## 19. Build Configuration Optimization

### 19.1 Vite Configuration (Recommended)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    // CSS optimization
    cssMinify: true,
    cssCodeSplit: true,
    
    // Output options
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          'vendor-css': ['normalize.css'],
        },
        
        // Asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          
          if (ext === 'css') {
            return `css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  plugins: [
    // Bundle analyzer
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  
  // CSS preprocessor options (if using Sass)
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./css/variables.scss";`
      }
    }
  }
});
```

### 19.2 Webpack Configuration (Alternative)

```javascript
// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  
  entry: './src/main.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    }),
    
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ],
  
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true
            }
          ]
        }
      })
    ],
    
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};
```

---

## 20. Testing & Validation Procedures

### 20.1 Visual Regression Testing with Playwright

```javascript
// tests/visual-regression.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test.describe('Visual Regression Tests', () => {
  const pages = [
    { name: 'home', url: '/' },
    { name: 'about', url: '/about' },
    { name: 'services', url: '/services' },
    { name: 'contact', url: '/contact' }
  ];
  
  for (const page of pages) {
    test(`${page.name} - desktop`, async ({ page: pw }) => {
      await pw.setViewportSize({ width: 1920, height: 1080 });
      await pw.goto(page.url);
      await pw.waitForLoadState('networkidle');
      
      // Wait for fonts to load
      await pw.waitForFunction(() => document.fonts.ready);
      
      await expect(pw).toHaveScreenshot(`${page.name}-desktop.png`, {
        fullPage: true,
        maxDiffPixels: 100
      });
    });
    
    test(`${page.name} - mobile`, async ({ page: pw }) => {
      await pw.setViewportSize({ width: 375, height: 667 });
      await pw.goto(page.url);
      await pw.waitForLoadState('networkidle');
      
      await pw.waitForFunction(() => document.fonts.ready);
      
      await expect(pw).toHaveScreenshot(`${page.name}-mobile.png`, {
        fullPage: true,
        maxDiffPixels: 100
      });
    });
  }
  
  test('interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Test hover states
    const card = page.locator('.service-card').first();
    await card.hover();
    await expect(page).toHaveScreenshot('card-hover.png');
    
    // Test modal
    await page.click('[data-modal-trigger]');
    await page.waitForSelector('.modal.visible');
    await expect(page).toHaveScreenshot('modal-open.png');
  });
});
```

### 20.2 Performance Testing Script

```javascript
// tests/performance.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  test('Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // Target: <2.5s
    
    // Measure CLS
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 5000);
      });
    });
    
    expect(cls).toBeLessThan(0.1); // Target: <0.1
  });
  
  test('CSS Bundle Size', async ({ request }) => {
    const response = await request.get('/css/main.css');
    const size = parseInt(response.headers()['content-length']);
    const sizeKB = size / 1024;
    
    expect(sizeKB).toBeLessThan(100); // Target: <100KB
  });
  
  test('Font Loading', async ({ page }) => {
    await page.goto('/');
    
    // Get font loading metrics
    const fontMetrics = await page.evaluate(() => {
      const fonts = performance.getEntriesByType('resource')
        .filter(r => r.name.includes('.woff'));
      
      return {
        count: fonts.length,
        totalSize: fonts.reduce((sum, f) => sum + f.transferSize, 0),
        maxDuration: Math.max(...fonts.map(f => f.duration))
      };
    });
    
    expect(fontMetrics.count).toBeLessThanOrEqual(7); // Target: ≤7 fonts
    expect(fontMetrics.totalSize).toBeLessThan(200 * 1024); // Target: <200KB
    expect(fontMetrics.maxDuration).toBeLessThan(1000); // Target: <1s
  });
});
```

---

## Part V: Reference Materials

---

## 21. Complete MCP Tool Reference

### 21.1 Quick Reference Card

**Filesystem MCP:**
- `search_files` - Find CSS/font files
- `get_file_info` - Analyze file size
- `read_file` - Read CSS content
- `list_directory` - List files in directory

**Chrome DevTools MCP:**
- `performance_start_trace` - Begin performance recording
- `performance_stop_trace` - End recording & analyze
- `evaluate_script` - Run browser JavaScript
- `take_screenshot` - Capture visual state
- `list_network_requests` - Analyze network

**Playwright MCP:**
- `run_test` - Execute test scripts
- `capture_coverage` - Get CSS coverage
- `visual_diff` - Compare screenshots

**Context7 MCP:**
- `search_docs` - Find documentation
- `get_examples` - Get code examples

**Brave Search MCP:**
- `web_search` - Search for tools/solutions

**Sequential Thinking MCP:**
- `analyze_problem` - Break down issues
- `generate_strategy` - Create plans
- `evaluate_options` - Compare approaches

**Firecrawl MCP:**
- `scrape` - Extract web content
- `crawl` - Scrape multiple pages

### 21.2 Common MCP Workflows

**(Documented throughout the guide in Phase 7)**

---

## 22. Comprehensive Checklists

### 22.1 Pre-Optimization Checklist

- [ ] Create backup branch
- [ ] Document current performance (Lighthouse score)
- [ ] Take screenshots of all pages
- [ ] Run CSS inventory script
- [ ] Run font inventory script
- [ ] List all dynamic JavaScript classes
- [ ] Set up rollback procedure
- [ ] Configure staging environment
- [ ] Install all required tools
- [ ] Verify build process works

### 22.2 Font Optimization Checklist

- [ ] Audit all font files vs @font-face declarations
- [ ] Delete unused font files
- [ ] Remove non-subset duplicates
- [ ] Verify all fonts use WOFF2 format
- [ ] Set font-display: swap for critical fonts
- [ ] Set font-display: optional for decorative fonts
- [ ] Implement font metric matching for critical fonts
- [ ] Create CSS variables for font families
- [ ] Replace all hardcoded font-family declarations
- [ ] Optimize preload tags (max 2 fonts)
- [ ] Ensure crossorigin attribute on preloads
- [ ] Test font loading on slow network
- [ ] Measure CLS score (target <0.1)
- [ ] Verify no FOIT on any page

### 22.3 CSS Architecture Checklist

- [ ] All files follow naming conventions (BEM)
- [ ] No file exceeds 500 lines
- [ ] CSS variables defined for all design tokens
- [ ] Responsive styles co-located with components
- [ ] No duplicate selectors
- [ ] No overly specific selectors (>30 specificity)
- [ ] Minimal use of !important
- [ ] All colors use CSS variables
- [ ] All spacing uses CSS variables
- [ ] Proper import order in main.css
- [ ] Comments at file level explaining purpose
- [ ] README documents structure

### 22.4 Performance Optimization Checklist

- [ ] CSS minification enabled
- [ ] CSS code splitting enabled
- [ ] PurgeCSS configured and tested
- [ ] Critical CSS extracted (<14KB)
- [ ] Critical CSS inlined in HTML
- [ ] Non-critical CSS loaded async
- [ ] Gzip/Brotli compression enabled
- [ ] Cache headers set (1 year for fonts/CSS)
- [ ] CSS containment added to large components
- [ ] Bundle size <100KB gzipped
- [ ] Unused CSS <5%
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] Lighthouse score >90

### 22.5 Testing Checklist

- [ ] Visual regression tests (desktop)
- [ ] Visual regression tests (mobile)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] All interactive elements work
- [ ] All hover states work
- [ ] Modals/dropdowns function
- [ ] Form validation displays
- [ ] Navigation states correct
- [ ] Mobile menu works
- [ ] Loading states display
- [ ] Error messages styled
- [ ] Performance budget met
- [ ] No console errors
- [ ] Accessibility tested

---

## 23. Common Issues & Solutions

### 23.1 Font Loading Issues

**Issue: Text invisible for 3 seconds (FOIT)**
```
Cause: font-display: block or auto
Solution: Change to font-display: swap
```

**Issue: Layout shift when font loads (High CLS)**
```
Cause: Mismatched fallback font metrics
Solution: Implement font metric matching with size-adjust
```

**Issue: Fonts load slowly**
```
Cause: Not preloaded
Solution: Add <link rel="preload"> for critical fonts
```

**Issue: Preload not working**
```
Cause: Missing crossorigin attribute
Solution: Add crossorigin="anonymous" to preload tag
```

### 23.2 PurgeCSS Issues

**Issue: Styles missing after purge**
```
Cause: Dynamic classes not in safelist
Solution: Add to safelist or use regex pattern
```

**Issue: Too aggressive purging**
```
Cause: Extractor not matching all class patterns
Solution: Improve defaultExtractor regex
```

**Issue: Pseudo-classes removed**
```
Cause: Not detected in HTML
Solution: Add to safelist: /^.*:hover$/, /^.*:focus$/
```

### 23.3 Build Issues

**Issue: CSS not minifying**
```
Cause: cssMinify: false in config
Solution: Set cssMinify: true
```

**Issue: Source maps in production**
```
Cause: sourcemap: true
Solution: Set sourcemap: false for production
```

**Issue: Large bundle size**
```
Cause: Not purging unused CSS
Solution: Enable and configure PurgeCSS
```

---

## 24. Code Snippet Library

### 24.1 CSS Variable Template

```css
/* css/01-settings/_colors.css */
:root {
  /* Primary palette */
  --color-primary: #3498db;
  --color-primary-dark: #2980b9;
  --color-primary-light: #5dade2;
  
  /* Accent colors */
  --color-accent-cyan: #00bcd4;
  --color-accent-magenta: #e91e63;
  
  /* Neutrals */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-100: #f8f9fa;
  --color-gray-200: #e9ecef;
  --color-gray-600: #6c757d;
  --color-gray-900: #212529;
  
  /* Semantic colors */
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;
  --color-info: #17a2b8;
}
```

```css
/* css/01-settings/_typography.css */
:root {
  /* Font families */
  --font-heading: 'Orbitron', 'Orbitron-Fallback', sans-serif;
  --font-body: 'Rajdhani', 'Rajdhani-Fallback', sans-serif;
  --font-mono: 'Courier New', monospace;
  
  /* Font sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Font weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;
  
  /* Line heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

```css
/* css/01-settings/_spacing.css */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

### 24.2 Font Face Template

```css
/* fonts.css */

/* Primary heading font - Orbitron */
@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Regular-subset.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/Orbitron-Bold-subset.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Metric-matched fallback for Orbitron */
@font-face {
  font-family: 'Orbitron-Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 20%;
}

/* Body font - Rajdhani */
@font-face {
  font-family: 'Rajdhani';
  src: url('./fonts/Rajdhani-Regular-subset.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Metric-matched fallback for Rajdhani */
@font-face {
  font-family: 'Rajdhani-Fallback';
  src: local('Arial');
  size-adjust: 102%;
  ascent-override: 92%;
  descent-override: 24%;
}
```

---

## 25. Resources & Further Reading

### 25.1 Official Documentation

**CSS Performance:**
- [web.dev - Optimize CSS](https://web.dev/fast/#optimize-your-css)
- [MDN - CSS Performance](https://developer.mozilla.org/en-US/docs/Learn/Performance/CSS)
- [Google - Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)

**Font Loading:**
- [web.dev - Font Best Practices](https://web.dev/font-best-practices/)
- [MDN - font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [CSS Tricks - Font Loading](https://css-tricks.com/the-best-font-loading-strategies-and-how-to-execute-them/)

**Core Web Vitals:**
- [web.dev - Core Web Vitals](https://web.dev/vitals/)
- [LCP Optimization](https://web.dev/optimize-lcp/)
- [CLS Optimization](https://web.dev/optimize-cls/)

### 25.2 Tools & Libraries

**CSS Analysis:**
- [PurgeCSS](https://purgecss.com/)
- [UnCSS](https://github.com/uncss/uncss)
- [CSS Nano](https://cssnano.co/)
- [Stylelint](https://stylelint.io/)

**Font Tools:**
- [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
- [Fonttools (subsetting)](https://github.com/fonttools/fonttools)
- [Glyphhanger](https://github.com/zachleat/glyphhanger)

**Performance Testing:**
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Playwright](https://playwright.dev/)
- [WebPageTest](https://www.webpagetest.org/)

### 25.3 Articles & Guides

**Must-Read Articles:**
1. "The Three C's: Concatenate, Compress, Cache" - Harry Roberts
2. "Font Loading Strategies" - Zach Leatherman
3. "Critical CSS and Webpack" - Ben Edelstein
4. "Eliminating Render-Blocking CSS" - Google Developers

**Case Studies:**
- [Smashing Magazine CSS Performance](https://www.smashingmagazine.com/2021/03/css-generators/)
- [CSS Tricks - Font Performance](https://css-tricks.com/the-fastest-google-fonts/)

---

## Conclusion

This comprehensive master guide provides everything needed to audit, optimize, and maintain CSS and font architectures at an industry-standard level. By following the 7-week implementation roadmap and utilizing the automation scripts provided, you can achieve:

- **60%+ CSS bundle size reduction**
- **70%+ font file reduction**
- **50%+ LCP improvement**
- **76%+ CLS improvement**
- **Lighthouse scores >90**

### Next Steps

1. **Start with Week 1** - Run comprehensive audit
2. **Follow roadmap sequentially** - Don't skip steps
3. **Test thoroughly** - Visual regression at each phase
4. **Monitor continuously** - Set up ongoing monitoring
5. **Maintain gains** - Regular quarterly audits

### Support & Updates

This guide is current as of January 2025. For the latest best practices:
- Follow web.dev updates
- Monitor Chrome DevTools releases
- Subscribe to performance newsletters
- Participate in web performance communities

**Good luck with your optimization journey! 🚀**

---

**Document Version:** 3.0 Master Consolidated Edition  
**Total Pages:** ~110 pages  
**Last Updated:** January 2025  
**License:** Use freely for any project

---

*End of Master Guide*
