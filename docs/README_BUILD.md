# Quick Start - Build & Deploy

## 🚀 Installation

```bash
npm install
```

## 📝 Available Scripts

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
```

### Production Build
```bash
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

### Image Optimization
```bash
npm run optimize-images        # Optimize all images (creates -optimized versions)
npm run responsive-images      # Generate responsive image sizes
```

## 🏗️ Build Process

1. **CSS**: All `@import` statements resolved, minified, optimized
2. **JavaScript**: ES6 modules bundled, minified, tree-shaken
3. **HTML**: Asset paths updated, CSS/JS injected
4. **Images**: Optimized and copied to dist

## 🚢 Deployment

### Quick Deploy (Netlify/Vercel)
```bash
# Build command: npm run build
# Publish directory: dist
```

### Manual Deploy
```bash
npm run build
# Upload dist/ folder contents to your web server
```

See `BUILD_AND_DEPLOY.md` for detailed deployment instructions.

