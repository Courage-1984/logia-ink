# CSS Variables & Design Tokens Inventory

**Date:** 2025-01-27  
**Phase:** 1 - Discovery & Inventory  
**Status:** Complete

---

## Executive Summary

**Total CSS Variables Found:** 83 declarations across 6 files  
**Primary Location:** `css/variables.css` (18 root-level variables)  
**Component-Scoped Variables:** 65 variables in component files

**Status:** ✅ **Good** - Using CSS custom properties for design tokens

---

## Root-Level Variables (`css/variables.css`)

### Color Palette (18 variables)

#### Background Colors
```css
--bg-primary: #0a0a0a;      /* Deep Black - main background */
--bg-secondary: #1a1a2e;    /* Dark Blue-Black - cards, sections */
--bg-tertiary: #16213e;     /* Navy Blue - tertiary backgrounds */
```

#### Accent Colors
```css
--accent-cyan: #00ffff;     /* Electric Cyan - primary accent */
--accent-magenta: #ff00ff;  /* Hot Magenta - secondary accent */
--accent-green: #00ff00;    /* Electric Green - success states */
--accent-blue: #0066ff;      /* Electric Blue - info states */
--accent-pink: #ff0080;      /* Hot Pink - error states */
--accent-gold: #ffb347;     /* Neon Gold - iteration highlights */
```

#### Text Colors
```css
--text-primary: #ffffff;     /* White - primary text */
--text-secondary: #b0b0b0;   /* Light Gray - secondary text */
--text-muted: #666666;       /* Gray - muted text */
```

#### Glow Effects
```css
--glow-cyan: rgba(0, 255, 255, 0.5);
--glow-magenta: rgba(255, 0, 255, 0.5);
--glow-green: rgba(0, 255, 0, 0.5);
--glow-blue: rgba(0, 102, 255, 0.5);
--glow-pink: rgba(255, 0, 128, 0.5);
--glow-gold: rgba(255, 179, 71, 0.45);
```

---

## Component-Scoped Variables

### Offer Panel Variables (`css/components/cards/_offer-panel.css`)

**23 variables** - Color variants and animation offsets

```css
/* Base panel variables */
--panel-accent: var(--accent-cyan);
--panel-glow: var(--glow-cyan);

/* Color variant overrides */
.offer-panel--cyan {
  --panel-accent: var(--accent-cyan);
  --panel-glow: var(--glow-cyan);
  --offer-enter-x: -80px;
}

.offer-panel--magenta {
  --panel-accent: var(--accent-magenta);
  --panel-glow: var(--glow-magenta);
  --offer-enter-x: 80px;
}

/* ... similar for green, blue, pink, gold variants */
```

**Purpose:** Enables dynamic color theming and animation offsets for offer panels

### Card Animation Variables (`css/components/cards/_card-animations.css`)

**2 variables** - Rotating gradient animation

```css
@keyframes rotateGradient {
  0% {
    --angle: 0deg;
  }
  100% {
    --angle: 360deg;
  }
}
```

**Purpose:** Controls animated gradient rotation for expertise section cards

### Critical CSS Variables (`css/critical.css`)

**16 variables** - Duplicate of root variables for critical CSS

**Note:** These are duplicated in `critical.css` for inlining. Consider using a shared variables file.

---

## Variable Usage Analysis

### ✅ Strengths

1. **Consistent Color System**
   - All colors use CSS variables
   - Semantic naming (--accent-*, --bg-*, --text-*)
   - Glow effects properly abstracted

2. **Component Scoping**
   - Offer panels use scoped variables for theming
   - Animation variables properly scoped

3. **Reusability**
   - Variables referenced throughout codebase
   - Easy to maintain and update

### ⚠️ Areas for Improvement

1. **Missing Typography Variables**
   - ❌ No `--font-heading` variable
   - ❌ No `--font-body` variable
   - ❌ No font-size variables
   - ❌ No line-height variables
   - **Impact:** Font families hardcoded in multiple places

2. **Missing Spacing Variables**
   - ❌ No spacing scale (--space-1, --space-2, etc.)
   - **Impact:** Spacing values hardcoded throughout

3. **Missing Border Radius Variables**
   - ❌ No radius variables
   - **Impact:** Border-radius values hardcoded

4. **Missing Shadow Variables**
   - ❌ No shadow scale
   - **Impact:** Box-shadow values hardcoded

5. **Critical CSS Duplication**
   - Variables duplicated in `critical.css`
   - **Recommendation:** Use shared variables file or import

---

## Recommendations

### High Priority

1. **Add Typography Variables**
   ```css
   :root {
     --font-heading: 'Orbitron', 'Orbitron-Fallback', sans-serif;
     --font-body: 'Rajdhani', 'Rajdhani-Fallback', sans-serif;
     --font-size-xs: 0.75rem;
     --font-size-sm: 0.875rem;
     --font-size-base: 1rem;
     --font-size-lg: 1.125rem;
     --font-size-xl: 1.25rem;
     --font-size-2xl: 1.5rem;
     --font-size-3xl: 1.875rem;
     --font-size-4xl: 2.25rem;
   }
   ```

2. **Add Spacing Scale**
   ```css
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

3. **Add Border Radius Variables**
   ```css
   :root {
     --radius-sm: 4px;
     --radius-md: 8px;
     --radius-lg: 12px;
     --radius-xl: 16px;
   }
   ```

### Medium Priority

4. **Add Shadow Scale**
   ```css
   :root {
     --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
     --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
     --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
     --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.25);
   }
   ```

5. **Consolidate Critical CSS Variables**
   - Import variables.css in critical.css
   - Or use build-time variable injection

---

## Variable Distribution

| File | Variable Count | Type |
|------|---------------|------|
| `css/variables.css` | 18 | Root-level design tokens |
| `css/components/cards/_offer-panel.css` | 23 | Component-scoped |
| `css/critical.css` | 16 | Duplicate (for inlining) |
| `css/components/cards/_card-animations.css` | 2 | Animation variables |
| `css/utils/animations.css` | 1 | Animation variable |
| **Total** | **83** | |

---

## Next Steps

1. ✅ Document existing variables (this document)
2. ⏳ Add typography variables
3. ⏳ Add spacing scale variables
4. ⏳ Add border radius variables
5. ⏳ Add shadow scale variables
6. ⏳ Replace hardcoded values with variables
7. ⏳ Update critical.css to use shared variables

---

**Status:** Phase 1 complete - Variables documented  
**Next Phase:** Phase 2 - Performance & Usage Analysis

