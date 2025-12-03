# Responsive Design Guide

## Overview

This guide documents the comprehensive responsive design system implemented for Logi-Ink. The system uses modern CSS features including container queries, fluid typography, and mobile-first breakpoints to ensure optimal performance and user experience across all devices.

## Breakpoint System

### Breakpoints

The site uses a mobile-first approach with the following breakpoints:

- **xs (Base)**: 0px - Mobile devices (default styles)
- **sm**: 640px - Small tablets, large phones
- **md**: 768px - Tablets
- **lg**: 1024px - Small desktops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large desktops

### Usage

```css
/* Mobile-first: Base styles apply to all sizes */
.element {
  /* Mobile styles */
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    /* Tablet styles */
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    /* Desktop styles */
  }
}
```

## Container Queries

Container queries allow components to adapt based on their container size, not just the viewport. This makes components more reusable and flexible.

### Browser Support

- Safari 16+
- Chrome 105+
- Firefox 110+

Older browsers fall back to media queries.

### Usage

```css
/* Establish containment context */
.card-container {
  container-type: inline-size;
  container-name: card-container;
}

/* Query container size */
@container card-container (min-width: 400px) {
  .card {
    padding: var(--space-10);
  }
}
```

### Container Query Units

- `cqw`: 1% of container width
- `cqh`: 1% of container height
- `cqi`: 1% of container inline size
- `cqb`: 1% of container block size
- `cqmin`: Smaller of cqi or cqb
- `cqmax`: Larger of cqi or cqb

```css
@container (min-width: 320px) {
  .card-title {
    font-size: clamp(1.25rem, 5cqi, 2rem);
  }
}
```

## Fluid Typography

Fluid typography scales smoothly between breakpoints using `clamp()`.

### Utility Classes

- `.fluid-hero-title` - Largest scale for hero sections
- `.fluid-section-title` - Section headings
- `.fluid-card-title` - Card titles
- `.fluid-body` - Body text
- `.fluid-small` - Small text

### Custom Implementation

```css
.fluid-heading {
  font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem);
  line-height: 1.2;
}
```

### Container Query Typography

```css
.container-fluid-text {
  container-type: inline-size;
}

@container (min-width: 320px) {
  .container-fluid-text h1 {
    font-size: clamp(1.5rem, 5cqi, 3rem);
  }
}
```

## Responsive Images

### Aspect Ratio Containers

```html
<div class="responsive-image-wrapper aspect-video">
  <img src="image.jpg" alt="Description" loading="lazy" />
</div>
```

### Available Aspect Ratios

- `.aspect-square` - 1:1
- `.aspect-video` - 16:9
- `.aspect-4-3` - 4:3
- `.aspect-3-2` - 3:2
- `.aspect-21-9` - 21:9

### Responsive Image Classes

- `.hero-image` - Full viewport height hero images
- `.card-image` - 16:9 card images
- `.thumbnail-image` - 1:1 thumbnail images

## Performance Optimizations

### Mobile Optimizations

On mobile devices (max-width: 768px):

- Reduced animation duration (0.3s max)
- Disabled 3D transforms
- Simplified scroll reveals
- Hidden particle effects
- Disabled cursor effects
- Scroll-based background attachments

### Containment

Components use CSS containment to improve performance:

```css
.service-card {
  contain: layout style paint;
}
```

### Content Visibility

Off-screen content uses `content-visibility` for better performance:

```css
section:not(:target) {
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}
```

## Responsive Utilities

### Show/Hide Utilities

```html
<!-- Hide on mobile, show on larger screens -->
<div class="hide-mobile">Desktop only content</div>

<!-- Show on mobile, hide on larger screens -->
<div class="show-mobile">Mobile only content</div>
```

### Text Alignment

```html
<div class="text-left-md">Left aligned on tablet+</div>
<div class="text-center-md">Center aligned on tablet+</div>
<div class="text-right-md">Right aligned on tablet+</div>
```

## Best Practices

### 1. Mobile-First Approach

Always start with mobile styles and enhance for larger screens:

```css
/* ✅ Good - Mobile first */
.button {
  padding: 0.75rem 1rem; /* Mobile */
}

@media (min-width: 768px) {
  .button {
    padding: 1rem 1.5rem; /* Tablet+ */
  }
}

/* ❌ Bad - Desktop first */
.button {
  padding: 1rem 1.5rem; /* Desktop */
}

@media (max-width: 767px) {
  .button {
    padding: 0.75rem 1rem; /* Mobile */
  }
}
```

### 2. Use Container Queries for Components

Use container queries for component-level responsiveness:

```css
/* ✅ Good - Container query */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    /* Styles based on container */
  }
}

/* ❌ Avoid - Media query for component */
@media (min-width: 768px) {
  .card {
    /* Styles based on viewport */
  }
}
```

### 3. Fluid Typography

Use `clamp()` for typography that scales smoothly:

```css
/* ✅ Good - Fluid typography */
.title {
  font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem);
}

/* ❌ Avoid - Fixed breakpoints */
@media (min-width: 768px) {
  .title {
    font-size: 2rem;
  }
}
```

### 4. Responsive Images

Always use responsive images with proper aspect ratios:

```html
<!-- ✅ Good - Responsive image -->
<div class="responsive-image-wrapper aspect-video">
  <img src="image.jpg" alt="Description" loading="lazy" />
</div>

<!-- ❌ Avoid - Fixed dimensions -->
<img src="image.jpg" width="800" height="600" />
```

### 5. Performance Considerations

- Use `contain` for isolated components
- Disable expensive effects on mobile
- Use `content-visibility` for off-screen content
- Optimize animations for mobile devices

## Testing

### E2E Tests

Responsive behavior is tested with Playwright across multiple viewport sizes:

```bash
npm run test:e2e
```

Tests cover:
- Navigation adaptation
- Hero section responsiveness
- Grid layouts
- Container queries
- Image responsiveness
- Typography scaling
- Modal responsiveness
- Performance optimizations

### Manual Testing

Test on real devices or use browser DevTools:

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at different breakpoints:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1280px
   - Large Desktop: 1920px

## File Structure

```
css/
├── utils/
│   ├── _responsive-breakpoints.css    # Breakpoint definitions
│   ├── _responsive-images.css         # Image utilities
│   ├── _fluid-typography.css          # Typography system
│   ├── _performance-optimizations.css # Performance tweaks
│   └── responsive.css                 # Main responsive styles
├── components/
│   └── cards/
│       └── _card-container-queries.css # Container queries for cards
└── main.css                           # Imports all modules
```

## Resources

- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: Fluid Typography](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Can I Use: Container Queries](https://caniuse.com/css-container-queries)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)

## Changelog

### 2025-01-30
- Added comprehensive responsive design system
- Implemented container queries for components
- Enhanced breakpoint system (640px, 1280px, 1536px)
- Added fluid typography utilities
- Added responsive image utilities
- Added performance optimizations for mobile
- Created E2E tests for responsive behavior

