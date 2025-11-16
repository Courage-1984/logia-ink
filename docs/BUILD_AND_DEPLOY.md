# Build and Deploy Guide

This guide covers how to build and deploy the Logi-Ink website.

---

## 📋 Prerequisites

- Node.js 20.x (see `.nvmrc`; run `nvm use` if available)
- npm (bundled with Node 20)
- Git (for version control)
- Optional: `npx playwright install` (one-time) to run the smoke e2e suite

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- **Vite 7.x** (multi-page build tool)
- **Sharp** (image and video optimisation helpers)
- **Playwright** (dev dependency for the smoke test suite)
- **Pa11y 9.x** (accessibility audit tool)
- Build-time plugins (`vite-plugin-compression`, `rollup-plugin-visualizer`, `vite-plugin-html-include` for processing HTML includes)

### 2. Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### 3. Build for Production

Build optimized production files:

```bash
npm run build
```

This creates a `dist/` directory with:
- Minified and optimized CSS/JS
- Optimized images
- Production-ready HTML files

### 4. Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

The preview will be available at `http://localhost:4173`

---

## 🖼️ Image Optimization

### Option 1: Optimize Existing Images

Optimize all WebP images in the project:

```bash
npm run optimize-images
```

This will:
- Compress images to 80% quality
- Resize large images (max 1920x1080)
- Create optimized versions with `-optimized` suffix
- Show size savings for each image

**Output:** Optimized images saved in the same directories with `-optimized` suffix.

**After optimization:**
1. Review the optimized images
2. Replace originals if quality is acceptable
3. Update HTML to use optimized images (or remove `-optimized` suffix)

### Option 2: Generate Responsive Images

Generate multiple sizes for responsive `srcset`:

```bash
npm run responsive-images
```

This will:
- Generate multiple sizes (480w, 768w, 1024w, 1280w, 1920w)
- Create WebP versions
- Generate HTML examples for each image

**Output:** Images saved in `assets/images/responsive/` with HTML examples.

**After generation:**
1. Review generated sizes
2. Update HTML to use responsive images (see examples below)
3. Commit generated AVIF/WebP sets stored under `assets/images/responsive/`

### Option 3: Optimise Video Backgrounds

Optimise hero or background video loops and generate poster frames:

```bash
npm run optimize-video
```

This will:
- Transcode source files to WebM (VP9) and MP4 (H.264) variants
- Generate high-quality poster images for lazy loading
- Report before/after sizes
- Copy optimised assets into `assets/video/optimized/`

**After optimisation:**
1. Replace video references in HTML/CSS with optimised outputs
2. Keep poster frames in sync with the selected hero loop

---

## 📝 Using Responsive Images

### Example 1: Background Image

```html
<picture>
  <source 
    type="image/webp" 
    srcset="
      assets/images/responsive/mission-parallax-bg-480w.webp 480w,
      assets/images/responsive/mission-parallax-bg-768w.webp 768w,
      assets/images/responsive/mission-parallax-bg-1024w.webp 1024w,
      assets/images/responsive/mission-parallax-bg-1920w.webp 1920w
    "
    sizes="(max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px"
  >
  <img 
    src="assets/images/backgrounds/mission-parallax-bg.webp" 
    alt="Mission background" 
    loading="lazy"
  >
</picture>
```

### Example 2: Hero Banner

```html
<picture>
  <source 
    type="image/webp" 
    srcset="
      assets/images/responsive/banner_home-480w.webp 480w,
      assets/images/responsive/banner_home-768w.webp 768w,
      assets/images/responsive/banner_home-1024w.webp 1024w,
      assets/images/responsive/banner_home-1920w.webp 1920w
    "
    sizes="100vw"
  >
  <img 
    src="assets/images/banners/banner_home.webp" 
    alt="Hero banner" 
    loading="eager"
  >
</picture>
```

### Example 3: CSS Background Image

For CSS background images, use media queries:

```css
.hero-background {
  background-image: url('assets/images/responsive/banner_home-1920w.webp');
}

@media (max-width: 1024px) {
  .hero-background {
    background-image: url('assets/images/responsive/banner_home-1024w.webp');
  }
}

@media (max-width: 768px) {
  .hero-background {
    background-image: url('assets/images/responsive/banner_home-768w.webp');
  }
}

@media (max-width: 480px) {
  .hero-background {
    background-image: url('assets/images/responsive/banner_home-480w.webp');
  }
}
```

---

## 🏗️ Build Process

### What Happens During Build

1. **CSS Processing:**
   - All `@import` statements are resolved
   - CSS is minified and optimized
   - Unused CSS can be removed (if configured)

2. **JavaScript Processing:**
   - ES6 modules are bundled
   - Code is minified and tree-shaken
   - Console.log statements are removed
   - Source maps are generated (optional)

3. **HTML Processing:**
   - Asset paths are updated to hashed filenames
   - CSS and JS are injected
   - Images are copied (optimization handled separately via `npm run optimize-images`)

