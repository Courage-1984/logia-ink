# Logi-Ink Website Style Guide

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Form Elements](#form-elements)
7. [Browser UI Elements](#browser-ui-elements)
8. [Animations & Effects](#animations--effects)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)
11. [Usage Examples](#usage-examples)

---

## Design Philosophy

The Logi-Ink website follows a **cyberpunk aesthetic** with:
- **Dark backgrounds** with neon accent colors
- **High contrast** for readability
- **Glowing effects** on interactive elements
- **Futuristic typography** (Orbitron for headings, Rajdhani for body)
- **Smooth animations** and transitions
- **Grid patterns** and particle effects for depth

---

## Color Palette

### Primary Colors

| Color | Hex Code | Variable | Usage |
|-------|----------|----------|-------|
| Deep Black | `#0a0a0a` | `--bg-primary` | Main background |
| Dark Blue-Black | `#1a1a2e` | `--bg-secondary` | Secondary backgrounds, cards |
| Navy Blue | `#16213e` | `--bg-tertiary` | Tertiary backgrounds |

### Accent Colors

| Color | Hex Code | Variable | Glow Variable | Usage |
|-------|----------|----------|---------------|-------|
| Electric Cyan | `#00ffff` | `--accent-cyan` | `--glow-cyan` | Primary accent, primary buttons, links |
| Hot Magenta | `#ff00ff` | `--accent-magenta` | `--glow-magenta` | Secondary accent, secondary buttons |
| Electric Green | `#00ff00` | `--accent-green` | `--glow-green` | Success states, positive actions |
| Electric Blue | `#0066ff` | `--accent-blue` | `--glow-blue` | Info states, additional accents |
| Hot Pink | `#ff0080` | `--accent-pink` | `--glow-pink` | Error states, warnings |

### Text Colors

| Color | Hex Code | Variable | Usage |
|-------|----------|----------|-------|
| White | `#ffffff` | `--text-primary` | Primary text |
| Light Gray | `#b0b0b0` | `--text-secondary` | Secondary text, descriptions |
| Gray | `#666666` | `--text-muted` | Muted text, timestamps |

### Color Usage Rules

- **Cyan** is the primary brand color - use for primary actions, active states, and highlights
- **Magenta** complements cyan for secondary actions
- **Green** indicates success, positive states, and completed actions
- **Blue** is for informational content and additional accents
- **Pink** is for errors, warnings, and critical states

---

## Typography

### Font Families

```css
/* Headings & Display Text */
font-family: 'Orbitron', sans-serif;

/* Body Text & UI Elements */
font-family: 'Rajdhani', sans-serif;
```

### Font Sizes

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | `clamp(3rem, 8vw, 6rem)` | 900 | 1.1 |
| H1 (Page) | `clamp(2.5rem, 6vw, 4.5rem)` | 900 | 1.1 |
| H2 (Section) | `clamp(2rem, 5vw, 3.5rem)` | 900 | 1.2 |
| H3 | `1.5rem - 2rem` | 700 | 1.3 |
| H4 | `1.2rem` | 700 | 1.4 |
| Body | `1rem` | 400 | 1.6 |
| Small | `0.875rem` | 400 | 1.5 |
| Button | `1rem` | 700 | 1.2 |

### Typography Classes

```html
<!-- Heading styles are applied via classes -->
<h1 class="hero-title">Hero Title</h1>
<h2 class="section-title">Section Title</h2>
<p class="section-subtitle">Section Subtitle</p>
```

### Text Utilities

- **Uppercase**: Used for navigation links, buttons, labels
- **Letter Spacing**: 1-3px for headings and uppercase text
- **Text Shadows**: Glow effects on headings and accents
- **Text Transforms**: Uppercase for buttons and navigation

---

## Spacing & Layout

### Container

```css
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}
```

### Section Spacing

- **Section Padding**: `6rem 0` (96px vertical)
- **Section Header Margin**: `4rem` bottom margin
- **Card Padding**: `2rem - 2.5rem`
- **Grid Gaps**: `2rem` (32px)

### Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| xs | `0.25rem` (4px) | Badge padding |
| sm | `0.5rem` (8px) | Small margins |
| md | `1rem` (16px) | Standard spacing |
| lg | `1.5rem` (24px) | Medium spacing |
| xl | `2rem` (32px) | Large spacing |
| xxl | `3rem` (48px) | Extra large spacing |
| xxxl | `4rem` (64px) | Section spacing |

---

## Components

### Buttons

#### Primary Button (Cyan)
```html
<a href="#" class="btn btn-primary">Primary Action</a>
```

#### Secondary Button (Magenta)
```html
<a href="#" class="btn btn-secondary">Secondary Action</a>
```

#### Outline Button
```html
<a href="#" class="btn btn-outline">Outline Button</a>
```

#### Large Button
```html
<a href="#" class="btn btn-primary btn-large">Large Button</a>
```

**Button States:**
- Default: Transparent background with colored border
- Hover: Background fills with accent color, text inverts
- Focus: Enhanced glow effect
- Disabled: 50% opacity, not-allowed cursor

### Cards

#### Service Card
```html
<div class="service-card">
    <div class="service-icon">
        <div class="icon-glow"></div>
        <svg>...</svg>
    </div>
    <h3>Service Title</h3>
    <p>Service description</p>
    <a href="#" class="service-link">Learn More →</a>
</div>
```

#### Project Card
```html
<div class="project-card-large">
    <div class="project-image">
        <div class="project-overlay"></div>
        <div class="project-tag">Latest</div>
    </div>
    <div class="project-content">
        <span class="project-category">Category</span>
        <h3>Project Title</h3>
        <p>Project description</p>
        <a href="#" class="btn btn-outline">View Details →</a>
    </div>
</div>
```

### Badges/Labels

```html
<span class="badge">Default</span>
<span class="badge badge-magenta">Magenta</span>
<span class="badge badge-green">Green</span>
<span class="badge badge-blue">Blue</span>
<span class="badge badge-pink">Pink</span>
```

### Alerts

```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-error">Error message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-info">Info message</div>
```

### Modals

```html
<div class="modal" id="myModal">
    <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>Modal Title</h2>
        <p>Modal content</p>
    </div>
</div>
```

**JavaScript to toggle:**
```javascript
document.getElementById('myModal').classList.add('active');
document.getElementById('myModal').classList.remove('active');
```

### CTA (Call-to-Action) Section
```html
<section class="cta-section">
    <div class="container">
        <h2 class="section-title">Ready to Get Started?</h2>
        <p class="section-subtitle">Let's create something amazing together</p>
        <a href="contact.html" class="btn btn-primary btn-large">Get In Touch</a>
    </div>
</section>
```

### Hero Section
```html
<section class="hero">
    <div class="hero-background">
        <!-- Background content -->
    </div>
    <div class="hero-content">
        <h1 class="hero-title text-reveal">Your Title Here</h1>
        <p class="hero-subtitle fade-in-up">Your subtitle</p>
        <div class="hero-buttons">
            <a href="#" class="btn btn-primary">Primary Action</a>
            <a href="#" class="btn btn-outline">Secondary Action</a>
        </div>
    </div>
</section>
```

### Navigation
```html
<nav class="navbar" id="navbar">
    <div class="nav-container">
        <a href="index.html" class="nav-logo">Logi-Ink</a>
        <ul class="nav-menu" id="navMenu">
            <li><a href="index.html" class="nav-link">Home</a></li>
            <li><a href="about.html" class="nav-link">About</a></li>
            <!-- More links -->
        </ul>
        <button class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>
```

### Footer
```html
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3>Company</h3>
            <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="services.html">Services</a></li>
            </ul>
        </div>
        <!-- More sections -->
    </div>
    <div class="footer-bottom">
        <p>&copy; 2024 Logi-Ink. All rights reserved.</p>
    </div>
</footer>
```

### Parallax Section
```html
<section class="parallax-section mission-parallax">
    <div class="parallax-background"></div>
    <div class="parallax-overlay"></div>
    <div class="container">
        <h2 class="section-title">Mission Statement</h2>
        <!-- Content -->
    </div>
</section>
```

### Back to Top Button
```html
<a href="#" class="back-to-top" aria-label="Back to top"></a>
```

### Tooltips

```html
<span data-tooltip="Tooltip text">Hover me</span>
```

### Loading Spinners

```html
<div class="spinner"></div>
<div class="spinner spinner-large"></div>
<div class="spinner spinner-small"></div>
```

### Tabs

```html
<div class="tabs">
    <ul class="tab-list">
        <li><button class="tab-button active">Tab 1</button></li>
        <li><button class="tab-button">Tab 2</button></li>
    </ul>
</div>
<div class="tab-content active">Tab 1 content</div>
<div class="tab-content">Tab 2 content</div>
```

### Accordions

```html
<details>
    <summary>Accordion Title</summary>
    <p>Accordion content goes here</p>
</details>
```

### Breadcrumbs

```html
<nav class="breadcrumbs">
    <a href="#">Home</a>
    <span class="separator">/</span>
    <a href="#">Section</a>
    <span class="separator">/</span>
    <span>Current Page</span>
</nav>
```

### Tables

```html
<table>
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </tbody>
</table>
```

### Code Blocks

```html
<code>Inline code</code>

<pre>
<code>
// Code block
function example() {
    return true;
}
</code>
</pre>
```

### Blockquotes

```html
<blockquote>
    This is a quote from someone important.
</blockquote>
```

### Dividers

```html
<!-- Horizontal -->
<div class="divider"></div>

<!-- Vertical (in flex container) -->
<div class="divider-vertical"></div>
```

### Empty States

```html
<div class="empty-state">
    <div class="empty-state-icon">📭</div>
    <h3>No items found</h3>
    <p>There are no items to display at this time.</p>
</div>
```

### Skeleton Loading

```html
<div class="skeleton skeleton-title"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-image"></div>
```

### Toasts/Notifications

```html
<div class="toast success show">
    <div class="toast-header">
        <strong>Success!</strong>
        <button class="toast-close">&times;</button>
    </div>
    <p>Your action was successful.</p>
</div>
```

---

## Form Elements

### Text Input

```html
<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
</div>
```

### Textarea

```html
<div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" required></textarea>
</div>
```

### Select Dropdown

```html
<div class="form-group">
    <label for="category">Category</label>
    <select id="category" name="category">
        <option value="">Select...</option>
        <option value="1">Option 1</option>
    </select>
</div>
```

### Checkbox

```html
<input type="checkbox" id="agree" name="agree">
<label for="agree">I agree</label>

<!-- Color variants -->
<input type="checkbox" class="magenta" id="magenta">
<input type="checkbox" class="green" id="green">
<input type="checkbox" class="blue" id="blue">
<input type="checkbox" class="pink" id="pink">
```

### Radio Button

```html
<input type="radio" id="option1" name="options" value="1">
<label for="option1">Option 1</label>

<!-- Color variants -->
<input type="radio" class="magenta" id="radio-magenta">
<input type="radio" class="green" id="radio-green">
```

### Range Slider

```html
<input type="range" min="0" max="100" value="50">

<!-- Color variants -->
<input type="range" class="magenta" min="0" max="100">
<input type="range" class="green" min="0" max="100">
```

### Progress Bar

```html
<progress value="75" max="100"></progress>

<!-- Color variants -->
<progress class="magenta" value="75" max="100"></progress>
<progress class="green" value="75" max="100"></progress>
<progress class="rainbow" value="75" max="100"></progress>
```

### Form States

```html
<!-- Error state -->
<div class="form-group error">
    <label for="email">Email</label>
    <input type="email" id="email" name="email">
    <span class="form-error-message">Invalid email address</span>
</div>

<!-- Success state -->
<div class="form-group success">
    <label for="email">Email</label>
    <input type="email" id="email" name="email">
    <span class="form-success-message">Valid email</span>
</div>
```

### Color Variants for Inputs

Add classes to inputs for color customization:

```html
<input type="text" class="magenta" placeholder="Magenta input">
<input type="text" class="green" placeholder="Green input">
<input type="text" class="blue" placeholder="Blue input">
<input type="text" class="pink" placeholder="Pink input">
```

---

## Browser UI Elements

### Scrollbar

Default scrollbar is **cyan** (#00ffff). Color variants available:

```html
<!-- Apply to container or body -->
<div class="magenta-scrollbar">Content...</div>
<div class="green-scrollbar">Content...</div>
<div class="blue-scrollbar">Content...</div>
<div class="pink-scrollbar">Content...</div>
```

### Text Selection

Text selection uses cyan highlight by default. Styled via `::selection` pseudo-element.

### Focus Outlines

All focusable elements have cyan focus outlines with glow effect. Use `:focus-visible` for keyboard navigation.

### Placeholders

Input placeholders use cyan at 40% opacity. Color variants available via input classes.

### Caret/Cursor

Text cursor in inputs is cyan. Color variants available via input classes.

### Autofill

Autofilled inputs maintain dark background with cyan border.

### Textarea Resize Handle

Cyan border and background on resize handle.

---

## Animations & Effects

### Scroll Animations

```html
<div class="fade-in-up">Content that fades in on scroll</div>
```

### Text Reveal

```html
<span class="text-reveal">Text that reveals</span>
<span class="text-reveal delay-1">With delay</span>
```

### Fade In

```html
<div class="fade-in">Fades in on load</div>
<div class="fade-in delay-4">With delay</div>
```

### Hover Effects

- **Buttons**: Background fill animation
- **Cards**: Translate up and scale on hover
- **Links**: Underline animation from left to right
- **Icons**: Color change and glow increase

### Glow Effects

Applied via `box-shadow` and `text-shadow`:
- Subtle glow: `0 0 10px var(--glow-cyan)`
- Medium glow: `0 0 20px var(--glow-cyan)`
- Strong glow: `0 0 30px var(--glow-cyan)`

### Grid Animation

Animated grid overlay in hero sections with continuous movement.

### Particle Effects

Floating particles in hero backgrounds with color variations.

---

## Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
    /* Mobile styles */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet styles */
}

/* Desktop */
@media (min-width: 1025px) {
    /* Desktop styles */
}
```

### Mobile Navigation

- Hamburger menu appears at 768px and below
- Navigation menu slides in from left
- Full-width buttons on mobile
- Stacked card layouts

### Responsive Typography

- Uses `clamp()` for fluid typography
- Minimum and maximum sizes defined
- Scales smoothly between breakpoints

---

## Accessibility

### Skip Link

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### ARIA Labels

Always include appropriate ARIA labels for interactive elements:

```html
<button aria-label="Close modal" class="modal-close">&times;</button>
<button aria-expanded="false" aria-controls="menu">Menu</button>
```

### Focus Management

- All interactive elements are keyboard accessible
- Focus outlines are clearly visible
- Tab order follows logical flow
- Skip links for main content

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- Include alt text for images
- Use `<label>` for all form inputs

### Color Contrast

- Text meets WCAG AA standards
- Interactive elements have sufficient contrast
- Focus states are clearly visible

---

## Usage Examples

### Complete Form Example

```html
<form>
    <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" name="name" required>
    </div>
    
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" class="magenta" required>
        <span class="form-error-message"></span>
    </div>
    
    <div class="form-group">
        <label for="category">Category</label>
        <select id="category" name="category">
            <option value="">Select a category</option>
            <option value="web">Web Development</option>
            <option value="design">Design</option>
        </select>
    </div>
    
    <div class="form-group">
        <label>
            <input type="checkbox" name="newsletter">
            Subscribe to newsletter
        </label>
    </div>
    
    <button type="submit" class="form-submit">Submit</button>
</form>
```

### Modal Example

```html
<button onclick="openModal()">Open Modal</button>

<div class="modal" id="exampleModal">
    <div class="modal-content">
        <button class="modal-close" onclick="closeModal()">&times;</button>
        <h2>Modal Title</h2>
        <p>Modal content goes here.</p>
        <div class="alert alert-info">
            This is an info alert inside the modal.
        </div>
    </div>
</div>

<script>
function openModal() {
    document.getElementById('exampleModal').classList.add('active');
}
function closeModal() {
    document.getElementById('exampleModal').classList.remove('active');
}
</script>
```

### Card Grid Example

```html
<div class="services-grid">
    <div class="service-card">
        <div class="service-icon">
            <div class="icon-glow"></div>
            <svg>...</svg>
        </div>
        <h3>Service Title</h3>
        <p>Service description text.</p>
        <a href="#" class="service-link">Learn More →</a>
    </div>
    <!-- Repeat cards -->
</div>
```

### Tabbed Content Example

```html
<div class="tabs">
    <ul class="tab-list">
        <li><button class="tab-button active" onclick="switchTab(0)">Tab 1</button></li>
        <li><button class="tab-button" onclick="switchTab(1)">Tab 2</button></li>
        <li><button class="tab-button" onclick="switchTab(2)">Tab 3</button></li>
    </ul>
</div>

<div class="tab-content active">Content 1</div>
<div class="tab-content">Content 2</div>
<div class="tab-content">Content 3</div>

<script>
function switchTab(index) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.tab-content')[index].classList.add('active');
}
</script>
```

### Loading States Example

```html
<!-- Loading overlay -->
<div class="loading-overlay active">
    <div class="spinner spinner-large"></div>
</div>

<!-- Inline spinner -->
<div class="spinner"></div>

<!-- Skeleton loading -->
<div class="skeleton skeleton-title"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>
```

### Toast Notification Example

```html
<div class="toast success show" id="toast">
    <div class="toast-header">
        <strong>Success!</strong>
        <button class="toast-close" onclick="closeToast()">&times;</button>
    </div>
    <p>Your message has been sent successfully.</p>
</div>

<script>
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = `toast ${type} show`;
    toast.querySelector('p').textContent = message;
    setTimeout(() => toast.classList.remove('show'), 5000);
}
</script>
```

---

## Best Practices

### Color Usage
- Use cyan as the primary accent color
- Reserve magenta for secondary actions
- Use green for success states
- Use pink for errors and warnings
- Maintain consistency across similar elements

### Typography
- Use Orbitron only for headings and display text
- Use Rajdhani for body text and UI elements
- Maintain proper heading hierarchy
- Use appropriate font weights

### Spacing
- Follow the spacing scale consistently
- Use container class for content width
- Maintain consistent padding and margins
- Use grid gaps for card layouts

### Animations
- Keep animations smooth and purposeful
- Use transitions for hover states
- Avoid excessive animations
- Test performance on lower-end devices

### Components
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard accessibility
- Test with screen readers

### Forms
- Always include labels
- Provide error messages
- Show success states
- Use appropriate input types

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**CSS Features Used:**
- CSS Variables (Custom Properties)
- Flexbox
- Grid
- Backdrop Filter
- CSS Animations
- Modern Selectors

**Fallbacks:**
- Older browsers may not support backdrop-filter (graceful degradation)
- CSS Grid falls back to Flexbox

---

## Version History

- **v1.0** - Initial style guide with comprehensive component library
- Includes all browser UI elements, form variants, and accessibility features

---

## Contributing

When adding new components or modifying styles:
1. Follow the existing color palette
2. Maintain consistency with design patterns
3. Include hover and focus states
4. Add proper accessibility attributes
5. Test across browsers
6. Document in this style guide

---

**Last Updated:** 2024
**Maintained by:** Logi-Ink Development Team