4. **Asset Copying:**
   - Images are copied (pre-optimize with `npm run optimize-images` or `npm run responsive-images`)
   - Fonts are copied
   - Favicons are copied
   - Videos are copied from `assets/video/optimized/`

### Build Output Structure

```
dist/
├── assets/
│   ├── css/
│   │   └── main-[hash].css
│   ├── js/
│   │   ├── main-[hash].js
│   │   └── about-[hash].js (page-specific)
│   └── images/
│       └── [optimized images]
├── index.html
├── about.html
├── services.html
├── projects.html
├── pricing.html
├── seo-services.html
├── contact.html
└── [other static files]
```

---

## 🧪 Testing & QA

- **Playwright smoke suite:** `npm run test:e2e` (builds production output first, then runs `tests/e2e/smoke.spec.js`)
  - First run only: `npx playwright install`
  - Coverage: navigation (desktop + mobile), scroll progress/back-to-top, services modals, contact form happy/error paths, service worker registration
- **Manual helpers:**
  - `http://localhost:3000/tests/test-service-worker.html`
  - `http://localhost:3000/tests/test-fonts.html`

Run the smoke suite prior to shipping major content or interaction changes.

---

## 🚢 Deployment

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

#### Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build command:**
   ```bash
   npm run build
   ```

3. **Publish directory:**
   ```
   dist
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

   Or connect your Git repository in Netlify dashboard.

#### Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

   Or connect your Git repository in Vercel dashboard.

#### GitHub Pages

1. **Install gh-pages (optional but recommended for CLI deploys):**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Build for GitHub Pages (ensures correct base path with relative assets):**
   ```bash
   npm run build:gh-pages
   ```

   The script sets `VITE_BASE_PATH=./`, so every asset is referenced relatively (`./assets/...`). It also exports `VITE_DISABLE_SW=true`, which skips service-worker caching on GitHub Pages (preventing stale styles or assets). That keeps the build working on both `https://<user>.github.io/logi-ink/` and any custom domain you wire up later.

   ```bash
   # Produce a GitHub Pages artefact in dist-gh-pages/ for CI workflows
   npm run build:gh-pages:ci

   # Need both bundles locally? Run both jobs sequentially
   npm run build:dual
   ```

   `build:gh-pages:ci` writes to `dist-gh-pages/`, which works well for GitHub Actions artefact uploads.

3. **Deploy (if using gh-pages CLI):**
   ```bash
   gh-pages -d dist
   ```

   > If you trigger deployments via GitHub Actions, run the `build:gh-pages` script (or set `VITE_BASE_PATH=/logi-ink/`) before publishing the `dist/` folder.

### Option 2: Traditional Web Hosting (FTP)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` contents:**
   - Upload all files from `dist/` to your web server
   - Ensure `index.html` is in the root directory
   - Maintain directory structure

3. **Configure server:**
   - Set up redirects for clean URLs (if needed)
   - Configure HTTPS
   - Set up caching headers

### Option 3: Docker (Advanced)

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t logi-ink .
docker run -p 80:80 logi-ink
```

---

## ⚙️ Environment-Specific Configuration

### Development vs Production

Vite automatically handles environment differences:

- **Development:** Source maps, unminified code, HMR
- **Production:** Minified, optimized, no source maps (unless configured)

### Custom Build Configuration

Edit `vite.config.js` to customize:

```javascript
export default defineConfig({
  build: {
    // Production-specific settings
    minify: 'terser',
    sourcemap: false, // Set to true for production debugging
    // ...
  },
});
```

---

## 📊 Performance Checklist

Before deploying, verify:

- [ ] All images are optimized
- [ ] CSS is minified
- [ ] JavaScript is minified
- [ ] Unused code is removed
- [ ] Gzip/Brotli compression is enabled (server-side)
- [ ] Caching headers are configured
- [ ] HTTPS is enabled
- [ ] Lighthouse score is > 90

### Run Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

---

## 🔧 Troubleshooting

### Build Fails

**Issue:** Build errors or warnings

**Solution:**
- Check Node.js version (requires 20+)
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for syntax errors in source files
- Review Vite build output for specific errors
- On Windows, run the clean command via Git Bash/WSL or install `rimraf` (`npm run clean` relies on `rm -rf`)

### Images Not Loading

**Issue:** Images return 404 after build

**Solution:**
- Ensure images are in `assets/images/` directory
- Check that image paths are relative (not absolute)
- Verify Vite asset handling configuration

### CSS Not Applying

**Issue:** Styles not working in production

**Solution:**
- Check that CSS imports are correct
- Verify `css/main.css` is imported in HTML
- Check browser console for CSS loading errors
- Ensure CSS file paths are correct in built HTML

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Guide](https://developers.google.com/speed/webp)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

**Last Updated:** 2025-11-16 (Removed vite-plugin-imagemin, upgraded Vite to 7.x and Pa11y to 9.x)

